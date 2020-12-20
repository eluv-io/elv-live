import {observable, action, flow, computed, toJS} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import Id from "@eluvio/elv-client-js/src/Id";
import { v4 as UUID } from "uuid";

// Note: Update if defaults change in asset manager
const DEFAULT_ASSOCIATED_ASSETS = [
  {
    name: "titles",
    label: "Titles",
    indexed: true,
    slugged: true,
    defaultable: true,
    orderable: true
  },
  {
    name: "series",
    label: "Series",
    asset_types: ["primary"],
    title_types: ["series"],
    for_title_types: ["site", "collection"],
    indexed: true,
    slugged: true,
    defaultable: false,
    orderable: true
  },
  {
    name: "seasons",
    label: "Seasons",
    asset_types: ["primary"],
    title_types: ["season"],
    for_title_types: ["series"],
    indexed: true,
    slugged: true,
    defaultable: false,
    orderable: true
  },
  {
    name: "episodes",
    label: "Episodes",
    asset_types: ["primary"],
    title_types: ["episode"],
    for_title_types: ["season"],
    indexed: true,
    slugged: true,
    defaultable: false,
    orderable: true
  }
];

const DEFAULT_SITE_CUSTOMIZATION = {
  colors: {
    background: "#000000",
    primary_text: "#FFFFFF"
  }
};

class SiteStore {
  @observable siteCustomization;
  @observable feeds = [];

  @observable titles; 
  @observable priceId = ""; 
  @observable prodId = ""; 
  @observable prodName = ""; 

  @observable modalOn = false;
  @observable backgroundColor = "rgb(17, 17, 17)";
  @observable primaryFontColor = "white";
  @observable logoUrl;
  @observable darkLogo;

  @observable background_image;
  @observable eventAssets;
  @observable chargeID;
  @observable redirectCB;

  @observable siteHash;
  @observable assets = {};

  @observable dashSupported = false;
  @observable activeTitle;
  @observable activeTrailer;
  @observable playoutUrl;
  @observable authToken;

  @observable searchResults = [];

