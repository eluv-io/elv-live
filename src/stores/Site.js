import {observable, action, flow, computed, runInAction, toJS} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import Id from "@eluvio/elv-client-js/src/Id";

class SiteStore {
  @observable siteLibraryId;

  @observable siteInfo;
  @observable dashSupported = false;
  @observable activeTitle;
  @observable playoutUrl;
  @observable authToken;

  @observable series = [];
  @observable seasons = [];
  @observable episodes = [];
  @observable titles = [];
  @observable channels = [];
  @observable playlists = [];
  @observable searchResults = [];

  @observable searching = false;
  @observable searchQuery = "";
  @observable searchCounter = 0;
  @observable searchIndex;
  @observable searchNodes = [];

  @observable error = "";

  @computed get client() {
    return this.rootStore.client;
  }

  @computed get siteId() {
    return this.rootStore.siteId;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  Reset(isSubSite=false) {
    this.siteLibraryId = undefined;

    this.siteInfo = undefined;
    this.dashSupported = false;
    this.activeTitle = undefined;
    this.playoutUrl = undefined;
    this.authToken = undefined;

    this.series = [];
    this.seasons = [];
    this.episodes = [];
    this.titles = [];
    this.channels = [];
    this.playlists = [];

    this.searching = false;
    this.searchQuery = "";
    this.searchCounter = 0;

    if(!isSubSite) {
      this.searchIndex = undefined;
      this.searchNodes = [];
    }

    this.error = "";
  }

  @action.bound
  LoadSite = flow(function * () {
    const isSubSite = this.rootStore.history.length > 0;

    this.Reset(isSubSite);

    try {
      const availableDRMS = yield this.client.AvailableDRMs();
      this.dashSupported = availableDRMS.includes("widevine");

      this.siteLibraryId = yield this.client.ContentObjectLibraryId({objectId: this.siteId});

      const siteName = yield this.client.ContentObjectMetadata({
        libraryId: this.siteLibraryId,
        objectId: this.siteId,
        metadataSubtree: "public/name"
      });

      let siteInfo = yield this.client.ContentObjectMetadata({
        libraryId: this.siteLibraryId,
        objectId: this.siteId,
        metadataSubtree: "public/asset_metadata",
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
        select: [
          "channels",
          "episodes",
          "playlists",
          "seasons",
          "series",
          "titles",
        ]
      });

      if(!isSubSite) {
        this.searchIndex = yield this.client.ContentObjectMetadata({
          libraryId: this.siteLibraryId,
          objectId: this.siteId,
          metadataSubtree: "public/site_index"
        });

        this.searchNodes = yield this.client.ContentObjectMetadata({
          libraryId: this.siteLibraryId,
          objectId: this.siteId,
          metadataSubtree: "public/search_api"
        });
      }

      siteInfo.name = siteName;

      siteInfo.baseLinkUrl = yield this.client.LinkUrl({
        libraryId: this.siteLibraryId,
        objectId: this.siteId,
        linkPath: "public/asset_metadata"
      });

      this.series = yield this.LoadTitles("series", siteInfo.series);
      this.seasons = yield this.LoadTitles("seasons", siteInfo.seasons);
      this.episodes = yield this.LoadTitles("episodes", siteInfo.episodes);
      this.titles = yield this.LoadTitles("titles", siteInfo.titles);
      this.channels = yield this.LoadTitles("channels", siteInfo.channels);
      this.playlists = yield this.LoadPlaylists(siteInfo.playlists);

      //delete siteInfo.titles;
      //delete siteInfo.playlists;

      this.siteInfo = siteInfo;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load site:");
      // eslint-disable-next-line no-console
      console.error(this.siteLibraryId, this.siteId);
      // eslint-disable-next-line no-console
      console.error(error);

      this.rootStore.PopSiteId();
      this.rootStore.SetError("Invalid site object");
      setTimeout(() => runInAction(() => this.rootStore.SetError("")), 8000);
    }
  });

  async ImageLinks({baseLinkUrl, versionHash, images}) {
    images = images || {};

    let landscapeUrl, portraitUrl, imageUrl;
    if(images.landscape) {
      landscapeUrl = this.CreateLink(baseLinkUrl, UrlJoin("images", "landscape", "default"));
    } else if(images.main_slider_background_desktop) {
      landscapeUrl = this.CreateLink(baseLinkUrl, UrlJoin("images", "main_slider_background_desktop", "default"));
    }

    if(images.poster) {
      portraitUrl = this.CreateLink(baseLinkUrl, UrlJoin("images", "poster", "default"));
    } else if(images.primary_portrait) {
      portraitUrl = this.CreateLink(baseLinkUrl, UrlJoin("images", "primary_portrait", "default"));
    } else if(images.portrait) {
      portraitUrl = this.CreateLink(baseLinkUrl, UrlJoin("images", "portrait", "default"));
    }

    imageUrl = await this.client.ContentObjectImageUrl({versionHash});

    return {
      landscapeUrl,
      portraitUrl,
      imageUrl
    };
  }

  @action.bound
  LoadTitles = flow(function * (metadataKey, titleInfo) {
    if(!titleInfo) { return []; }

    // Titles: {[index]: {[title-key]: { ...title }}
    let titles = [];
    yield Promise.all(
      Object.keys(titleInfo).map(async index => {
        try {
          const titleKey = Object.keys(titleInfo[index])[0];
          let title = titleInfo[index][titleKey];

          title.displayTitle = title.display_title || title.title || "";
          title.versionHash = title["."].source;
          title.objectId = this.rootStore.client.utils.DecodeVersionHash(title.versionHash).objectId;

          title.titleId = Id.next();

          const linkPath = UrlJoin("public", "asset_metadata", metadataKey, index, titleKey);
          title.playoutOptionsLinkPath = UrlJoin(linkPath, "sources", "default");
          title.baseLinkPath = linkPath;
          title.baseLinkUrl =
            await this.client.LinkUrl({
              libraryId: this.siteLibraryId,
              objectId: this.siteId,
              linkPath
            });

          Object.assign(title, await this.ImageLinks({baseLinkUrl: title.baseLinkUrl, versionHash: title.versionHash, images: title.images}));

          titles[index] = title;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load title ${index}`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );

    return titles.filter(title => title);
  });

  @action.bound
  LoadPlaylists = flow(function * (playlistInfo) {
    // Playlists: {[slug]: { order, name, list: {[title-slug]: { ... }}}

    if(!playlistInfo || Object.keys(playlistInfo).length === 0) { return []; }

    let playlists = [];
    yield Promise.all(
      Object.keys(playlistInfo).map(async playlistSlug => {
        try {
          const {name, order, list} = playlistInfo[playlistSlug];

          let titles = [];
          await Promise.all(
            Object.keys(list || {}).map(async titleSlug => {
              try {
                let title = list[titleSlug];

                title.displayTitle = title.display_title || title.title || "";
                title.versionHash = title["."].source;
                title.objectId = this.rootStore.client.utils.DecodeVersionHash(title.versionHash).objectId;

                const titleLinkPath = `public/asset_metadata/playlists/${playlistSlug}/list/${titleSlug}`;
                title.baseLinkPath = titleLinkPath;
                title.baseLinkUrl =
                  await this.client.LinkUrl({
                    libraryId: this.siteLibraryId,
                    objectId: this.siteId,
                    linkPath: titleLinkPath
                  });

                title.playoutOptionsLinkPath = UrlJoin(titleLinkPath, "sources", "default");

                title.titleId = Id.next();

                Object.assign(title, await this.ImageLinks({baseLinkUrl: title.baseLinkUrl, versionHash: title.versionHash, images: title.images}));

                titles[parseInt(title.order)] = title;
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Failed to load title ${titleSlug} in playlist ${order} (${name})`);
                // eslint-disable-next-line no-console
                console.error(error);
              }
            })
          );

          playlists[parseInt(order)] = {
            playlistId: Id.next(),
            name,
            titles: titles.filter(title => title)
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load playlist ${playlistSlug}`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );

    return playlists.filter(playlist => playlist);
  });

  @action.bound
  SetActiveTitle = flow(function * (title) {
    let playoutOptions;
    try {
      const target = title.isSearchResult ?
        { versionHash: title.versionHash } :
        { libraryId: this.siteLibraryId, objectId: this.siteId };

      playoutOptions = yield this.client.PlayoutOptions({
        ...target,
        linkPath: title.playoutOptionsLinkPath,
        protocols: ["hls", "dash"],
        drms: ["aes-128", "widevine", "clear"]
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error loading playout options:");
      // eslint-disable-next-line no-console
      console.error(error);
    }

    this.activeTitle = title;
    this.activeTitle.playoutOptions = playoutOptions;

    this.activeTitle.metadata = yield this.client.ContentObjectMetadata({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      metadataSubtree: title.baseLinkPath,
      resolveLinks: true,
      resolveIncludeSource: true,
      resolveIgnoreErrors: true
    });
  });

  @action.bound
  SearchTitles = flow(function * ({query}) {
    if(!this.searchIndex || !this.searchNodes) { return; }

    this.ClearActiveTitle();

    if(!query) { return; }

    const client = this.rootStore.client;

    try {
      this.searchQuery = query;
      this.searching = true;
      this.searchCounter = this.searchCounter + 1;

      const indexHash = yield client.LatestVersionHash({
        objectId: this.searchIndex
      });

      yield client.SetNodes({
        fabricURIs: toJS(this.searchNodes)
      });

      const url = yield client.Rep({
        versionHash: indexHash,
        rep: "search",
        queryParams: {
          terms: query,
          select: "public/asset_metadata"
        },
        noAuth: true
      });

      yield client.ResetRegion();


      const results = ((yield client.Request({
        url,
      })).results || []);

      this.searchResults = (yield Promise.all(
        results.map(async ({id, hash, meta}) => {
          try {
            meta = ((meta || {}).public || {}).asset_metadata || {};
            const linkPath = UrlJoin("public", "asset_metadata");
            const playoutOptionsLinkPath = UrlJoin(linkPath, "sources", "default");
            const baseLinkPath = linkPath;
            const baseLinkUrl = await this.client.LinkUrl({versionHash: hash, linkPath});
            const imageLinks = await this.ImageLinks({baseLinkUrl, versionHash: hash, images: meta.images});

            return {
              ...meta,
              ...imageLinks,
              isSearchResult: true,
              displayTitle: meta.display_title || meta.title || "",
              objectId: id,
              versionHash: hash,
              playoutOptionsLinkPath,
              baseLinkPath,
              baseLinkUrl
            };
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error loading search result:", id, hash);
            // eslint-disable-next-line no-console
            console.error(error);
          }
        })
      )).filter(result => result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error performing site search:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.searchCounter = this.searchCounter - 1;

      // Only clear searching flag if no other searches are ongoing
      if(this.searchCounter === 0) {
        this.searching = false;
      }
    }
  });

  @action.bound
  ClearSearch = flow(function * () {
    while(this.searchCounter > 0) {
      yield new Promise(resolve => setTimeout(resolve, 500));
    }

    this.searchQuery = "";
    this.searching = false;
  });

  @action.bound
  ClearActiveTitle() {
    this.activeTitle = undefined;
  }

  @action.bound
  CreateLink(baseLink, path, query={}) {
    if(!baseLink) { return ""; }

    const basePath = URI(baseLink).path();

    return URI(baseLink)
      .path(UrlJoin(basePath, path))
      .addQuery(query)
      .toString();
  }
}

export default SiteStore;
