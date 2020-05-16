import {observable, action, flow, computed, runInAction} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import Id from "@eluvio/elv-client-js/src/Id";

class SiteStore {
  @observable siteLibraryId;

  @observable filteredTitles = [];

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

  @observable searching = false;
  @observable searchQuery = "";
  @observable searchCounter = 0;

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

  Reset() {
    this.siteLibraryId = undefined;

    this.filteredTitles = [];

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

    this.error = "";
  }

  @action.bound
  LoadSite = flow(function * () {
    this.Reset();

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
        select: [
          "channels",
          "episodes",
          "playlists",
          "seasons",
          "series",
          "titles",
        ]
      });

      try {
        siteInfo.indexHash = yield this.client.LinkTarget({
          libraryId: this.siteLibraryId,
          objectId: this.siteId,
          linkPath: "public/site_index"
        });
      // eslint-disable-next-line no-empty
      } catch (error) {}

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
      console.error(error);

      this.rootStore.SetSiteId(undefined);
      this.rootStore.SetError("Invalid site object");
      setTimeout(() => runInAction(() => this.rootStore.SetError("")), 8000);
    }
  });

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

          title.versionHash = title["."].source;
          title.objectId = this.rootStore.client.utils.DecodeVersionHash(title.versionHash).objectId;

          title.titleId = Id.next();


          const linkPath = UrlJoin("public", "asset_metadata", metadataKey, index, titleKey);
          title.playoutOptionsLinkPath = UrlJoin(linkPath, "sources", "default");
          title.baseLinkUrl =
            await this.client.LinkUrl({
              libraryId: this.siteLibraryId,
              objectId: this.siteId,
              linkPath
            });

          if(!title.images || (!title.images.main_slider_background_desktop || !title.images.landscape)) {
            title.imageUrl = await this.client.ContentObjectImageUrl({versionHash: title["."].source});
          }

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

                title.versionHash = title["."].source;
                title.objectId = this.rootStore.client.utils.DecodeVersionHash(title.versionHash).objectId;

                const titleLinkPath = `public/asset_metadata/playlists/${playlistSlug}/list/${titleSlug}`;
                title.baseLinkUrl =
                  await this.client.LinkUrl({
                    libraryId: this.siteLibraryId,
                    objectId: this.siteId,
                    linkPath: titleLinkPath
                  });

                title.playoutOptionsLinkPath = UrlJoin(titleLinkPath, "sources", "default");

                title.titleId = Id.next();

                if(!title.images || (!title.images.main_slider_background_desktop || !title.images.landscape)) {
                  title.imageUrl = await this.client.ContentObjectImageUrl({versionHash: title["."].source});
                }

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
    const playoutOptions = yield this.client.PlayoutOptions({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      linkPath: title.playoutOptionsLinkPath,
      protocols: ["hls", "dash"],
      drms: ["aes-128", "widevine", "clear"]
    });

    this.activeTitle = title;
    this.activeTitle.playoutOptions = playoutOptions;
  });

  @action.bound
  SearchTitles = flow(function * ({query}) {
    if(!this.siteInfo.indexHash) { return; }

    try {
      this.searchQuery = query;
      this.searching = true;
      this.searchCounter = this.searchCounter + 1;

      const url = yield this.rootStore.client.Rep({
        versionHash: this.siteInfo.indexHash,
        rep: "search",
        queryParams: {
          terms: query
        },
        noAuth: true
      });

      this.filteredTitles = ((yield this.rootStore.client.Request({
        url,
      })).results || []).map(title => title.id);
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
    const basePath = URI(baseLink).path();

    return URI(baseLink)
      .path(UrlJoin(basePath, path))
      .addQuery(query)
      .toString();
  }
}

export default SiteStore;
