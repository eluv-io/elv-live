import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import EluvioConfiguration from "EluvioConfiguration";

const CHAT_ROOM_SIZE = 5000;

import mergeWith from "lodash/mergeWith";

class SiteStore {
  @observable mainSiteInfo;
  @observable baseSiteUrl;

  @observable tenantSlug;
  @observable tenants = {};

  @observable eventSites = {};
  @observable siteSlug;
  @observable siteIndex;
  @observable darkMode = false;

  @observable streams = [];

  @observable showCheckout = false;
  @observable selectedTicket;

  @observable siteId;
  @observable siteHash;

  @observable chatChannel;

  @observable error = "";

  @computed get client() {
    return this.rootStore.client;
  }

  @computed get siteLoaded() {
    return this.rootStore.client && this.mainSiteInfo;
  }

  @computed get production() {
    return this.mainSiteInfo.info.mode === "production";
  }

  // Main site
  @computed get availableTenants() {
    return Object.keys((this.mainSiteInfo || {}).tenants || {});
  }

  @computed get featuredSiteKeys() {
    const featured = (this.mainSiteInfo || {}).featured_events || {};
    return Object.keys(featured)
      .map(index => ({index: index.toString(), slug: Object.keys(featured[index])[0]}));
  }

  // Event Site
  @computed get currentSite() {
    try {
      return this.eventSites[this.tenantSlug || "featured"][this.siteSlug];
    } catch(error) {
      return undefined;
    }
  }

  @computed get currentSiteInfo() {
    return (this.currentSite || {}).info || {};
  }

  @computed get promos() {
    return Object.keys(this.currentSite.promos || {}).map(index => {
      const slug = Object.keys(this.currentSite.promos[index])[0];

      return UrlJoin(this.currentSiteMetadataPath, "promos", index, slug, "sources", "default");
    });
  }

  @computed get currentSiteTicket() {
    return this.rootStore.savedTickets[this.siteSlug];
  }

  @computed get currentSiteTicketSku() {
    if(!this.currentSiteTicket) { return null; }

    return this.TicketSkuByNTPId(this.currentSiteTicket.ntpId);
  }

  @computed get currentSiteMetadataPath() {
    if(this.tenantSlug) {
      // Tenant site
      return UrlJoin("public", "asset_metadata", "tenants", this.tenantSlug, "sites", this.siteSlug || "");
    } else {
      // Featured site
      return UrlJoin("public", "asset_metadata", "featured_events", this.siteIndex.toString(), this.siteSlug || "");
    }
  }

  @computed get baseSlug() {
    return this.currentSiteInfo.base_slug || "";
  }

  @computed get baseSitePath() {
    if(!this.siteSlug) { return window.location.pathname }

    return UrlJoin("/", this.tenantSlug || "", this.tenantSlug ? this.baseSlug : "", this.siteSlug);
  }

  @action.bound
  ChatChannel() {
    if(!this.chatChannel) {
      const startTime = this.currentSiteTicketSku.start_time;

      // Determine chat channel
      const expectedAudienceSize = CHAT_ROOM_SIZE;

      const maxRooms = Math.ceil(expectedAudienceSize / CHAT_ROOM_SIZE);
      const roomNumber = Math.floor(Math.random() * maxRooms);

      this.chatChannel =
        `${this.siteSlug}-${roomNumber}-${startTime}-${window.location.hostname}`
          .replace(/[^a-zA-Z0-9\-]/g, "")
          .slice(0, 63);
    }

    return this.chatChannel;
  }

