import {configure, flow, makeAutoObservable, runInAction} from "mobx";
import UIStore from "./UI";
import EluvioConfiguration from "EluvioConfiguration";
import UrlJoin from "url-join";
import {ElvWalletClient} from "@eluvio/elv-client-js";

import LocalizationEN from "../static/localization/en/en.yml";
import FeaturesBannerEN from "../static/localization/en/FeaturesBanner.yaml";
import FeaturesDetailsEN from "../static/localization/en/FeaturesDetails.yaml";
import FeaturesPricingEN from "../static/localization/en/FeaturesPricing.yaml";
import FeaturesSupportEN from "../static/localization/en/FeaturesSupport.yaml";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,

  // May help debugging
  disableErrorBoundaries: true
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
  l10n = {
    ...LocalizationEN,
    features: {
      banner: FeaturesBannerEN,
      details: FeaturesDetailsEN,
      pricing: FeaturesPricingEN,
      support: FeaturesSupportEN
    }
  };

  client;
  walletClient;

  mainSite;
  featuredSites;
  marketplaces;
  newsItems;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true, autoAction: true });

    window.mainStore = this;

    this.uiStore = new UIStore();

    runInAction(() => this.Initialize());
  }

  Initialize = flow(function * () {
    if(this.mainSite) { return; }

    const metadataUrl = new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata/info"));
    metadataUrl.searchParams.set("resolve", "false");

    metadataUrl.searchParams.append("remove", "news");

    this.mainSite = ProduceMetadataLinks({
      path: "/public/asset_metadata",
      metadata: yield (yield fetch(metadataUrl)).json()
    });
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

    const metadata = yield (yield fetch(metadataUrl)).json();

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

    metadataUrl.searchParams.append("select", "info/marketplace_order");
    metadataUrl.searchParams.append("select", UrlJoin("tenants", "*", "marketplaces", "*", "display_title"));
    metadataUrl.searchParams.append("select", UrlJoin("tenants", "*", "marketplaces", "*", "info", "branding", "name"));
    metadataUrl.searchParams.append("select", UrlJoin("tenants", "*", "marketplaces", "*", "info", "branding", "show"));

    const metadata = yield (yield fetch(metadataUrl)).json();

    const baseSitePath = UrlJoin("meta", "public", "asset_metadata", "tenants");

    let marketplaces = [];
    Object.keys(metadata.tenants).forEach(tenantSlug =>
      Object.keys(metadata.tenants[tenantSlug].marketplaces).forEach(marketplaceSlug => {
        const marketplace = metadata.tenants[tenantSlug].marketplaces[marketplaceSlug] || {};

        if(!marketplace?.info?.branding?.show) {
          return;
        }

        marketplaces.push({
          tenantSlug,
          marketplaceSlug,
          name: marketplace?.info?.branding?.name || marketplace?.display_title,
          card_front: new URL(UrlJoin(staticSiteUrl, UrlJoin(baseSitePath, tenantSlug, "marketplaces", marketplaceSlug, "info", "branding", "card_banner_front"))).toString(),
          card_back: new URL(UrlJoin(staticSiteUrl, UrlJoin(baseSitePath, tenantSlug, "marketplaces", marketplaceSlug, "info", "branding", "card_banner_back"))).toString()
        });
      })
    );

    const order = metadata.info?.marketplace_order || [];
    this.marketplaces = marketplaces
      .sort((a, b) => {
        const aSlugIndex = order.findIndex(slug => slug === a.marketplaceSlug);
        const bSlugIndex = order.findIndex(slug => slug === b.marketplaceSlug);

        if(aSlugIndex >= 0) {
          if(bSlugIndex >= 0) {
            return aSlugIndex < bSlugIndex ? -1 : 1;
          }

          return -1;
        } else if(bSlugIndex >= 0) {
          return 1;
        } else {
          return a.name > b.name ? 1 : -1;
        }
      });
  })

  LoadNews = flow(function * () {
    if(this.newsItems) { return; }

    this.newsItems = ProduceMetadataLinks({
      path: "/public/asset_metadata/info/news",
      metadata: yield (yield fetch(new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata/info/news")))).json()
    });
  });

  TestLocalization = flow(function * () {
    this.l10n = {
      ...this.l10n,
      ...(yield import("../static/localization/test.yml")).default
    };
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
