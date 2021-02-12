import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
//import { ethers } from "ethers";

import mergeWith from "lodash/mergeWith";
import {NonPrefixNTPId} from "Utils/Misc";

const createKeccakHash = require("keccak");

class SiteStore {
  // Eluvio Live - Data Store
  @observable faqData = [];
  @observable availableSites = {};
  @observable eventSites = {};
  @observable siteSlug;
  @observable activeTicket;

  @observable baseSiteSelectorUrl;

  // Eluvio Live - Event Stream
  @observable streams = [];
  @observable promos;

  // Eluvio Live - Modal
  @observable showCheckout = false;
  @observable selectedTicket;

  @observable error = "";

  @computed get client() {
    return this.rootStore.client;
  }

  @computed get currentSite() {
    return this.eventSites[this.siteSlug];
  }

  @computed get currentSiteInfo() {
    return (this.currentSite || {}).info || {};
  }

  @computed get siteMetadataPath() {
    return UrlJoin("public", "asset_metadata", "sites", this.siteSlug || "");
  }

  @computed get baseSlug() {
    return this.currentSiteInfo.base_slug || "";
  }

  @computed get baseSitePath() {
    if(!this.siteSlug) { return window.location.pathname }

    return UrlJoin("/", this.baseSlug, this.siteSlug);
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

  @action.bound
  Reset() {
    this.assets = {};
    this.error = "";
  }

  LoadSiteSelector = flow(function * (objectId) {
    try {
      const libraryId = yield this.client.ContentObjectLibraryId({objectId});

      this.siteParams = {
        libraryId: libraryId,
        objectId: objectId,
        versionHash: yield this.client.LatestVersionHash({objectId})
      };

      this.baseSiteSelectorUrl = yield this.client.FabricUrl({...this.siteParams});

      const siteSelectorInfo = (yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        metadataSubtree: "public/asset_metadata",
        resolveLinks: false,
        select: [
          "sites",
          "info/faq"
        ]
      })) || {};

      // Loading Support FAQ questions & answers
      this.faqData = (siteSelectorInfo.info || {}).faq || [];

      this.availableSites = siteSelectorInfo.sites || {};
    } catch(error) {
      // TODO: Graceful error handling
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadSite = flow(function * (baseSlug="", slug) {
    if(this.eventSites[slug]) {
      return baseSlug === this.baseSlug;
    }

    try {
      this.siteSlug = slug;
      this.eventSites[slug] = yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        select: [
          ".",
          "info",
          "promos"
        ],
        metadataSubtree: this.siteMetadataPath,
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
      });

      const siteHash = this.eventSites[slug]["."].source;
      this.siteId = this.client.utils.DecodeVersionHash(siteHash).objectId;

      return baseSlug === this.baseSlug;
    } catch (error) {
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadStreams = flow(function * () {
    const titleLinks = yield this.client.ContentObjectMetadata({
      ...this.siteParams,
      metadataSubtree: UrlJoin(this.siteMetadataPath, "streams"),
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
          linkPath: UrlJoin(this.siteMetadataPath, "streams", index, slug, "sources", "default"),
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
      metadataSubtree: UrlJoin(this.siteMetadataPath, "promos"),
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
          linkPath: UrlJoin(this.siteMetadataPath, "promos", index, slug, "sources", "default"),
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
    var $body = $(document.body);
  }

  // Generate confirmation number for checkout based on otpId and email
  @action.bound
  generateConfirmationId(otpId, email, sz=10) {
    otpId = NonPrefixNTPId(otpId);

    //Concatenate otpId and email, then hash
    let id = createKeccakHash('keccak256').update(`${otpId}:${email}`).digest();

    if (sz <  id.length) {
      id = id.slice(0, sz);
    }

    return this.client.utils.B58(id);
  };

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
    return (this.currentSiteInfo.tickets || []).map((ticket, index) => {
      return {
        ...ticket,
        image_url: this.SiteUrl(UrlJoin("info", "tickets", index.toString(), "image"))
      }
    }).filter(ticketClass => ticketClass.skus && ticketClass.skus.length > 0);
  }

  Products(currency) {
    currency = (currency || "").toLowerCase();
    return (this.currentSiteInfo.products || [])
      .map((product, productIndex) => {
        return {
          ...product,
          skus: (product.skus || []).filter(sku => ((sku.price || {}).currency).toLowerCase() === currency),
          image_urls: (product.images || []).map((_, imageIndex) =>
            this.SiteUrl(UrlJoin("info", "products", productIndex.toString(), "images", imageIndex.toString(), "image"))
          )
        }
      })
      .filter(product => product.skus && product.skus.length > 0);
  }

  DonationItems(currency) {
    return this.Products(currency).filter(item => item.type === "donation");
  }

  Merchandise(currency) {
    return this.Products(currency).filter(item => item.type === "merchandise");
  }

  /* Images */

  SiteUrl(path) {
    if(!path) {
      return "";
    }

    const uri = URI(this.baseSiteSelectorUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", this.siteMetadataPath, path.toString()))
      .toString();
  }

  SiteImageUrl(key) {
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