  @observable showEpisodes = [];

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
    return (this.siteParams || {}).objectId;
  }

  @computed get activeTitleId() {
    return (this.activeTitle || {}).objectId;
  }

  @computed get siteInfo() {
    return this.assets[this.siteHash];
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  @observable loading = false;

  @action.bound
  Reset() {
    this.assets = {};

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
  }

  // Load associated assets of specified object from its type
  async AssociatedAssets(versionHash) {
    const titleType = await this.client.ContentObjectMetadata({
      versionHash,
      metadataSubtree: "public/asset_metadata/title_type"
    });

    const typeHash = (await this.client.ContentObject({versionHash})).type;
    const latestTypeHash = await this.client.LatestVersionHash({versionHash: typeHash});

    const associatedAssets = (await this.client.ContentObjectMetadata({
      versionHash: latestTypeHash,
      metadataSubtree: "public/title_configuration/associated_assets"
    })) || DEFAULT_ASSOCIATED_ASSETS;

    return associatedAssets
      .filter(asset =>
        !asset.for_title_types ||
        asset.for_title_types.includes(titleType)
      )
      .sort((a, b) => a.name < b.name ? -1 : 1);
  }

  // Loading data from Site Customization

  // @action.bound
  // LoadSite = flow(function * (objectId, writeToken) {
  //   if(this.siteParams && this.siteParams.objectId === objectId) {
  //     return;
  //   }
  //   this.Reset();

  //   this.siteParams = {
  //     libraryId: yield this.client.ContentObjectLibraryId({objectId}),
  //     objectId: objectId,
  //     versionHash: yield this.client.LatestVersionHash({objectId}),
  //     writeToken: writeToken
  //   };
  //   const availableDRMS = yield this.client.AvailableDRMs();
  //   this.dashSupported = availableDRMS.includes("widevine");

  //   this.siteCustomization = (yield this.client.ContentObjectMetadata({
  //     ...this.siteParams,
  //     metadataSubtree: "public/asset_metadata/site_customization",
  //     resolveLinks: true,
  //     resolveIncludeSource: true,
  //     resolveIgnoreErrors: true
  //   })) || DEFAULT_SITE_CUSTOMIZATION;

  //   if(this.siteCustomization.logo) {
  //     this.logoUrl = yield this.client.LinkUrl({...this.siteParams, linkPath: "public/asset_metadata/site_customization/logo"});
  //   }
  //   if(this.siteCustomization.dark_logo) {
  //     this.darkLogo = yield this.client.LinkUrl({...this.siteParams, linkPath: "public/asset_metadata/site_customization/dark_logo"});
  //   }
  //   if(this.siteCustomization.background_image) {
  //     this.background_image = yield this.client.LinkUrl({...this.siteParams, linkPath: "public/asset_metadata/site_customization/background_image"});
  //   }

  //   let eventMap = new Map();
  //   let dateFormat = require('dateformat');
    
  //   if(this.siteCustomization.arrangement) {
  //     for(let i = 0; i < this.siteCustomization.arrangement.length ; i++) {
  //       const entry = this.siteCustomization.arrangement[i];
  //       let titleLogo;
  //       if (entry.component == "event") {
  //         if(entry.title) {
  //           entry.title = yield this.LoadTitle(this.siteParams, entry.title, `public/asset_metadata/site_customization/arrangement/${i}/title`);
  //           if(entry.title.logoUrl) {
  //             titleLogo = this.CreateLink(
  //               entry.title.logoUrl,
  //               "",
  //               { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
  //             );
  //           }
  //         }
  //         if(entry.options.eventImage) {
  //           entry.eventImage = yield this.client.LinkUrl({...this.siteParams, linkPath: `public/asset_metadata/site_customization/arrangement/${i}/options/eventImage`});
  //         }
  //         if(entry.options.featureImage) {
  //           entry.featureImage = yield this.client.LinkUrl({...this.siteParams, linkPath: `public/asset_metadata/site_customization/arrangement/${i}/options/featureImage`});
  //         }

  //         eventMap.set(entry.options.title.replace(/\s+/g, '-').toLowerCase(),
  //           {
  //             name: entry.options.title,
  //             date: dateFormat(new Date(entry.options.date), "mmmm dS, yyyy · h:MM TT Z"),
  //             streamTimer: new Date(entry.options.date),
  //             description: entry.options.description,
  //             icon: entry.featureImage,
  //             eventImg: entry.eventImage,
  //             price: entry.options.price,
  //             stream: entry.title,
  //             logo: titleLogo,
  //             key: i
  //           }
  //         );
  //       }
  //     }
  //   }
  //   this.eventAssets = eventMap;
  //   this.siteHash = yield this.LoadAsset("public/asset_metadata");
  // });

  // Loading streams/titles from objectId and placing them into this.feeds for multiview selection
  @action.bound
  LoadStreamSite = flow(function * (objectId, writeToken) {
    this.siteParams = {
      libraryId: yield this.client.ContentObjectLibraryId({objectId}),
      objectId: objectId,
      versionHash: yield this.client.LatestVersionHash({objectId}),
      writeToken: writeToken
    };
    const sitePromise = this.LoadAsset("public/asset_metadata");
    const availableDRMS = yield this.client.AvailableDRMs();
    this.dashSupported = availableDRMS.includes("widevine");

    this.titles = (yield this.client.ContentObjectMetadata({
      ...this.siteParams,
      metadataSubtree: "public/asset_metadata/titles",
      resolveLinks: true,
      resolveIncludeSource: true,
      resolveIgnoreErrors: true
    }));

    this.siteHash = yield sitePromise;

    this.feeds = yield Promise.all(
      (Object.keys(this.titles || {})).map(async titleIndex => {
        const title = this.titles[titleIndex];
        const titleInfo = await this.LoadTitle(
          this.siteParams,
          title[Object.keys(title)[0]], `public/asset_metadata/titles/${titleIndex}/${title[Object.keys(title)[0]].slug}`
        );
        return await this.LoadActiveTitle(titleInfo);
      })
    );
  });

  @action.bound
  PlayTitle = flow(function * (title) {
    try {
      this.loading = true;
      this.activeTitle = yield this.SetActiveTitle(title);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.loading = false;
    }
  });

  @action.bound
  turnOnModal = flow(function * (price, prod, prodName) {
    try {
      console.log("ON");
      this.modalOn = true;
      this.priceId = price;
      this.prodId = prod;
      this.prodName = prodName;

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load Modal:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  @action.bound
  turnOffModal = flow(function * () {
    try {
      console.log("OFF");
      this.modalOn = false;


    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load offModal:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });
  

  @action.bound
  PlayTrailer = flow(function * (title) {
    try {
      this.loading = true;
      this.activeTrailer = yield this.LoadActiveTitle(title);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.loading = false;
    }
  });

  @action.bound
  LoadAsset = flow(function * (linkPath) {
    try {
      const versionHash = yield this.client.LinkTarget({...this.siteParams, linkPath});
      const associatedAssets = yield this.AssociatedAssets(versionHash);

      let assetInfo = yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        metadataSubtree: linkPath,
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
        select: [
          "allowed_offerings",
          "title",
          "display_title",
          "playlists",
          UUID(),
          ...(associatedAssets.map(asset => asset.name))
        ]
      });

      assetInfo = {
        ...assetInfo,
        assets: {},
        versionHash,
        associatedAssets
      };

      assetInfo.name = assetInfo.display_title || assetInfo.title;
      assetInfo.baseLinkUrl = yield this.client.LinkUrl({...this.siteParams, linkPath});

      yield Promise.all(
        assetInfo.associatedAssets.map(async asset => {
          assetInfo.assets[asset.name] = await this.LoadTitles(this.siteParams, UrlJoin(linkPath, asset.name), assetInfo[asset.name]);
        })
      );

      assetInfo.playlists = yield this.LoadPlaylists(this.siteParams, linkPath, assetInfo.playlists);

      this.assets[assetInfo.versionHash] = assetInfo;

      return assetInfo.versionHash;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load asset:", linkPath);
      // eslint-disable-next-line no-console
      console.error(error);

      this.rootStore.SetError("Error");
    }
  });

  async ImageLinks({baseLinkUrl, versionHash, images}) {
    images = images || {};

    let landscapeUrl, portraitUrl, imageUrl, logoUrl;
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

    if(images.logo) {
      logoUrl = this.CreateLink(baseLinkUrl, UrlJoin("images", "logo", "default"));
    }


    imageUrl = await this.client.ContentObjectImageUrl({versionHash});

    return {
      landscapeUrl,
      portraitUrl,
      imageUrl,
      logoUrl
    };
  }

  LoadTitle = flow(function * (params, title, baseLinkPath) {
    if(title["."] && title["."].resolution_error) {
      return;
    }

    title.displayTitle = title.display_title || title.title || "";
    title.versionHash = title["."] ? title["."].source : params.versionHash;
    title.objectId = this.client.utils.DecodeVersionHash(title.versionHash).objectId;

    title.titleId = Id.next();

    title.baseLinkPath = baseLinkPath;
    title.playoutOptionsLinkPath = UrlJoin(title.baseLinkPath, "sources", "default");
    title.baseLinkUrl =
      yield this.client.LinkUrl({...params, linkPath: title.baseLinkPath});

    Object.assign(title, yield this.ImageLinks({baseLinkUrl: title.baseLinkUrl, versionHash: title.versionHash, images: title.images}));

    return title;
  });

  @action.bound
  LoadTitles = flow(function * (siteParams, metadataKey, titleInfo) {
    if(!titleInfo) { return []; }

    // Titles: {[index]: {[title-key]: { ...title }}
    let titles = [];
    yield Promise.all(
      Object.keys(titleInfo).map(async index => {
        try {
          const titleKey = Object.keys(titleInfo[index])[0];
          let title = titleInfo[index]["."] ? titleInfo[index] : titleInfo[index][titleKey];

          titles[index] = await this.LoadTitle(this.siteParams, title, UrlJoin(metadataKey, index, titleKey));
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
  LoadPlaylists = flow(function * (siteParams, metadataKey, playlistInfo) {
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

                titles[parseInt(title.order)] = await this.LoadTitle(
                  this.siteParams,
                  title,
                  UrlJoin(metadataKey, "playlists", playlistSlug, "list", titleSlug)
                );
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
            slug: playlistSlug,
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
  LoadActiveTitleOffering = flow(function * (offering, title) {
    if(title.playoutOptions && title.playoutOptions[offering]) {
      title.currentOffering = offering;
    }

    let params, linkPath;
    if(title.isSearchResult) {
      params = { versionHash: title.versionHash };
    } else {
      params = this.siteParams;
      linkPath = title.playoutOptionsLinkPath;
    }

    try {
      const playoutOptions = yield this.client.PlayoutOptions({
        ...params,
        offering,
        linkPath,
        protocols: ["hls", "dash"],
        drms: ["aes-128", "widevine", "clear"]
      });

      title.playoutOptions = {
        ...(title.playoutOptions || {}),
        [offering]: playoutOptions
      };

      title.currentOffering = offering;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error loading playout options for offering " + offering);
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  @action.bound
  LoadActiveTitle = flow(function * (title) {
    title.metadata = yield this.client.ContentObjectMetadata({
      ...(this.siteParams),
      metadataSubtree: title.baseLinkPath,
      resolveLinks: true,
      resolveIncludeSource: true,
      resolveIgnoreErrors: true
    });

    let params, linkPath;
    if(title.isSearchResult) {
      params = { versionHash: title.versionHash };
    } else {
      params = this.siteParams;
      linkPath = title.playoutOptionsLinkPath;
    }

    let availableOfferings = yield this.client.AvailableOfferings({...params, linkPath});
    if(Object.keys(availableOfferings).length === 0) {
      availableOfferings = {
        default: {
          display_name: "default"
        }
      };
    }
    const allowedOfferings = this.siteInfo.allowed_offerings;

    if(allowedOfferings) {
      Object.keys(availableOfferings).map(offeringKey => {
        if(!allowedOfferings.includes(offeringKey)) {
          delete availableOfferings[offeringKey];
        }
      });
    }

    title.availableOfferings = availableOfferings;

    const initialOffering = availableOfferings.default ? "default" : Object.keys(availableOfferings)[0];
    if(initialOffering) {
      yield this.LoadActiveTitleOffering(initialOffering, title);
    }

    return title;
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

      const results = ((yield client.Request({
        url,
      })).results || []);

      this.searchResults = (yield Promise.all(
        results.map(async ({id, hash, meta}) => {
          try {
            meta = ((meta || {}).public || {}).asset_metadata || {};
            let title = await this.LoadTitle({versionHash: hash}, meta, "public/asset_metadata");
            title.isSearchResult = true;

            return title;
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
