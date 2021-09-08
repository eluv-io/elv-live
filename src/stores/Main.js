import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import React from "react";

class MainStore {
  @observable featureBlockModalActive = false;

  @observable copyKeys = [
    "beautiful_quality",
    "directly_to_fans",
    "retain_control",
    "push_boundaries",
    "remonetize_endlessly"
  ];

  @computed get featuredSites() {
    if(!this.rootStore.siteStore.featuredSitesLoaded) { return []; }

    return Object.values(this.rootStore.siteStore.eventSites["featured"] || {})
      .sort((a, b) => a.siteIndex < b.siteIndex ? -1 : 1);
  }

  @computed get partners() {
    return {
      production: this.rootStore.siteStore.mainSiteInfo.info.production_partners
        .map((partner, index) => ({...partner, imageUrl: this.MainSiteUrl(UrlJoin("production_partners", index.toString(), "image"))})),
      merchandise: this.rootStore.siteStore.mainSiteInfo.info.merchandise_partners
        .map((partner, index) => ({...partner, imageUrl: this.MainSiteUrl(UrlJoin("merchandise_partners", index.toString(), "image"))}))
    };
  }

  @computed get cardImages() {
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
  @computed get promoPlayoutParameters() {
    return (
      Object.keys(this.rootStore.siteStore.mainSiteInfo.promo_videos || {}).map(
        (index) => ({
          ...(this.rootStore.siteStore.siteParams),
          linkPath: UrlJoin("public", "asset_metadata", "promo_videos", index.toString(), "sources", "default")
        })
      )
    )
  }

  constructor(rootStore) {
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
    return this.FeaturedSiteUrl(siteSlug, UrlJoin("info", "event_images", key))
  }

  @action.bound
  ToggleFeatureBlockModal(show) {
    this.featureBlockModalActive = show;
  }
}

export default MainStore;
