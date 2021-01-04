import {observable, action, flow, computed, toJS} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import Id from "@eluvio/elv-client-js/src/Id";
import { v4 as UUID } from "uuid";
import axios from "axios";

class SiteStore {
  // Eluvio Live - Data Store
  @observable basePath = "/"; 
  @observable faqData = [];
  @observable eventSites;
  @observable sponsorImage;
  @observable codeImage;

  // Eluvio Live - Event Stream  
  @observable titles; 
  @observable feeds = [];

  // Eluvio Live - Modal
  @observable modalOn = false;  
  @observable priceId = ""; 
  @observable prodId = ""; 
  @observable prodName = ""; 

  @observable logoUrl;

  @observable siteHash;
  @observable assets = {};

  @observable dashSupported = false;
  @observable activeTitle;
  @observable activeTrailer;
  @observable playoutUrl;
  @observable authToken;

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


  @action.bound
  LoadSite = flow(function * (libraryId, objectId) {
    try {

      this.siteParams = {
        libraryId: yield this.client.ContentObjectLibraryId({objectId}),
        objectId: objectId,
        versionHash: yield this.client.LatestVersionHash({objectId}),
        writeToken: ""
      };

      const response = yield axios.get(
        `https://host-66-220-3-86.contentfabric.io/qlibs/${libraryId}/q/${objectId}/meta/public?authorization=eyJxc3BhY2VfaWQiOiAiaXNwYzNBTm9WU3pOQTNQNnQ3YWJMUjY5aG81WVBQWlUifQo=&select=sites&select=app&resolve=true&link_depth=1`
      );

      let appData = response.data.app;

      if(appData.base_path) {
        this.basePath = "/" + appData.base_path;
      }
      if(appData.faq) {
        this.faqData = appData.faq;
      }

      this.eventSites = response.data.sites;
      this.codeImage = yield this.client.LinkUrl({...this.siteParams, linkPath: "public/asset_metadata/images/code_background/default"});
      this.sponsorImage = yield this.client.LinkUrl({...this.siteParams, linkPath: "public/sites/rita-ora/images/main_sponsor/default"});

    } catch (error) {
      console.error("ERROR LoadSite", error);
    }
    // Eluvio Live Data Store
  });

  // Loading streams/titles from objectId and placing them into this.feeds for multiview selection
  @action.bound
  LoadStreamObject = flow(function * (objectId) {
    this.siteParams = {
      libraryId: yield this.client.ContentObjectLibraryId({objectId}),
      objectId: objectId,
      versionHash: yield this.client.LatestVersionHash({objectId}),
      writeToken: ""
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
      this.modalOn = false;
      
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load offModal:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });


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
      const playoutOptions = yield this.client.BitmovinPlayoutOptions({
        ...params,
        offering,
        linkPath,
        protocols: ["hls", "dash"],
        drms: ["aes-128", "widevine", "clear"]
      });

      title.playoutOptions = playoutOptions;
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
