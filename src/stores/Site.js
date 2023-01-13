import {flow, makeAutoObservable} from "mobx";
import UrlJoin from "url-join";
import DOMPurify from "dompurify";
import LocalizationEN from "Assets/localizations/en.yml";

const CHAT_ROOM_SIZE = 5000;

import mergeWith from "lodash/mergeWith";
import {DateStatus} from "Utils/Misc";

class SiteStore {
  language = "en";
  l10n = LocalizationEN;

  marketplaceOnly = false;
  marketplaceNavigated = false;

  mainSiteInfo;
  baseSiteUrl;

  tenantKey;
  tenantSlug;
  tenants = {};

  featuredSitesLoaded = false;
  carouselSitesLoaded = false;

  eventSites = { featured: {} };
  siteSlug;
  siteIndex;
  darkMode = false;
  marketplaceInfo;
  additionalMarketplaces = [];

  streams = [];

  showCheckout = false;
  selectedTicket;

  siteId;
  siteHash;

  marketplaceHash;
  marketplaceId;

  chatChannel;

  error = "";

  viewers = 0;

  analyticsInitialized = false;
  analyticsEvents = [];

  get client() {
    return this.rootStore.client;
  }

  get siteLoaded() {
    return this.rootStore.client && this.mainSiteInfo;
  }

  get production() {
    return this.mainSiteInfo.info.mode === "production";
  }

  // Main site
  get availableTenants() {
    return Object.keys((this.mainSiteInfo || {}).tenants || {});
  }

  get featuredSiteKeys() {
    const featured = (this.mainSiteInfo || {}).featured_events || {};
    return Object.keys(featured)
      .map(index => ({index: index.toString(), slug: Object.keys(featured[index])[0]}));
  }

  get carouselSiteKeys() {
    const carousel = (this.mainSiteInfo || {}).carousel_events || {};
    return Object.keys(carousel)
      .map(index => ({index: index.toString(), slug: Object.keys(carousel[index])[0]}));
  }

  // Event Site
  get currentSite() {
    try {
      let site = this.eventSites[this.tenantSlug || "featured"][this.siteSlug];

      if(this.language !== "en") {
        site = mergeWith({}, site, site.localizations[this.language], (a, b) => b === null || b === "" ? a : undefined);
      }

      return site;
    } catch(error) {
      return undefined;
    }
  }

  get currentSiteInfo() {
    return (this.currentSite || {}).info || {};
  }

  get promos() {
    if(this.currentSite.promos && Object.keys(this.currentSite.promos).length > 0) {
      return Object.keys(this.currentSite.promos || {}).map(index => {
        const slug = Object.keys(this.currentSite.promos[index])[0];

        return UrlJoin(this.currentSiteMetadataPath, "promos", index, slug, "sources", "default");
      });
    }

    return (
      this.currentSiteInfo.promo_videos || []).map((promo, index) => {
      if(!promo.video) { return; }
      return UrlJoin(this.currentSiteMetadataPath, "info", "promo_videos", index.toString(), "video", "sources", "default");
    })
      .filter(promo => promo);
  }

  get currentSiteTicket() {
    return this.rootStore.savedTickets[this.siteSlug];
  }

  get currentSiteTicketSku() {
    if(!this.currentSiteTicket) { return null; }

    return this.TicketSkuByNTPId(this.currentSiteTicket.ntpId);
  }

  get currentSiteMetadataPath() {
    if(this.tenantSlug) {
      // Tenant site
      return UrlJoin("public", "asset_metadata", "tenants", this.tenantSlug, "sites", this.siteSlug || "");
    } else {
      // Featured site
      return UrlJoin("public", "asset_metadata", "featured_events", this.siteIndex.toString(), this.siteSlug || "");
    }
  }

