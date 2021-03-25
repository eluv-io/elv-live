import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import EluvioConfiguration from "EluvioConfiguration";

const CHAT_ROOM_SIZE = 1000;

import mergeWith from "lodash/mergeWith";

class SiteStore {
  @observable mainSiteInfo;
  @observable baseSiteUrl;

  @observable tenantSlug;
  @observable tenants = {};

  @observable eventSites = {};
  @observable siteSlug;
  @observable siteIndex;
  @observable activeTicket;
  @observable darkMode = false;

  @observable streams = [];
  @observable promos;

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

  // Main site
  @computed get availableTenants() {
    return Object.keys((this.mainSiteInfo || {}).tenants || {});
  }

  @computed get featuredSiteKeys() {
    const featured = (this.mainSiteInfo || {}).featured_events || {};
    return Object.keys(featured)
      .map(index => ({index: index.toString(), slug: Object.keys(featured[index])[0]}));
  }

  @computed get currentSite() {
    return this.eventSites[this.tenantSlug || "featured"][this.siteSlug];
  }

  @computed get currentSiteInfo() {
    return (this.currentSite || {}).info || {};
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

  @computed get hasPromos() {
    return this.currentSite.promos && Object.keys(this.currentSite.promos).length > 0;
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
        resolveLinks: false
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
        resolveLinks: false,
        select: [
          "sites"
        ]
      })) || {};

      this.tenantSlug = slug;
    } catch(error) {
      // TODO: Graceful error handling
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadSite = flow(function * ({tenantSlug, baseSlug="", siteIndex, siteSlug, validateBaseSlug=true}) {
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

      this.eventSites[tenantKey][siteSlug] = yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        select: [
          ".",
          "info",
          "promos"
        ],
        metadataSubtree: this.SiteMetadataPath({tenantSlug, siteIndex, siteSlug}),
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
      });

      this.darkMode = this.eventSites[tenantKey][siteSlug].info.theme === "dark";

      this.eventSites[tenantKey][siteSlug].siteSlug = siteSlug;
      this.eventSites[tenantKey][siteSlug].siteIndex = parseInt(siteIndex);

      this.siteHash = this.eventSites[tenantKey][siteSlug]["."].source;
      this.siteId = this.client.utils.DecodeVersionHash(this.siteHash).objectId;

      this.rootStore.cartStore.LoadLocalStorage();

      // Determine chat channel
      const expectedAudienceSize = 10000;

      const maxRooms = Math.ceil(expectedAudienceSize / CHAT_ROOM_SIZE);
      const roomNumber = Math.floor(Math.random() * maxRooms);

      this.chatChannel = `${this.siteSlug}-${roomNumber}`;

      return !validateBaseSlug || baseSlug === this.baseSlug;
    } catch (error) {
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadStreams = flow(function * () {
    const titleLinks = yield this.client.ContentObjectMetadata({
      ...this.siteParams,
      metadataSubtree: UrlJoin(this.currentSiteMetadataPath, "streams"),
      resolveLinks: true,
      resolveIgnoreErrors: true,
      resolveIncludeSource: true,
      select: [
        "*/*/title",
        "*/*/display_title",
        "*/*/sources"
      ]
    });

    this.streams = yield Promise.all(
      Object.keys(titleLinks || {}).map(async index => {
        const slug = Object.keys(titleLinks[index])[0];

        const { title, display_title, sources } = titleLinks[index][slug];

        const playoutOptions = await this.client.BitmovinPlayoutOptions({
          versionHash: this.siteParams.versionHash,
          linkPath: UrlJoin(this.currentSiteMetadataPath, "streams", index, slug, "sources", "default"),
          protocols: ["hls"],
          drms: await this.client.AvailableDRMs()
        });

        return { title, display_title, playoutOptions }
      })
    );
  });

  @action.bound
  LoadPromos = flow(function * () {
    if(this.promos) { return; }

    const titleLinks = yield this.client.ContentObjectMetadata({
      ...this.siteParams,
      metadataSubtree: UrlJoin(this.currentSiteMetadataPath, "promos"),
      resolveLinks: true,
      resolveIgnoreErrors: true,
      resolveIncludeSource: true,
      select: [
        "*/*/title",
        "*/*/display_title",
        "*/*/sources"
      ]
    });

    this.promos = yield Promise.all(
      Object.keys(titleLinks || {}).map(async index => {
        const slug = Object.keys(titleLinks[index])[0];

        const { title, display_title, sources } = titleLinks[index][slug];

        const playoutOptions = await this.client.BitmovinPlayoutOptions({
          versionHash: this.siteParams.versionHash,
          linkPath: UrlJoin(this.currentSiteMetadataPath, "promos", index, slug, "sources", "default"),
          protocols: ["hls"],
          drms: await this.client.AvailableDRMs()
        });

        return { title, display_title, playoutOptions }
      })
    );
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

  ActivateCode(code="") {
    let ticketPrefixMap = {};

    this.ticketClasses.forEach(ticketClass => {
      (ticketClass.skus || []).forEach(sku => {
        if(sku.otp_id && sku.otp_id.includes(":")) {
          ticketPrefixMap[sku.otp_id.split(":")[0]] = {
            ticketClass,
            sku
          };
        }
      });
    });

    const prefix = Object.keys(ticketPrefixMap)
      .sort((a, b) => a.length > b.length ? -1 : 1)
      .find(prefix => code.startsWith(prefix));

    // TODO: Throw error if ticket with prefix not found
    this.activeTicket = ticketPrefixMap[prefix];
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
      title: "TITLE",
      description: "DESCRIPTION",
      location: "LOCATION",
      start_time: this.eventInfo.date,
      end_time: new Date(this.eventInfo.date).toISOString()
    };

    return mergeWith(
      calendarInfo,
      this.currentSiteInfo.calendar || {},
      (def, info) => info ? info : def
    );
  }

  @computed get sponsors() {
    return (this.currentSiteInfo.sponsors || []).map(({name, footer_text, stream_text}, index) => {
      return {
        name,
        footer_text,
        stream_text,
        image_url: this.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image"))
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

  @computed get paymentConfigurations() {
    return (this.currentSiteInfo.payment_config) || {};
  }

  /* Tickets and Products */

  @computed get ticketClasses() {
    return (this.currentSiteInfo.tickets || []).map((ticketClass, index) => {
      return {
        ...ticketClass,
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
