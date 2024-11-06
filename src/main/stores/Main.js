import {configure, flow, makeAutoObservable, runInAction} from "mobx";
import UIStore from "./UI";
import EluvioConfiguration from "EluvioConfiguration";
import UrlJoin from "url-join";
import {Utils, ElvWalletClient} from "@eluvio/elv-client-js";
import SiteConfiguration from "@eluvio/elv-client-js/src/walletClient/Configuration";

import LocalizationEN from "../static/localization/en/en.yml";
import FeaturesDetailsEN from "../static/localization/en/FeaturesDetails.yaml";
import FeaturesPricingEN from "../static/localization/en/FeaturesPricing.yaml";
import FeaturesTenanciesEN from "../static/localization/en/FeaturesTenancies.yaml";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,

  // May help debugging
  disableErrorBoundaries: true
});

let walletAppUrl;
if(window.location.hostname === "localhost" || window.location.hostname.startsWith("192.") || window.location.hostname.startsWith("elv-test.io")) {
  walletAppUrl = `https://${window.location.hostname}:8090`;
} else {
  // Prod
  walletAppUrl = EluvioConfiguration.network === "main" ?
    "https://wallet.contentfabric.io" :
    "https://wallet.demov3.contentfabric.io";
}
// else if(window.location.hostname.startsWith("live-stg")) {
//   walletAppUrl = EluvioConfiguration.network === "main" ?
//     "https://wallet.preview.contentfabric.io" :
//     "https://wallet.demov3.contentfabric.io";
// }

const mainSiteConfig = SiteConfiguration[EluvioConfiguration.network][EluvioConfiguration.mode];

const staticUrl = EluvioConfiguration.network === "main" ?
  "https://main.net955305.contentfabric.io/s/main" :
  "https://demov3.net955210.contentfabric.io/s/demov3";