  SitePath(...pathElements) {
    return UrlJoin(this.baseSitePath, ...pathElements);
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
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

  @action.bound
  ToggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  TicketSkuByNTPId(ntpId) {
    for(const ticketClass of this.ticketClasses) {
      const ticket = ticketClass.skus.find(sku => sku.otp_id === ntpId);

      if(ticket) {
        return ticket;
      }
    }
  }

  @action.bound
  Reset() {
    this.assets = {};
    this.error = "";
  }

  @action.bound
  LoadMainSite = flow(function * () {
    try {
      const objectId = EluvioConfiguration["live-site-id"];
      const libraryId = yield this.client.ContentObjectLibraryId({objectId});

      this.siteParams = {
        libraryId: libraryId,
        objectId: objectId,
        versionHash: yield this.client.LatestVersionHash({objectId})
      };

      this.baseSiteUrl = yield this.client.FabricUrl({...this.siteParams});

      this.mainSiteInfo = (yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        metadataSubtree: "public/asset_metadata",
        resolveLinks: false,
      })) || {};
    } catch(error) {
      // TODO: Graceful error handling
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadFeaturedSites = flow(function * () {
    yield Promise.all(
      this.featuredSiteKeys.map(async ({index, slug}) =>
        await this.LoadSite({siteIndex: index, siteSlug: slug, validateBaseSlug: false})
      )
    )
  });

  @action.bound
  LoadTenant = flow(function * (slug) {
    try {
      if(this.tenants[slug]) { return; }

      this.tenants[slug] = (yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", slug),
        resolveLinks: true,
        linkDepthLimit: 0,
        select: [
          "info",
          "sites",
          "collections"
        ]
      })) || {};

      this.tenantSlug = slug;

      if(this.tenants[slug].info && this.tenants[slug].info.logo) {
        const url = URI(this.baseSiteUrl);

        this.tenants[slug].logoUrl = URI(this.baseSiteUrl)
          .path(UrlJoin(url.path(), "meta", "public", "asset_metadata", "tenants", slug, "info", "logo"))
          .toString();
      }

      if(this.tenants[slug].info && this.tenants[slug].info.privacy_policy_html) {
        const url = URI(this.baseSiteUrl);

        this.tenants[slug].privacyPolicyUrl = url
          .path(UrlJoin(url.path(), "meta", "public", "asset_metadata", "tenants", slug, "info", "privacy_policy_html"))
          .toString();
      }

      if(this.tenants[slug].info && this.tenants[slug].info.terms_html) {
        const url = URI(this.baseSiteUrl);

        this.tenants[slug].termsUrl = url
          .path(UrlJoin(url.path(), "meta", "public", "asset_metadata", "tenants", slug, "info", "terms_html"))
          .toString();
      }
    } catch(error) {
      // TODO: Graceful error handling
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadSite = flow(function * ({tenantSlug, baseSlug="", siteIndex, siteSlug, loadAnalytics=false, validateBaseSlug=true, preloadHero=false}) {
    const tenantKey = tenantSlug || "featured";
    if(this.eventSites[tenantKey] && this.eventSites[tenantKey][siteSlug]) {
      return !validateBaseSlug || baseSlug === this.baseSlug;
    }

    if(!this.eventSites[tenantKey]) {
      this.eventSites[tenantKey] = {};
    }

    try {
      this.tenantSlug = tenantSlug;
      this.siteSlug = siteSlug;

      if(typeof siteIndex === "undefined" && !tenantSlug) {
        siteIndex = this.FeaturedSite(siteSlug).index;
      }

      this.siteIndex = siteIndex;

      let heroPreloadPromise;
      if(preloadHero) {
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
          "info",
          "promos",
          "channels"
        ],
        metadataSubtree: this.SiteMetadataPath({tenantSlug, siteIndex, siteSlug}),
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
      });

      yield heroPreloadPromise;

      //this.darkMode = site.info.theme === "dark";
      this.darkMode = true;

      site.siteSlug = siteSlug;
      site.siteIndex = parseInt(siteIndex);
      site.tenantSlug = tenantSlug;

      this.siteHash = site["."].source;
      this.siteId = this.client.utils.DecodeVersionHash(this.siteHash).objectId;

      this.eventSites[tenantKey][siteSlug] = site;

      this.rootStore.cartStore.LoadLocalStorage();

      if(loadAnalytics) {
        this.InitializeAnalytics();
      }

      return !validateBaseSlug || baseSlug === this.baseSlug;
    } catch (error) {
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

  @action.bound
  LoadStreamURI = flow(function * () {
    const ticketCode = (this.currentSiteTicket || {}).code;

    if(!ticketCode) { return; }

    // Ensure code is redeemed
    yield this.rootStore.RedeemCode(ticketCode);

    const channelKey = Object.keys(this.currentSite.channels || {})[0];

    if(!channelKey) { return; }

    const availableOfferings = yield this.rootStore.client.AvailableOfferings({
      ...this.siteParams,
      versionHash: undefined, // Always pull latest
      linkPath: UrlJoin(this.SiteMetadataPath({...this.currentSite}), "channels", channelKey, "offerings"),
      directLink: true,
      resolveIncludeSource: true
    });

    const offeringId = Object.keys(availableOfferings || {})[0];

    if(!offeringId) { return; }

    return availableOfferings[offeringId].uri;
  });

  @action.bound
  ShowCheckoutModal({ticketClass, sku}) {
    this.showCheckout = true;
    this.selectedTicket = { ticketClass, skuIndex: sku };
  }

  @action.bound
  CloseCheckoutModal() {
    this.showCheckout = false;
  }

  InitializeAnalytics() {
    const analytics = this.currentSiteInfo.analytics || {};

    try {
      if(analytics.google) {
        const s = document.createElement("script");
        s.setAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${analytics.google}`);
        s.async = true;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }

        gtag("js", new Date());
        gtag("config", analytics.google);

        window.ac[`${this.siteSlug}-g`] = gtag;
      }

      if(analytics.google_tag_manager_id) {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',analytics.google_tag_manager_id);
      }
    } catch(error) {
      console.error("Failed to load Google Analytics:");
      console.error(error);
    }

    try {
      if(analytics.facebook) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,"script",
          "https://connect.facebook.net/en_US/fbevents.js");
        fbq("init", analytics.facebook);
        fbq("track", "PageView");

        window.ac[`${this.siteSlug}-f`] = fbq;
      }
    } catch(error) {
      console.error("Failed to load Facebook analytics");
      console.log(error);
    }

    try {
      if(analytics.adnxs_segment_id) {
        const pixel = document.createElement("img");

        pixel.setAttribute("width", "1");
        pixel.setAttribute("height", "1");
        pixel.style.display = "none";
        pixel.setAttribute("src", `https://secure.adnxs.com/seg?add=${analytics.adnxs_segment_id}&t=2`);

        document.body.appendChild(pixel);
      }
    } catch(error) {
      console.error("Failed to load adnxs analytics");
      console.log(error);
    }
  }

  TrackPurchase(confirmationId, cartDetails) {
    if(cartDetails.total === 0) { return; }

    const analytics = this.currentSiteInfo.analytics || {};
    const googleHook = window.ac[`${this.siteSlug}-g`];
    const facebookHook = window.ac[`${this.siteSlug}-f`];

    if(googleHook && analytics.google_conversion_id && analytics.google_conversion_label) {
      googleHook(
        "event",
        "conversion",
        {
          send_to: `${analytics.google_conversion_id}/${analytics.google_conversion_label}`,
          value: cartDetails.total,
          currency: this.rootStore.cartStore.currency,
          transaction_id: confirmationId
        }
      );
    }

    if(analytics.facebook) {
      facebookHook("track", "Purchase", { currency: this.rootStore.cartStore.currency, value: cartDetails.total });
    }

    if(analytics.adnxs_pixel_id && analytics.adnxs_segment_id) {
      const pixel = document.createElement("img");

      pixel.setAttribute("width", "1");
      pixel.setAttribute("height", "1");
      pixel.style.display = "none";
      pixel.setAttribute("src", `https://secure.adnxs.com/px?id=${analytics.adnxs_pixel_id}&seg=${analytics.adnxs_segment_id}&order_id=${confirmationId}&value=${cartDetails.total}&t=2`);

      document.body.appendChild(pixel);
    }

    if(analytics.tradedoubler_organization_id && analytics.tradedoubler_event_id) {
      const pixel = document.createElement("img");

      pixel.setAttribute("width", "1");
      pixel.setAttribute("height", "1");
      pixel.style.display = "none";
      pixel.setAttribute("src", `https://tbs.tradedoubler.com/report?organization=${analytics.tradedoubler_organization_id}&event=${analytics.tradedoubler_event_id}&orderNumber=${confirmationId}&orderValue=${cartDetails.total}`);

      document.body.appendChild(pixel);
    }
  }

  /* Site attributes */

  @computed get eventInfo() {
    let eventInfo = {
      event_header: "",
      event_subheader: "",
      event_title: "",
      location: "",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      description: "",
    };

    return mergeWith(
      eventInfo,
      this.currentSiteInfo.event_info || {},
      (def, info) => info ? info : def
    );
  }

  @computed get artistBio() {
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

  @computed get socialLinks() {
    return (this.currentSiteInfo.artist_info || {}).social_media_links || {};
  }

  @computed get calendarEvent() {
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

  @computed get sponsors() {
    return (this.currentSiteInfo.sponsors || []).map(({name, link, image, image_light}, index) => {
      return {
        name,
        link,
        image_url: image ? this.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image")) : "",
        light_image_url: image_light ? this.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image_light")) : ""
      }
    });
  }
  @computed get merchTab() {
    return (this.currentSiteInfo.merch_tab || []).map(({name, price, url}, index) => {
      return {
        name,
        price,
        url,
        front_image: this.SiteUrl(UrlJoin("info", "merch_tab", index.toString(), "front_image")),
        back_image: this.SiteUrl(UrlJoin("info", "merch_tab", index.toString(), "back_image"))
      }
    });
  }

  @computed get streamPageInfo() {
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

  @computed get ticketClasses() {
    return (this.currentSiteInfo.tickets || []).map((ticketClass, index) => {
      return {
        ...ticketClass,
        release_date: ticketClass.release_date ? new Date(ticketClass.release_date) : undefined,
        image_url: this.SiteUrl(UrlJoin("info", "tickets", index.toString(), "image"))
      }
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
        }
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

  SiteUrl(path) {
    if(!path) {
      return "";
    }

    const uri = URI(this.baseSiteUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", this.currentSiteMetadataPath, path.toString()))
      .toString();
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

    return this.SiteUrl(UrlJoin("info", "event_images", key))
  }

  @computed get heroBackground() {
    return this.SiteImageUrl("hero_background");
  }

  @computed get eventLogo() {
    return this.SiteImageUrl("header");
  }

  @computed get eventPoster() {
    return this.SiteImageUrl("poster");
  }
}

export default SiteStore;