  get dropEvents() {
    const dropEvents = (this.currentSiteInfo.drops || [])
      .map((drop, index) => {
        const { start_date, end_date, ongoing, past } = DateStatus(drop.start_date, drop.end_date);
        return {
          type: "drop_event",
          uuid: drop.uuid,
          requires_login: drop.requires_login || true,
          requires_ticket: drop.requires_ticket,
          header: drop.event_header,
          start_date,
          end_date,
          past,
          ongoing,
          calendar: drop.calendar,
          image: this.SiteUrl(UrlJoin("info", "drops", index.toString(), "event_image")),
          link: UrlJoin("/", this.currentSite.tenantSlug || "", this.currentSite.siteSlug || "", "drop", drop.uuid),
          landing_page_info: drop.custom_landing_page ? drop.event_landing_page : undefined
        };
      });

    const marketplaceEvents = (this.currentSiteInfo.marketplace_drops || [])
      .map((drop, index) => {
        const { start_date, end_date, ongoing, past } = DateStatus(drop.start_date, drop.end_date || new Date(new Date(drop.start_date).getTime() + (24 * 60 * 60 * 1000)));
        return {
          type: "marketplace_drop",
          uuid: drop.uuid,
          requires_login: false,
          header: drop.event_header,
          skip_countdown_page: drop.skip_countdown_page,
          start_date,
          end_date,
          past,
          ongoing,
          calendar: drop.calendar,
          store_page: drop.store_page,
          marketplace_filters: drop.store_filters || [],
          image: this.SiteUrl(UrlJoin("info", "marketplace_drops", index.toString(), "event_image")),
          link: UrlJoin("/", this.currentSite.tenantSlug || "", this.currentSite.siteSlug || "", "drop", drop.uuid),
          landing_page_info: drop.custom_landing_page ? drop.event_landing_page : undefined
        };
      });

    return [
      ...dropEvents,
      ...marketplaceEvents
    ].sort((a, b) => a.start_date > b.start_date ? 1 : -1);
  }

  get nextDrop() {
    return this.dropEvents
      .filter(({end_date}) => {
        try {
          return new Date(end_date).getTime() > Date.now();
          // eslint-disable-next-line no-empty
        } catch(_) {}
      })
      .sort((a, b) => a.start_date > b.start_date ? 1 : -1)[0];
  }

  get nextDropEvent() {
    return this.dropEvents
      .filter(({type}) => type === "drop_event")
      .filter(({end_date}) => {
        try {
          return new Date(end_date).getTime() > Date.now();
          // eslint-disable-next-line no-empty
        } catch(_) {}
      })
      .sort((a, b) => a.start_date > b.start_date ? 1 : -1)[0];
  }

  get baseSitePath() {
    if(!this.siteSlug) {
      return window.location.pathname;
    }

    return UrlJoin("/", this.tenantSlug || "", this.siteSlug);
  }

  UpdateViewers(count) {
    this.viewers = count;
  }

  SetLanguage = flow(function * (language, save=false) {
    if(Array.isArray(language)) {
      for(let i = 0; i < language.length; i++) {
        if(yield this.SetLanguage(language[i], save)) {
          return;
        }
      }

      language = "en";
    }

    language = language.toLowerCase();

    if(language.startsWith("en")) {
      this.l10n = LocalizationEN;
      this.language = "en";
      save ? localStorage.setItem("lang", "en") : localStorage.removeItem("lang");
    } else {
      // Find matching preference (including variants, e.g. pt-br === pt)
      const availableLocalizations = ["pt-br", "test"];
      language = availableLocalizations.find(key => key.startsWith(language) || language.startsWith("key"));

      if(!language) {
        return false;
      }

      const localization = (yield import(`Assets/localizations/${language}.yml`)).default;

      const MergeLocalization = (l10n, en) => {
        if(Array.isArray(en)) {
          return en.map((entry, index) => MergeLocalization((l10n || [])[index], entry));
        } else if(typeof l10n === "object") {
          let newl10n = {};
          Object.keys(en).forEach(key => newl10n[key] = MergeLocalization((l10n || {})[key], en[key]));

          return newl10n;
        } else {
          return l10n || en;
        }
      };

      // Merge non-english localizations with english to ensure defaults are set for all fields
      this.l10n = MergeLocalization(localization, LocalizationEN);
      this.language = language;
    }

    if(save) {
      localStorage.setItem("lang", language);
    }
  });

  SetCurrentDropEvent(dropId) {
    this.currentDropEvent = dropId;
  }

  ChatChannel() {
    if(!this.chatChannel) {
      const startTime = this.currentSiteTicketSku.start_time;

      // Determine chat channel
      const expectedAudienceSize = CHAT_ROOM_SIZE;

      const maxRooms = Math.ceil(expectedAudienceSize / CHAT_ROOM_SIZE);
      const roomNumber = Math.floor(Math.random() * maxRooms);

      this.chatChannel =
        `3-${this.siteSlug}-${roomNumber}-${startTime}-${window.location.hostname}`
          .replace(/[^a-zA-Z0-9\-]/g, "")
          .slice(0, 63);
    }

    return this.chatChannel;
  }

  SitePath(...pathElements) {
    return UrlJoin(this.baseSitePath, ...pathElements);
  }

  constructor(rootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;

    this.Log = rootStore.Log;
  }

  ToggleDarkMode(enabled) {
    this.darkMode = enabled;
  }

  SiteMetadataPath({tenantSlug, siteIndex, siteSlug}={}) {
    if(tenantSlug) {
      // Tenant site
      return UrlJoin("public", "asset_metadata", "tenants", tenantSlug, "sites", siteSlug || "");
    } else {
      // Featured site
      return UrlJoin("public", "asset_metadata", "featured_events", siteIndex.toString(), siteSlug || "");
    }
  }