const staticSiteUrl = UrlJoin(staticUrl, "qlibs", mainSiteConfig.siteLibraryId, "q", mainSiteConfig.siteId);

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
      details: FeaturesDetailsEN,
      pricing: FeaturesPricingEN,
      tenancies: FeaturesTenanciesEN
    }
  };

  staticUrl = staticUrl;
  staticSiteUrl = staticSiteUrl;

  client;
  walletClient;
  walletAppUrl = walletAppUrl;

  mainSite;
  featuredProperties;
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
    metadataUrl.searchParams.set("resolve_ignore_errors", "true");

    metadataUrl.searchParams.append("remove", "news");

    const mainSiteMetadata = ProduceMetadataLinks({
      path: "/public/asset_metadata/info",
      metadata: yield (yield fetch(metadataUrl)).json()
    });

    //mainSiteMetadata.domain_map.push({domain: "elv-test.io", event_slug: "masked-singer-drop-event"});

    // Handle domain redirect
    const domainRedirect = mainSiteMetadata.domain_map.find(({domain}) =>
      window.location.hostname === domain
    );

    if(domainRedirect && domainRedirect.event_slug) {
      const redirect = new URL(window.location.href);
      redirect.pathname = UrlJoin(domainRedirect.tenant_slug || "", domainRedirect.event_slug);

      // eslint-disable-next-line no-console
      console.log("Redirecting to", redirect.toString());
      window.location = redirect;

      return;
    }

    this.mainSite = mainSiteMetadata;
  });

  LoadFeaturedProperties = flow(function * () {
    if(this.featuredProperties) { return; }

    const metadataUrl = new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata"));
    metadataUrl.searchParams.set("resolve", "true");
    metadataUrl.searchParams.set("link_depth", "2");
    metadataUrl.searchParams.set("resolve_ignore_errors", "true");
    metadataUrl.searchParams.set("resolve_include_source", "true");

    [
      "info/media_property_order",
      "tenants/*/media_properties/*/.",
      "tenants/*/media_properties/*/title",
      "tenants/*/media_properties/*/slug",
      "tenants/*/media_properties/*/image",
      "tenants/*/media_properties/*/video",
      "tenants/*/media_properties/*/show_on_main_page",
      "tenants/*/media_properties/*/main_page_url",
      "tenants/*/media_properties/*/parent_property"
    ].forEach(path => metadataUrl.searchParams.append("select", path));

    const metadata = yield (yield fetch(metadataUrl)).json();

    const baseSitePath = UrlJoin("meta", "public", "asset_metadata", "tenants");
    const propertyOrder = metadata?.info?.media_property_order || [];
    const properties = Object.keys(metadata?.tenants || {}).map(tenantSlug => {
      return Object.keys(metadata.tenants[tenantSlug]?.media_properties || {}).map(propertySlug => {
        try {
          const property = metadata.tenants[tenantSlug].media_properties[propertySlug];

          return {
            ...property,
            propertyHash: property["."].source,
            propertyId: Utils.DecodeVersionHash(property["."].source).objectId,
            title: property.name,
            image: new URL(UrlJoin(staticSiteUrl, UrlJoin(baseSitePath, tenantSlug, "media_properties", propertySlug, "image?width=1000"))).toString(),
          };
        } catch(error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load property ${tenantSlug}/${propertySlug}`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
        .filter(property => property);
    })
      .flat()
      .filter(property =>
        property.show_on_main_page
        && (propertyOrder.includes(property.slug) || propertyOrder.includes(property.propertyId))
      )
      .sort((a, b) => {
        const indexA = propertyOrder.findIndex(propertySlugOrId => a.slug === propertySlugOrId || a.propertyId === propertySlugOrId);
        const indexB = propertyOrder.findIndex(propertySlugOrId => b.slug === propertySlugOrId || b.propertyId === propertySlugOrId);

        return indexA < 0 ?
          (indexB < 0 ? 0 : 1) :
          (indexA < indexB ? -1 : 1);
      });

    this.featuredProperties = properties.map(property => {
      let url = new URL(this.walletAppUrl);
      if(property.main_page_url){
        url = property.main_page_url;
      } else if(property.parent_property) {
        const parentSlug = properties.find(otherProperty => otherProperty.propertyId === property.parent_property)?.slug || property.parent_property;
        url.pathname = UrlJoin("/", parentSlug, "/p", property.slug || property.propertyId);
      } else {
        url.pathname = UrlJoin("/", property.slug || property.propertyId);
      }

      return {
        ...property,
        url
      };
    });
  });

  LoadNews = flow(function * () {
    if(this.newsItems) { return; }

    const metadataUrl = new URL(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata/info/news"));
    metadataUrl.searchParams.set("resolve", "false");
    metadataUrl.searchParams.set("resolve_ignore_errors", "true");

    this.newsItems = ProduceMetadataLinks({
      path: "/public/asset_metadata/info/news",
      metadata: yield (yield fetch(metadataUrl)).json()
    });
  });

  async SubmitHubspotForm({portalId, formId, data, consent}) {
    const hubspotUrl = new URL(UrlJoin("https://api.hsforms.com/submissions/v3/integration/submit", portalId, formId));

    const spec = {
      submittedAt: Date.now(),
      context: {
        pageUri: window.location.href,
        pageName: "Eluvio Live"
      },
      fields: Object.keys(data).map(fieldName => ({
        objectTypeId: "0-1",
        name: fieldName,
        value: data[fieldName]
      }))
    };

    if(typeof consent !== "undefined") {
      spec.legalConsentOptions = {
        consent: {
          consentToProcess: true,
          text: "Registration form submission",
          communications: [
            {
              value: consent,
              subscriptionTypeId: 7147421,
              text: "Marketing offers and updates"
            }
          ]
        }
      };
    }

    const response = await fetch(
      hubspotUrl.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${EluvioConfiguration["hubspot-token"]}`
        },
        body: JSON.stringify(spec)
      }
    );

    if(!response.ok) {
      throw response;
    }
  }

  TestLocalization = flow(function * () {
    this.l10n = {
      ...this.l10n,
      ...(yield import("../static/localization/test.yml")).default
    };
  });

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

window.mainStore = store;

export const mainStore = store;
export const uiStore = store.uiStore;
