import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import { ethers } from "ethers";

const createKeccakHash = require("keccak");

class SiteStore {
  // Eluvio Live - Data Store
  @observable basePath = "/";
  @observable faqData = [];
  @observable availableSites = {};
  @observable eventSites = {};
  @observable siteSlug;

  @observable baseSiteSelectorUrl;

  // Eluvio Live - Data Store
  @observable stripePublicKey;
  @observable stripeTestMode;

  // Eluvio Live - Event Stream
  @observable titles;
  @observable feeds = [];

  // Eluvio Live - Modal
  @observable showCheckout = false;
  @observable currentProduct;

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

  @computed get currentSite() {
    return this.eventSites[this.siteSlug];
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

      // Checking whether to use test or live mode for Stripe
      this.stripeTestMode = app.stripe_config[0]["test_mode"];
      this.stripePublicKey = this.stripeTestMode ? app.stripe_config[0]["test_public_key"] : app.stripe_config[0]["public_key"];

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
  LoadStreams= flow(function * () {
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
  ShowCheckoutModal({name, description, price, priceId, prodId, otpId, offering}) {
    console.log(name, description, price, priceId, prodId, otpId, offering);
    this.showCheckout = true;
    this.currentProduct = {
      name: name,
      description: description,
      price: price,
      priceId: priceId,
      prodId: prodId,
      otpId: otpId,
      offering: offering
    };
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

  /* Images */

  SiteSelectorImageUrl(key) {
    const uri = URI(this.baseSiteSelectorUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "asset_metadata", "images", key, "default"))
      .toString();
  }

  SiteImageUrl(key) {
    const uri = URI(this.baseSiteSelectorUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "sites", this.siteSlug, "images", key, "default"))
      .toString();
  }

  @computed get sponsorImage() {
    return this.SiteSelectorImageUrl("main_sponsor");
  }

  @computed get heroBackground() {
    return this.SiteImageUrl("hero_background");
  }

  @computed get eventPoster() {
    return this.SiteImageUrl("event_poster");
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