  FeaturedSite(siteSlug) {
    return this.featuredSiteKeys.find(({slug}) => slug === siteSlug);
  }

  TicketSkuByNTPId(ntpId="") {
    ntpId = ntpId.includes(":") ? ntpId.split(":")[1] : ntpId;
    for(const ticketClass of this.ticketClasses) {
      const ticket = ticketClass.skus.find(sku =>
        sku.otp_id === ntpId ||
        sku.otp_id.split(":")[1] === ntpId
      );

      if(ticket) {
        return ticket;
      }
    }
  }

  Reset() {
    this.assets = {};
    this.error = "";
  }

  LoadMainSite = flow(function * () {
    try {
      const objectId = this.rootStore.mainSiteId;
      const libraryId = yield this.client.ContentObjectLibraryId({objectId});

      this.siteParams = {
        libraryId: libraryId,
        objectId: objectId,
        versionHash: yield this.client.LatestVersionHash({objectId})
      };

      this.baseSiteUrl = yield this.client.FabricUrl({...this.siteParams});

      const mainSiteInfo = (yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        produceLinkUrls: true,
        metadataSubtree: "public/asset_metadata",
        resolveLinks: false
      })) || {};

      // Look for domain redirects
      if(window.location.pathname === "/") {
        for(const domainMap of (mainSiteInfo.info.domain_map || [])) {
          let { domain, tenant_slug, event_slug } = domainMap || {};
          domain = domain.startsWith("https://") ? domain : `https://${domain}`;

          if(new URL(domain).host === window.location.host) {
            window.history.replaceState(
              {},
              "",
              UrlJoin(
                tenant_slug || "",
                event_slug || ""
              )
            );

            this.rootStore.UpdateBaseKey();
            return;
          }
        }
      }

      this.mainSiteInfo = mainSiteInfo;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Error loading site", error);
    }
  });

  LoadFeaturedSites = flow(function * () {
    this.featuredSitesLoaded = false;

    yield Promise.all(
      this.featuredSiteKeys.map(async ({index, slug}) =>
        await this.LoadSite({siteIndex: index, siteSlug: slug})
      )
    );

    this.featuredSitesLoaded = true;

    yield Promise.all(
      this.carouselSiteKeys.map(async ({index, slug}) =>
        await this.LoadSite({siteIndex: index, siteSlug: slug})
      )
    );

    this.carouselSitesLoaded = true;
  });

  LoadTenant = flow(function * ({slug, versionHash}) {
    try {
      if(this.tenants[slug]) { return; }

      if(slug) {
        this.tenants[slug] = (yield this.client.ContentObjectMetadata({
          ...this.siteParams,
          produceLinkUrls: true,
          metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", slug),
          resolveLinks: true,
          linkDepthLimit: 0,
          select: [
            "info",
            "sites",
            "collections",
            "marketplaces"
          ]
        })) || {};
      } else {
        const tenantInfo = (yield this.client.ContentObjectMetadata({
          versionHash,
          metadataSubtree: UrlJoin("public", "asset_metadata"),
          produceLinkUrls: true,
          resolveLinks: true,
          linkDepthLimit: 0,
          select: [
            "slug",
            "info",
            "sites",
            "collections",
            "marketplaces"
          ]
        })) || {};

        slug = tenantInfo.slug;
        this.tenants[slug] = tenantInfo;
      }

      this.tenantSlug = slug;

      if(this.tenants[slug].info && this.tenants[slug].info.logo) {
        const url = new URL(this.baseSiteUrl);
        url.pathname = UrlJoin(url.pathname, "meta", "public", "asset_metadata", "tenants", slug, "info", "logo");

        this.tenants[slug].logoUrl = url.toString();
      }

      if(this.tenants[slug].info && this.tenants[slug].info.privacy_policy_html) {
        const url = new URL(this.baseSiteUrl);
        url.pathname = UrlJoin(url.pathname, "meta", "public", "asset_metadata", "tenants", slug, "info", "privacy_policy_html");

        this.tenants[slug].privacyPolicyUrl = url.toString();
      }

      if(this.tenants[slug].info && this.tenants[slug].info.terms_html) {
        const url = new URL(this.baseSiteUrl);
        url.pathname = UrlJoin(url.pathname, "meta", "public", "asset_metadata", "tenants", slug, "info", "terms_html");

        this.tenants[slug].termsUrl = url.toString();
      }

      return slug;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Error loading site", error);
    }
  });

  ReloadMarketplace = flow(function * () {
    const marketplaceInfo = this.currentSiteInfo.marketplace_info;

    if(!marketplaceInfo || !this.marketplaceHash) {
      return;
    }

    const latestMainSiteHash = yield this.client.LatestVersionHash(this.siteParams);
    const marketplace = yield this.client.ContentObjectMetadata({
      versionHash: latestMainSiteHash,
      metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", marketplaceInfo.tenant_slug, "marketplaces", marketplaceInfo.marketplace_slug, "info"),
      resolveIncludeSource: true,
      select: [".", "tenant_id"]
    });

    if(!marketplace || marketplace["."].source === this.marketplaceHash) {
      return;
    }

    this.marketplaceHash = marketplace["."].source;
    this.eventSites[this.tenantKey][this.siteSlug].info.marketplaceHash = this.marketplaceHash;
    this.eventSites[this.tenantKey][this.siteSlug].info.marketplaceId = this.client.utils.DecodeVersionHash(this.marketplaceHash).objectId;

    this.rootStore.ReloadWallet();

    // Give the wallet some time to re-initialize
    yield new Promise(resolve => setTimeout(resolve, 3000));
  });

  LoadSite = flow(function * ({tenantSlug, siteIndex, siteSlug, fullLoad=false, forceReload=false}) {
    const tenantKey = tenantSlug || "featured";
    if(!forceReload && this.eventSites[tenantKey] && this.eventSites[tenantKey][siteSlug]) {
      return true;
    }

    if(!this.eventSites[tenantKey]) {
      this.eventSites[tenantKey] = {};
    }

    try {
      this.tenantKey = tenantKey;
      this.tenantSlug = tenantSlug;
      this.siteSlug = siteSlug;

      if(typeof siteIndex === "undefined" && !tenantSlug) {
        siteIndex = this.FeaturedSite(siteSlug).index;
      }

      this.siteIndex = siteIndex;

      let heroPreloadPromise;
      if(fullLoad) {
        // Preload the main hero image
        const key = window.innerHeight > window.innerWidth ? "hero_background_mobile" : "hero_background";
        this.cachedHero = new Image();

        heroPreloadPromise = new Promise(resolve => {
          this.cachedHero.addEventListener("load", resolve);
          this.cachedHero.addEventListener("error", resolve);
        });

        this.cachedHero.src = this.SiteUrl(UrlJoin("info", "event_images", key));
      }

      let site = yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        select: [
          ".",
          "tenant_slug",
          "localizations",
          "info",
          "promos",
          "channels"
        ],
        metadataSubtree: this.SiteMetadataPath({tenantSlug, siteIndex, siteSlug}),
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
        produceLinkUrls: true
      });

      yield heroPreloadPromise;

      site.siteSlug = siteSlug;
      site.siteIndex = parseInt(siteIndex);
      site.tenantSlug = tenantSlug || site.tenant_slug;

      this.siteHash = site["."].source;
      this.siteId = this.client.utils.DecodeVersionHash(this.siteHash).objectId;

      const marketplaceInfo = site.info.marketplace_info;

      if(fullLoad) {
        this.darkMode = site.info.theme === "dark";

        switch(site.info.font) {
          case "Inter":
            import("Assets/fonts/Inter/font.css");
            break;

          case "Selawik":
            import("Assets/fonts/Selawik/font.css");
            break;

          case "Compacta":
            import("Assets/fonts/Compacta/font.css");
            break;

          case "Albertus":
            import("Assets/fonts/Albertus/font.css");
            break;

          default:
            break;
        }

        if(site.info.custom_css) {
          document.querySelector("#_custom-css").innerHTML = DOMPurify.sanitize(site.info.custom_css);
        }

        if(marketplaceInfo.marketplace_only) {
          this.marketplaceOnly = true;
          const currentRoute = this.rootStore.currentWalletState.route || "";
          yield this.rootStore.SetWalletPanelVisibility({
            visibility: "exclusive",
            route: currentRoute.startsWith("/marketplace/iq") ? currentRoute : "",
            location: {
              generalLocation: true,
              page: "marketplace",
              params: {
                tenantSlug: marketplaceInfo.tenant_slug,
                marketplaceSlug: marketplaceInfo.marketplace_slug
              }
            }
          });

          this.marketplaceNavigated = true;
        }
      }

      if(fullLoad && marketplaceInfo && marketplaceInfo.marketplace_slug) {
        const marketplaces = [
          marketplaceInfo,
          ...(site.info.additional_marketplaces || [])
        ];

        const marketplaceData = yield Promise.all(
          marketplaces.map(async ({tenant_slug, marketplace_slug}) => {
            let marketplace = (await this.client.ContentObjectMetadata({
              ...this.siteParams,
              metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", tenant_slug, "marketplaces", marketplace_slug, "info", "branding"),
              select: [
                ".",
                "hide_global_navigation",
                "name"
              ],
              resolveIncludeSource: true
            })) || {};

            marketplace.tenant_slug = tenant_slug;
            marketplace.marketplace_slug = marketplace_slug;
            marketplace.marketplaceHash = marketplace["."]?.source;
            marketplace.marketplaceId = marketplace.marketplaceHash && this.rootStore.client.utils.DecodeVersionHash(marketplace.marketplaceHash).objectId;

            return marketplace;
          })
        );

        this.marketplaceHash = marketplaceData[0].marketplaceHash;
        this.marketplaceId = marketplaceData[0].marketplaceId;
        this.marketplaceInfo = {
          ...marketplaceInfo,
          ...marketplaceData[0]
        };

        if(marketplaceData.length > 1) {
          this.additionalMarketplaces = marketplaceData.slice(1);
        }
      }

      this.eventSites[tenantKey][siteSlug] = site;

      if(fullLoad && !forceReload) {
        this.rootStore.cartStore.LoadLocalStorage();

        try {
          this.rootStore.cartStore.InitializeCurrency();

          if(site.localizations && Object.keys(site.localizations).length > 0) {
            for(let language of navigator.languages || [navigator.language]) {
              if(language.startsWith("en")) {
                break;
              }

              language = language.toLowerCase();
              if(site.localizations[language]) {
                this.SetLanguage(language);
              } else if(site.localizations[language.split("-")[0]]) {
                this.SetLanguage(language.split("-")[0]);
              }
            }
          }
        } catch(error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      }

      return true;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Error loading site", error);
    }
  });

  async StreamHash() {
    const channelKey = Object.keys(this.currentSite.channels || {})[0];

    const meta = await this.rootStore.client.ContentObjectMetadata({
      ...this.siteParams,
      versionHash: undefined, // Always pull latest
      metadataSubtree: UrlJoin(this.SiteMetadataPath({...this.currentSite}), "channels", channelKey, "offerings"),
      resolveIncludeSource: true
    });

    return ((meta || {})["."] || {}).container;
  }

  LoadStreamURI = flow(function * () {
    const ticketCode = (this.currentSiteTicket || {}).code;

    if(!ticketCode) { return; }

    // Ensure code is redeemed
    yield this.rootStore.RedeemCode(ticketCode);

    const channelKey = Object.keys(this.currentSite.channels || {})[0];

    if(!channelKey) { return; }

    let streamPath;
    if((this.currentSiteInfo.stream_page || {}).stream) {
      streamPath = UrlJoin(this.SiteMetadataPath({...this.currentSite}), "info", "stream_page", "stream", "offerings");
    } else {
      streamPath = UrlJoin(this.SiteMetadataPath({...this.currentSite}), "channels", channelKey, "offerings");
    }

    const availableOfferings = yield this.rootStore.client.AvailableOfferings({
      ...this.siteParams,
      versionHash: undefined, // Always pull latest
      linkPath: streamPath,
      directLink: true,
      resolveIncludeSource: true
    });

    const offeringId = Object.keys(availableOfferings || {})[0];

    if(!offeringId) { return; }

    return availableOfferings[offeringId].uri;
  });

  LoadDropStreamOptions = flow(function * ({dropIndex, dropState, streamHash, requiresTicket=false}) {
    if(requiresTicket && !this.rootStore.redeemedTicket) {
      const ticketCode = (this.currentSiteTicket || {}).code;

      if(!ticketCode) {
        return;
      }

      // Ensure code is redeemed
      yield this.rootStore.RedeemCode(ticketCode);
    }

    try {
      const availableOfferings = yield this.rootStore.client.AvailableOfferings({
        ...this.siteParams,
        //versionHash: undefined, // Always pull latest
        linkPath: UrlJoin(this.SiteMetadataPath({...this.currentSite}), "info", "drops", dropIndex.toString(), dropState, "stream", "offerings"),
        directLink: true,
        resolveIncludeSource: true
      });

      const offeringId = Object.keys(availableOfferings || {})[0];

      if(!offeringId) {
        return { versionHash: streamHash };
      }

      return { offeringURI: availableOfferings[offeringId].uri };
    } catch(error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    // Not able to play as channel, let player handle playout
    return { versionHash: streamHash };
  });

  ShowCheckoutModal({ticketClass, sku}) {
    this.showCheckout = true;
    this.selectedTicket = { ticketClass, skuIndex: sku };
  }

  CloseCheckoutModal() {
    this.showCheckout = false;
  }

  // Synchronize with elv-media-wallet
  InitializeAnalytics() {
    (this.currentSiteInfo.analytics_ids || []).forEach(analytics => {
      const ids = analytics.ids;

      if(!ids || ids.length === 0) { return; }

      for(const entry of ids) {
        try {
          switch(entry.type) {
            case "Google Analytics ID":
              this.Log("Initializing Google Analytics", "warn");

              const s = document.createElement("script");
              s.setAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${entry.id}`);
              s.async = true;
              document.head.appendChild(s);

              window.dataLayer = window.dataLayer || [];

              // eslint-disable-next-line no-inner-declarations
              function gtag() {
                window.dataLayer.push(arguments);
              }

              const config = {
                "cookie_expires": 31536000
              };

              gtag("js", new Date(), config);
              gtag("config", entry.id, config);

              window.gtag = gtag;

              break;

            case "Google Tag Manager ID":
              this.Log("Initializing Google Tag Manager", "warn");

              (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                  "gtm.start":
                    new Date().getTime(), event: "gtm.js"
                });
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
                j.async = true;
                j.src =
                  "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, "script", "dataLayer", entry.id);

              break;

            case "Facebook Pixel ID":
              this.Log("Initializing Facebook Analytics", "warn");

              !function(f, b, e, v, n, t, s) {
                if(f.fbq) return;
                n = f.fbq = function() {
                  n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if(!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = "2.0";
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
              }(window, document, "script",
                "https://connect.facebook.net/en_US/fbevents.js");
              fbq("init", entry.id);
              fbq("track", "PageView");

              window.ac[`${this.siteSlug}-${analytics.label}-f`] = fbq;

              break;

            case "App Nexus Segment ID":
              this.Log("Initializing App Nexus Analytics", "warn");

              const pixel = document.createElement("img");

              pixel.setAttribute("width", "1");
              pixel.setAttribute("height", "1");
              pixel.style.display = "none";
              pixel.setAttribute("src", `https://secure.adnxs.com/seg?add=${entry.id}&t=2`);

              document.body.appendChild(pixel);

              break;

            case "Twitter Pixel ID":
              this.Log("Initializing Twitter Analytics", "warn");

              !function(e, t, n, s, u, a) {
                e.twq || (s = e.twq = function() {
                  s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                }, s.version = "1.1", s.queue = [], u = t.createElement(n), u.async = !0, u.src = "https://static.ads-twitter.com/uwt.js",
                a = t.getElementsByTagName(n)[0], a.parentNode.insertBefore(u, a));
              }(window, document, "script");
              twq("config", entry.id);

              break;

            default:
              break;
          }
        } catch(error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    });

    this.analyticsInitialized = true;

    this.ProcessAnalyticsEvents();
  }

  // Events may be added before analytics is ready - add to a list and process when possible
  AddAnalyticsEvent({analytics, eventName}) {
    this.analyticsEvents.push({analytics, eventName});

    this.ProcessAnalyticsEvents();
  }

  ProcessAnalyticsEvents() {
    if(!this.analyticsInitialized) { return; }

    this.analyticsEvents.forEach(({analytics, eventName}) =>
      this.AnalyticsEvent({analytics, eventName})
    );

    this.analyticsEvents = [];
  }

  AnalyticsEvent({analytics, eventName}) {
    try {
      if(!this.analyticsInitialized || !analytics) {
        return;
      }

      if(analytics.google_conversion_id) {
        this.Log(`Registering Google Tag Manager ${eventName} event`, "warn");

        window.gtag(
          "event",
          "conversion", {
            "allow_custom_scripts": true,
            "send_to": `DC-3461539/${analytics.google_conversion_id}/${analytics.google_conversion_label}`
          }
        );
      }

      if(analytics.facebook_event_id) {
        const analyticsId = (this.currentSiteInfo.analytics_ids || [])[0]?.ids.find(id => id.type === "Facebook Pixel ID")?.id;

        if(analyticsId) {
          this.Log(`Registering Facebook Analytics ${eventName} event`, "warn");
          fbq("trackSingleCustom", analyticsId, analytics.facebook_event_id);
        }
      }

      if(analytics.twitter_event_id) {
        const analyticsId = (this.currentSiteInfo.analytics_ids || [])[0]?.ids.find(id => id.type === "Twitter Pixel ID")?.id;

        if(analyticsId) {
          this.Log(`Registering Twitter Analytics ${eventName} event`, "warn");
          twq("event", `tw-${analyticsId}-${analytics.twitter_event_id}`);
        }
      }
    } catch(error) {
      this.Log(error, true);
    }
  }

  TrackPurchase(confirmationId, cartDetails) {
    if(cartDetails.total === 0) { return; }

    (this.currentSiteInfo.analytics_ids || []).forEach(analytics => {
      const facebookHook = window.ac[`${this.siteSlug}-${analytics.label}-f`];

      const ids = analytics.ids;

      if(!ids || ids.length === 0) { return; }

      for(const entry of ids) {
        try {
          switch(entry.type) {
            case "Google Analytics ID":
              break;
            case "Google Tag Manager ID":
              break;
            case "Google Conversion ID":
              const conversionLabel = ids.find(id => id.type === "Google Conversion Label");

              if(!conversionLabel) {
                // eslint-disable-next-line no-console
                console.error(`Unable to find corresponding Google conversion label for ${analytics.label} conversion ID`);
                break;
              }

              // eslint-disable-next-line no-inner-declarations
              function gtag() { window.dataLayer.push(arguments); }


              gtag("config", entry.id);
              gtag(
                "event",
                "conversion",
                {
                  send_to: `${entry.id}/${conversionLabel.id}`,
                  value: cartDetails.total,
                  currency: this.rootStore.cartStore.currency,
                  transaction_id: confirmationId
                }
              );

              break;
            case "Facebook Pixel ID":
              facebookHook("track", "Purchase", {
                currency: this.rootStore.cartStore.currency,
                value: cartDetails.total
              });

              break;
            case "App Nexus Pixel ID":
              const segmentId = ids.find(id => id.type === "App Nexus Segment ID");

              if(!segmentId) {
                // eslint-disable-next-line no-console
                console.error(`Unable to find corresponding App Nexus segment ID for ${analytics.label} pixel ID`);
                break;
              }

              const anPixel = document.createElement("img");

              anPixel.setAttribute("width", "1");
              anPixel.setAttribute("height", "1");
              anPixel.style.display = "none";
              anPixel.setAttribute("src", `https://secure.adnxs.com/px?id=${entry.id}&seg=${segmentId.id}&order_id=${confirmationId}&value=${cartDetails.total}&t=2`);

              document.body.appendChild(anPixel);

              break;
            case "TradeDoubler Event ID":
              const organizationId = ids.find(id => id.type === "TradeDoubler Organization ID");

              if(!organizationId) {
                // eslint-disable-next-line no-console
                console.error(`Unable to find corresponding TradeDoubler organization ID for ${analytics.label} event ID`);
                break;
              }

              const tdPixel = document.createElement("img");

              tdPixel.setAttribute("width", "1");
              tdPixel.setAttribute("height", "1");
              tdPixel.style.display = "none";
              tdPixel.setAttribute("src", `https://tbs.tradedoubler.com/report?organization=${organizationId.id}&event=${entry.id}&orderNumber=${confirmationId}&orderValue=${cartDetails.total}`);

              document.body.appendChild(tdPixel);

              break;
            default:
              break;
          }
        } catch(error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to perform conversion tracking for ${analytics.label} ${entry.type}:`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    });
  }

  LoadCookieDependentItems(allow=false) {
    if(allow) {
      // Load Google Analytics
      window.dataLayer = window.dataLayer || [];

      // eslint-disable-next-line no-inner-declarations
      function gtag() {
        dataLayer.push(arguments);
      }

      const config = {
        "cookie_expires": 31536000
      };

      gtag("js", new Date());

      gtag("config", "G-JV6YRZHYG5", config);

      window.ac = {
        g: gtag
      };

      this.InitializeAnalytics();
    }

    // Load Zendesk
    if(document.getElementById("ze-snippet")) { return; }

    window.zESettings = {
      cookies: allow
    };

    const zendeskImport = document.createElement("script");
    zendeskImport.id = "ze-snippet";
    zendeskImport.type = "text/javascript";
    zendeskImport.async = true;
    zendeskImport.src = "https://static.zdassets.com/ekr/snippet.js?key=cec6052c-e357-45e1-86b0-30f30e12eb85";
    zendeskImport.addEventListener("load", () => {
      if(typeof zE === "undefined") { return; }

      zE("webWidget", "helpCenter:setSuggestions", { search: "eluvio" });

      window.zESettings = {
        webWidget: {
          color: {
            theme: "#111111"
          },
          offset: {
            mobile: {
              vertical: "75px"
            }
          }
        }
      };
    });
    document.body.appendChild(zendeskImport);
  }

  /* Site attributes */

  get eventInfo() {
    let eventInfo = {
      hero_info: false,
      feature_header: "",
      date_subheader: "",
      event_header: "",
      event_subheader: "",
      event_title: "",
      location: "",
      show_countdown: false,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      description: "",
      copyright: "",
      show_cookie_banner: false,
      modal_message_get_started: {}
    };

    return mergeWith(
      eventInfo,
      this.currentSiteInfo.event_info || {},
      (def, info) => info ? info : def
    );
  }

  get artistBio() {
    let artistBio = {
      intro: (this.currentSiteInfo.artist_info || {}).intro || "INTRO",
      full_name: "FULL_NAME",
      gender: "GENDER",
      birth_date: "BIRTH_DATE",
      birth_place: "BIRTH_PLACE",
      nationality: "NATIONALITY",
      trivia: "TRIVIA"
    };

    return mergeWith(
      artistBio,
      (this.currentSiteInfo.artist_info || {}).bio || {},
      (def, info) => info ? info : def
    );
  }

  get socialLinks() {
    return (this.currentSiteInfo.artist_info || {}).social_media_links || this.currentSiteInfo.social_media_links || {};
  }

  get calendarEvent() {
    let calendarInfo = {
      title: "",
      description: "",
      location: ""
    };

    return mergeWith(
      calendarInfo,
      this.currentSiteInfo.calendar || {},
      (def, info) => info ? info : def
    );
  }

  get sponsors() {
    return (this.currentSiteInfo.sponsors || []).map(({name, link, image, image_light}, index) => {
      return {
        name,
        link,
        image_url: image ? this.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image")) : "",
        light_image_url: image_light ? this.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image_light")) : ""
      };
    });
  }
  get merchTab() {
    return (this.currentSiteInfo.merch_tab || []).map(({name, price, url}, index) => {
      return {
        name,
        price,
        url,
        front_image: this.SiteUrl(UrlJoin("info", "merch_tab", index.toString(), "front_image")),
        back_image: this.SiteUrl(UrlJoin("info", "merch_tab", index.toString(), "back_image"))
      };
    });
  }

  get streamPageInfo() {
    let streamPageInfo = {
      header: "HEADER",
      subheader: "SUBHEADER"
    };

    return mergeWith(
      streamPageInfo,
      this.currentSiteInfo.stream_page || {},
      (def, info) => info ? info : def
    );
  }

  /* Tickets and Products */

  get ticketClasses() {
    return (this.currentSiteInfo.tickets || []).map((ticketClass, index) => {
      return {
        ...ticketClass,
        release_date: ticketClass.release_date ? new Date(ticketClass.release_date) : undefined,
        image_url: this.SiteUrl(UrlJoin("info", "tickets", index.toString(), "image"))
      };
    }).filter(ticketClass => ticketClass.skus && ticketClass.skus.length > 0);
  }

  Products() {
    return (this.currentSiteInfo.products || [])
      .map((product, index) => {
        return {
          ...product,
          product_options: (product.product_options || []).map((option, optionIndex) => ({...option, optionIndex})),
          image_urls: (product.images || []).map((_, imageIndex) =>
            this.SiteUrl(UrlJoin("info", "products", index.toString(), "images", imageIndex.toString(), "image"))
          )
        };
      });
  }

  DonationItems() {
    return this.Products().filter(item => item.type === "donation");
  }

  Merchandise() {
    return this.Products().filter(item => item.type === "merchandise");
  }

  FeaturedMerchandise() {
    return this.Merchandise().filter(item => item.featured);
  }

  DonationItem(uuid) {
    return this.DonationItems().find(item => item.uuid === uuid);
  }

  MerchandiseItem(uuid) {
    return this.Merchandise().find(item => item.uuid === uuid);
  }

  TicketClassItem(uuid) {
    return this.ticketClasses.find(ticketClass => ticketClass.uuid === uuid);
  }

  TicketItem(uuid) {
    for(const ticketClass of this.ticketClasses) {
      const ticketSku = ticketClass.skus.find(sku => sku.uuid === uuid);

      if(ticketSku) {
        return { ticketClass, ticketSku };
      }
    }

    return {};
  }

  /* Images */

  LocalizedSitePath(path) {
    if(!path) {
      return "";
    }

    // If the current localization has the desired link, point to it
    let localizationPath = "";
    if(
      this.language !== "en" &&
      this.rootStore.client.utils.SafeTraverse(this.currentSite, ...UrlJoin("localizations", this.language, path).split("/"))
    ) {
      localizationPath = UrlJoin("localizations", this.language);
    }

    return UrlJoin(this.currentSiteMetadataPath, localizationPath, path.toString());
  }

  SiteUrl(path) {
    const url = new URL(this.baseSiteUrl);
    url.pathname = UrlJoin(url.pathname, "meta", this.LocalizedSitePath(path));

    return url.toString();
  }

  SiteHasImage(key) {
    try {
      return !!this.currentSiteInfo.event_images[key];
    } catch(error) {
      return false;
    }
  }

  SiteImageUrl(key) {
    if(!(this.currentSiteInfo["event_images"] || {})[key]) {
      return "";
    }

    return this.SiteUrl(UrlJoin("info", "event_images", key));
  }
}

export default SiteStore;
