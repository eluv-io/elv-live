import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class MainStore {
  @computed get featuredSites() {
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
}

export default MainStore;
