import {observable, action, flow, computed, toJS} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import Id from "@eluvio/elv-client-js/src/Id";
import { v4 as UUID } from "uuid";

class SiteStore {
  @observable sites = [];
  @observable loading = false;

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
    return (this.currentSite || {}).objectId;
  }

  @computed get activeTitleId() {
    return (this.activeTitle || {}).objectId;
  }

  @computed get currentSite() {
    return this.sites.length > 0 ? this.sites[this.sites.length - 1] : null;
  }

  @computed get rootSite() {
    return this.sites[0];
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  Reset() {
    this.sites = [];

    this.dashSupported = false;
    this.activeTitle = undefined;
    this.playoutUrl = undefined;
    this.authToken = undefined;

    this.searching = false;
    this.searchQuery = "";
    this.searchCounter = 0;

    this.searchIndex = undefined;
    this.searchNodes = [];

    this.error = "";

    if(!this.rootStore.siteSelector) {
      window.location.hash = "";

      if(this.client.SendMessage) {
        this.client.SendMessage({
          options: {
            operation: "SetFramePath",
            path: ""
          },
          noResponse: true
        });
      }
    }
  }

  @action.bound
  ClearSubSites() {
    this.sites = this.sites.slice(0, 1);
  }

  @action.bound
  PopSite() {
    this.sites.pop();
  }

  @action.bound
  LoadSite = flow(function * (objectId) {
    try {
      this.loading = true;

      const isSubSite = this.sites.length > 0;
      const availableDRMS = yield this.client.AvailableDRMs();
      this.dashSupported = availableDRMS.includes("widevine");

      const versionHash = yield this.client.LatestVersionHash({objectId});

      let siteInfo = yield this.client.ContentObjectMetadata({
        versionHash,
        metadataSubtree: "public/asset_metadata",
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
        select: [
          "title",
          "display_title",
          "channels",
          "episodes",
          "playlists",
          "seasons",
          "series",
          "titles",
          UUID()
        ]
      });

      if(!isSubSite) {
        this.searchIndex = yield this.client.ContentObjectMetadata({versionHash, metadataSubtree: "public/site_index"});
        this.searchNodes = yield this.client.ContentObjectMetadata({versionHash, metadataSubtree: "public/search_api"});
      }

      siteInfo.objectId = objectId;
      siteInfo.versionHash = versionHash;

      siteInfo.name =
        siteInfo.display_title ||
        siteInfo.title ||
        (yield this.client.ContentObjectMetadata({versionHash, metadataSubtree: "public/name"}));

      siteInfo.baseLinkUrl = yield this.client.LinkUrl({versionHash, linkPath: "public/asset_metadata"});

      siteInfo.series = yield this.LoadTitles(versionHash, "series", siteInfo.series);
      siteInfo.seasons = yield this.LoadTitles(versionHash, "seasons", siteInfo.seasons);
      siteInfo.episodes = yield this.LoadTitles(versionHash, "episodes", siteInfo.episodes);
      siteInfo.titles = yield this.LoadTitles(versionHash, "titles", siteInfo.titles);
      siteInfo.channels = yield this.LoadTitles(versionHash, "channels", siteInfo.channels);
      siteInfo.playlists = yield this.LoadPlaylists(versionHash, siteInfo.playlists);

      //delete siteInfo.titles;
      //delete siteInfo.playlists;

      this.sites.push(siteInfo);

      if(this.sites.length === 1 && !this.rootStore.siteSelector) {
        window.location.hash = `#/${objectId || ""}`;

        if(this.client.SendMessage) {
          this.client.SendMessage({
            options: {
              operation: "SetFramePath",
              path: `#/${objectId || ""}`
            },
            noResponse: true
          });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load site:", objectId);
      // eslint-disable-next-line no-console
      console.error(error);

      this.rootStore.SetError("Invalid site object");
    } finally {
      this.loading = false;
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
  LoadTitles = flow(function * (versionHash, metadataKey, titleInfo) {
    if(!titleInfo) { return []; }

    // Titles: {[index]: {[title-key]: { ...title }}
    let titles = [];
    yield Promise.all(
      Object.keys(titleInfo).map(async index => {
        try {
          const titleKey = Object.keys(titleInfo[index])[0];
          let title = titleInfo[index][titleKey];

          if(title["."].resolution_error) {
            return;
          }

          title.displayTitle = title.display_title || title.title || "";

          title.versionHash = title["."].source;
          title.objectId = this.client.utils.DecodeVersionHash(title.versionHash).objectId;

          title.titleId = Id.next();

          const linkPath = UrlJoin("public", "asset_metadata", metadataKey, index, titleKey);
          title.playoutOptionsLinkPath = UrlJoin(linkPath, "sources", "default");
          title.baseLinkPath = linkPath;
          title.baseLinkUrl =
            await this.client.LinkUrl({versionHash, linkPath});

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
  LoadPlaylists = flow(function * (versionHash, playlistInfo) {
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
                title.objectId = this.client.utils.DecodeVersionHash(title.versionHash).objectId;

                const titleLinkPath = `public/asset_metadata/playlists/${playlistSlug}/list/${titleSlug}`;
                title.baseLinkPath = titleLinkPath;
                title.baseLinkUrl =
                  await this.client.LinkUrl({versionHash, linkPath: titleLinkPath});

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
  LoadActiveTitleOffering = flow(function * (offering) {
    if(this.activeTitle.playoutOptions && this.activeTitle.playoutOptions[offering]) {
      this.activeTitle.currentOffering = offering;
    }

    const versionHash = this.activeTitle.title.isSearchResult ? this.activeTitle.title.versionHash : this.currentSite.versionHash;

    try {
      const playoutOptions = yield this.client.PlayoutOptions({
        versionHash,
        offering,
        linkPath: this.activeTitle.playoutOptionsLinkPath,
        protocols: ["hls", "dash"],
        drms: ["aes-128", "widevine", "clear"]
      });

      this.activeTitle.playoutOptions = {
        ...(this.activeTitle.playoutOptions || {}),
        [offering]: playoutOptions
      };

      this.activeTitle.currentOffering = offering;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error loading playout options for offering " + offering);
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  @action.bound
  SetActiveTitle = flow(function * (title) {
    const versionHash = title.isSearchResult ? title.versionHash : this.currentSite.versionHash;

    this.activeTitle = title;

    this.activeTitle.metadata = yield this.client.ContentObjectMetadata({
      versionHash,
      metadataSubtree: title.baseLinkPath,
      resolveLinks: true,
      resolveIncludeSource: true,
      resolveIgnoreErrors: true
    });

    let availableOfferings = yield this.client.AvailableOfferings({
      versionHash,
      linkPath: this.activeTitle.playoutOptionsLinkPath
    });

    const allowedOfferings = this.rootSite.allowed_offerings;
    if(allowedOfferings) {
      Object.keys(availableOfferings).map(offeringKey => {
        if(!allowedOfferings.includes(offeringKey)) {
          delete allowedOfferings[offeringKey];
        }
      });
    }

    this.activeTitle.availableOfferings = availableOfferings;

    const initialOffering = availableOfferings.default ? "default" : Object.keys(availableOfferings)[0];
    if(initialOffering) {
      yield this.LoadActiveTitleOffering(initialOffering);
    }
  });

  @action.bound
  SearchTitles = flow(function * ({query}) {
    if(!this.searchIndex || !this.searchNodes) { return; }

    this.ClearActiveTitle();

    if(!query) { return; }

    const client = this.client;

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

      let url;
      try {
        url = yield client.Rep({
          versionHash: indexHash,
          rep: "search",
          queryParams: {
            terms: query,
            select: "public/asset_metadata"
          },
          noAuth: true
        });
      } finally {
        yield client.ResetRegion();
      }

      this.ClearSubSites();

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
