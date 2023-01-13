import { observable, action, computed, makeObservable } from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class MainStore {
  featureBlockModalActive = false;

  copyKeys = [
    "beautiful_quality",
    "directly_to_fans",
    "retain_control",
    "push_boundaries",
    "remonetize_endlessly"
  ];

  get featuredSites() {
    if(!this.rootStore.siteStore.featuredSitesLoaded) { return []; }

    return Object.values(this.rootStore.siteStore.eventSites["featured"] || {})
      .filter(site => !(site.info || {}).hide_featured)
      .sort((a, b) => a.siteIndex < b.siteIndex ? -1 : 1);
  }

  get carouselSites() {
    return this.rootStore.siteStore.carouselSiteKeys.map(({slug}) =>
      this.rootStore.siteStore.eventSites["featured"][slug]
    ).filter(site => site);
  }

  get upcomingEvents() {
    const events = this.carouselSites
      .filter(site => site.info.type !== "drop_event")
      .map(site => ({
        site,
        header: site.info.event_info.event_header,
        start_date: site.info.event_info.date,
        image: this.FeaturedSiteUrl(site.siteSlug, UrlJoin("info", "event_images", "card_image")),
        link: UrlJoin("/", site.tenantSlug || "", site.siteSlug || "")
      }));

    const dropEvents = this.carouselSites
      .filter(site => site.info.type === "drop_event")
      .map(site =>
        (site.info.drops || []).map((drop, index) => ({
          site,
          header: drop.event_header,
          start_date: drop.start_date,
          image: this.FeaturedSiteUrl(site.siteSlug, UrlJoin("info", "drops", index.toString(), "event_image")),
          link: UrlJoin("/", site.tenantSlug || "", site.siteSlug || "")
        }))
      )
      .flat();

    return [...events, ...dropEvents];
  }

  get partners() {
    return {
      production: this.rootStore.siteStore.mainSiteInfo.info.production_partners
        .map((partner, index) => ({...partner, imageUrl: this.MainSiteUrl(UrlJoin("production_partners", index.toString(), "image"))})),
      merchandise: this.rootStore.siteStore.mainSiteInfo.info.merchandise_partners
        .map((partner, index) => ({...partner, imageUrl: this.MainSiteUrl(UrlJoin("merchandise_partners", index.toString(), "image"))}))
    };
  }

  get cardImages() {
    const images = {};

    this.copyKeys.forEach(copyKey => {
      try {
        images[copyKey] = this.rootStore.siteStore.mainSiteInfo.info.images[copyKey].card_images.map((_, index) => ({
          title: this.rootStore.siteStore.mainSiteInfo.info.images[copyKey].card_images[index].title || "",
          url: this.MainSiteUrl(UrlJoin("images", copyKey, "card_images", index.toString(), "card_image"))
        }));
      } catch(error) {
        images[copyKey] = [];
      }
    });

    return images;
  }

  // Parameters to pass to EluvioPlayer
  get promoPlayoutParameters() {
    return (
      Object.keys(this.rootStore.siteStore.mainSiteInfo.promo_videos || {}).map(
        (index) => ({
          ...(this.rootStore.siteStore.siteParams),
          linkPath: UrlJoin("public", "asset_metadata", "promo_videos", index.toString(), "sources", "default")
        })
      )
    );
  }

  constructor(rootStore) {
    makeObservable(this, {
      featureBlockModalActive: observable,
      copyKeys: observable,
      featuredSites: computed,
      carouselSites: computed,
      upcomingEvents: computed,
      partners: computed,
      cardImages: computed,
      promoPlayoutParameters: computed,
      ToggleFeatureBlockModal: action.bound
    });

    this.rootStore = rootStore;
  }

  MainSiteUrl(path) {
    if(!path) {
      return "";
    }

    const uri = URI(this.rootStore.siteStore.baseSiteUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "asset_metadata", "info", path))
      .toString();
  }

  FeaturedSite(siteSlug) {
    return this.rootStore.siteStore.eventSites["featured"][siteSlug];
  }

  FeaturedSiteUrl(siteSlug, path) {
    if(!siteSlug || !path) {
      return "";
    }

    const featuredSite = this.FeaturedSite(siteSlug);

    if(!featuredSite) {
      return "";
    }

    const uri = URI(this.rootStore.siteStore.baseSiteUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "asset_metadata", "featured_events", featuredSite.siteIndex.toString(), siteSlug, path.toString()))
      .toString();
  }

  FeaturedSiteImageUrl(siteSlug, key) {
    return this.FeaturedSiteUrl(siteSlug, UrlJoin("info", "event_images", key));
  }

  ToggleFeatureBlockModal(show) {
    this.featureBlockModalActive = show;
  }
}

export default MainStore;
