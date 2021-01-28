import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import { ethers } from "ethers";

import _ from "lodash";

const createKeccakHash = require("keccak");

class SiteStore {
  // Eluvio Live - Data Store
  @observable basePath = "/";
  @observable faqData = [];
  @observable availableSites = {};
  @observable eventSites = {};
  @observable siteSlug;

  @observable baseSiteSelectorUrl;

  // Eluvio Live - Event Stream
  @observable feeds = [];

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

    this.error = "";
  }

  LoadSiteSelector = flow(function * (objectId) {
    try {
      const libraryId = yield this.client.ContentObjectLibraryId({objectId});

      this.siteParams = {
        libraryId: libraryId,
        objectId: objectId,
        versionHash: yield this.client.LatestVersionHash({objectId}),
        writeToken: ""
      };

      this.baseSiteSelectorUrl = yield this.client.FabricUrl({...this.siteParams});

      const {app, sites} = yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        metadataSubtree: "public",
        resolveLinks: false,
        select: [
          "app",
          "sites",
          "asset_metadata/images"
        ]
      });

      if(app.base_path && (app.base_path !== "") && (app.base_path.charAt(0) === "/")) {
        this.basePath = app.base_path;
      }

      // Loading Support FAQ questions & answers
      this.faqData = app.faq;

      this.availableSites = sites;
    } catch(error) {
      // TODO: Graceful error handling
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadSite = flow(function * (slug) {
    if(this.eventSites[slug]) { return; }

    try {
      this.eventSites[slug] = yield this.client.ContentObjectMetadata({
        ...this.siteParams,
        metadataSubtree: UrlJoin("public", "sites", slug),
        resolveLinks: true,
        resolveIncludeSource: true,
        resolveIgnoreErrors: true,
      });

      this.siteSlug = slug;
    } catch (error) {
      console.error("Error loading site", error);
    }
  });

  @action.bound
  LoadStreams = flow(function * () {
    const titleLinks = yield this.client.ContentObjectMetadata({
      ...this.siteParams,
      metadataSubtree: UrlJoin("public", "sites", this.siteSlug, "titles"),
      resolveLinks: true,
      resolveIgnoreErrors: true,
      resolveIncludeSource: true,
      select: [
        "*/*/title",
        "*/*/display_title",
        "*/*/sources"
      ]
    });

    this.feeds = yield Promise.all(
      Object.keys(titleLinks).map(async index => {
        const slug = Object.keys(titleLinks[index])[0];

        const { title, display_title, sources } = titleLinks[index][slug];

        const playoutOptions = await this.client.BitmovinPlayoutOptions({
          versionHash: this.siteParams.versionHash,
          linkPath: UrlJoin("public", "sites", this.siteSlug, "titles", index, slug, "sources", "default"),
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

  // Generate confirmation number for checkout based on otpId and email
  @action.bound
  generateConfirmationId(otpId, email, sz = 10) {
    //Concatenate otpId and email, then hash
    let id = createKeccakHash('keccak256').update(`${otpId}:${email}`).digest();

    if (sz <  id.length) {
      id = id.slice(0, sz);
    }

    return ethers.utils.base58.encode(id);
  };


  /* Site attributes */

  @computed get eventInfo() {
    let eventInfo = {
      artist: "ARTIST",
      location: "LOCATION",
      date: new Date().toISOString(),
      event_header: "EVENT_HEADER",
      description: "DESCRIPTION",
    };

    return _.mergeWith(
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

    return _.mergeWith(
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
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString()
    };

    return _.mergeWith(
      calendarInfo,
      this.currentSiteInfo.calendar || {},
      (def, info) => info ? info : def
    );
  }

  @computed get sponsors() {
    return (this.currentSiteInfo.sponsors || []).map(({footer_text, stream_text}, index) => {
      return {
        footer_text,
        stream_text,
        image_url: this.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image"))
      }
    });
  }

  @computed get streamPageInfo() {
    let streamPageInfo = {
      header: "HEADER",
      subheader: "SUBHEADER"
    };

    return _.mergeWith(
      streamPageInfo,
      this.currentSiteInfo.stream_page || {},
      (def, info) => info ? info : def
    );
  }

  @computed get stripePublicKey() {
    const stripeConfig = (this.currentSiteInfo.stripe_config) || {};

    return stripeConfig.test_mode ? stripeConfig.test_public_key : stripeConfig.publicKey;
  }

  /* Tickets and Products */

  @computed get ticketClasses() {
    return (this.currentSiteInfo.tickets || []).map(({name, description, skus}, index) => {
      return {
        name,
        description,
        skus,
        image_url: this.SiteUrl(UrlJoin("info", "tickets", index.toString(), "image"))
      }
    }).filter(ticketClass => ticketClass.skus && ticketClass.skus.length > 0);
  }

  @computed get products() {
    return (this.currentSiteInfo.products || []).map((product, productIndex) => {
      return {
        ...product,
        image_urls: (product.images || []).map((_, imageIndex) =>
          this.SiteUrl(UrlJoin("info", "products", productIndex.toString(), "images", imageIndex.toString(), "image"))
        )
      }
    });
  }

  @computed get donationItems() {
    return this.products.filter(item => item.type === "donation");
  }

  @computed get merchandise() {
    return this.products.filter(item => item.type === "merchandise");
  }

  /* Images */

  SiteUrl(path) {
    const uri = URI(this.baseSiteSelectorUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "sites", this.siteSlug, path))
      .toString();
  }

  SiteImageUrl(key) {
    console.log(this.SiteUrl(UrlJoin("info", "event_images", key)));
    return this.SiteUrl(UrlJoin("info", "event_images", key))
  }

  @computed get heroBackground() {
    return this.SiteImageUrl("hero_background");
  }

  @computed get eventPoster() {
    return this.SiteImageUrl("poster");
  }

  @computed get donationImage() {
    return this.SiteImageUrl("checkout_donation");
  }

  @computed get merchImage() {
    return this.SiteImageUrl("checkout_merch");
  }

  @computed get merchBackImage() {
    return this.SiteImageUrl("merch_back");
  }
}

export default SiteStore;
