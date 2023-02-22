import {configure, flow, makeAutoObservable, runInAction} from "mobx";
import UIStore from "./UI";
import EluvioConfiguration from "EluvioConfiguration";
import UrlJoin from "url-join";
import {ElvWalletClient} from "@eluvio/elv-client-js";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,

  // May help debugging
  //disableErrorBoundaries: true
});

const libraryId = "ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD";
const objectId = "iq__2APUwchUAmMAKRgWStEN7ZXtAKkV";

const staticUrl = EluvioConfiguration.network === "main" ?
  "https://main.net955305.contentfabric.io/s/main" :
  "https://demov3.net955210.contentfabric.io/s/demov3";

const staticSiteUrl = UrlJoin(staticUrl, "qlibs", libraryId, "q", objectId);

const ProduceMetadataLinks = ({path="/", metadata}) => {
  // Primitive
  if(!metadata || typeof metadata !== "object") { return metadata; }

  // Array
  if(Array.isArray(metadata)) {
    return metadata.map((entry, i) => ProduceMetadataLinks({path: UrlJoin(path, i.toString()), metadata: entry}));
  }

  // Object
  if(metadata["/"] &&
    (metadata["/"].match(/\.\/(rep|files)\/.+/) ||
      metadata["/"].match(/^\/?qfab\/([\w]+)\/?(rep|files)\/.+/)))
  {
    // Is file or rep link - produce a url
    return {
      ...metadata,
      url: UrlJoin(staticSiteUrl, "/meta", path)
    };
  }

  let result = {};
  Object.keys(metadata).forEach(key => result[key] = ProduceMetadataLinks({path: UrlJoin(path, key), metadata: metadata[key]}));

  return result;
};

class MainStore {
  client;
  walletClient;

  mainSite;
  featuredSites;
  marketplaces;
  newsItems;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true, autoAction: true });

    runInAction(() => this.Initialize());

    window.mainStore = this;

    this.uiStore = new UIStore();
  }

  Initialize = flow(function * () {
    if(this.mainSite) { return; }

    const metadataUrl = new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata/info"));
    metadataUrl.searchParams.set("resolve", "false");

    metadataUrl.searchParams.append("remove", "news");

    const metadata = ProduceMetadataLinks({
      path: "/public/asset_metadata",
      metadata: yield (yield fetch(metadataUrl)).json()
    });

    this.mainSite = metadata.info;
  });

  InitializeWalletClient = flow(function * () {
    if(this.walletClient) { return; }

    this.walletClient = yield ElvWalletClient.Initialize({
      appId: "eluvio-live",
      network: EluvioConfiguration.network,
      mode: EluvioConfiguration.mode
    });

    this.client = this.walletClient.client;
  });

  LoadFeaturedSites = flow(function * () {
    if(this.featuredSites) { return; }

    const metadataUrl = new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata"));
    metadataUrl.searchParams.set("resolve", "true");
    metadataUrl.searchParams.set("link_depth", "1");
    metadataUrl.searchParams.set("resolve_ignore_errors", "true");
    metadataUrl.searchParams.set("resolve_include_source", "true");

    metadataUrl.searchParams.append("select", UrlJoin("featured_events", "*", "*", "display_title"));
    metadataUrl.searchParams.append("select", UrlJoin("featured_events", "*", "*", "info", "event_images", "hero_background"));
    metadataUrl.searchParams.append("select", UrlJoin("featured_events", "*", "*", "info", "event_images", "hero_background_mobile"));
    metadataUrl.searchParams.append("select", UrlJoin("tenants", "*", "marketplaces", "*", "info", "branding", "name"));

    const metadata = ProduceMetadataLinks({
      path: "/public/asset_metadata",
      metadata: yield (yield fetch(metadataUrl)).json()
    });


    const baseSitePath = UrlJoin("meta", "public", "asset_metadata", "featured_events");

    let featuredSites = [];
    Object.keys(metadata.featured_events).forEach(index =>
      Object.keys(metadata.featured_events[index]).forEach(slug => {
        const site = metadata.featured_events[index][slug];
        const {event_images} = site.info;
        const siteUrl = new URL(UrlJoin(window.location.origin, slug));

        featuredSites.push({
          name: site.display_title,
          hero: new URL(UrlJoin(staticSiteUrl, UrlJoin(baseSitePath, index, slug, "info", "event_images", "hero_background"))).toString(),
          hero_mobile: new URL(UrlJoin(staticSiteUrl, UrlJoin(baseSitePath, index, slug, "info", "event_images", event_images.hero_background_mobile ? "hero_background_mobile" : "hero_background"))).toString(),
          index,
          slug,
          siteUrl
        });
      })
    );

    this.featuredSites = featuredSites;
  });

  LoadMarketplaces = flow(function * () {
    if(this.marketplaces) { return; }

    const metadataUrl = new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata"));
    metadataUrl.searchParams.set("resolve", "true");
    metadataUrl.searchParams.set("link_depth", "2");
    metadataUrl.searchParams.set("resolve_ignore_errors", "true");
    metadataUrl.searchParams.set("resolve_include_source", "true");

    metadataUrl.searchParams.append("select", UrlJoin("tenants", "*", "marketplaces", "*", "info", "branding", "name"));

    const metadata = ProduceMetadataLinks({
      path: "/public/asset_metadata",
      metadata: yield (yield fetch(metadataUrl)).json()
    });
  })

  LoadNews = flow(function * () {
    if(this.newsItems) { return; }

    this.newsItems = ProduceMetadataLinks({
      path: "/public/asset_metadata/info/news",
      metadata: yield (yield fetch(new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata/info/news")))).json()
    });
  });

  get headerLoopURL() {
    return new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata/info/header_loop")).toString();
  }

  get notification() {
    const notification = this.mainSite?.notification;

    if(!notification || !notification.active) {
      // eslint-disable-next-line getter-return
      return;
    }

    // Notification seen status is set as just the length of the notification text, as it is very unlikely to be the same between distinct notifications.
    const messageLength = notification.header.length + notification.text.length;
    const seen = parseInt(localStorage.getItem("dismissed-notification")) === messageLength;

    // eslint-disable-next-line getter-return
    if(seen) { return; }

    return notification;
  }

  DismissNotification() {
    const notification = this.mainSite?.notification;

    if(!notification) { return; }

    const messageLength = notification.header.length + notification.text.length;
    localStorage.setItem("dismissed-notification", messageLength);

    this.mainSite.notification.active = false;
  }
}

const store = new MainStore();

export const mainStore = store;
export const uiStore = store.uiStore;
