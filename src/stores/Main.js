import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class MainStore {
  @computed get featuredSites() {
    return this.rootStore.siteStore.eventSites["featured"] || {};
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }


  FeaturedSiteUrl(slug, path) {
    if(!slug || !path) {
      return "";
    }

    const uri = URI(this.rootStore.siteStore.baseSiteUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "asset_metadata", "featured_events", slug, path.toString()))
      .toString();
  }

  FeaturedSiteImageUrl(slug, key, height) {
    return this.FeaturedSiteUrl(slug, UrlJoin("info", "event_images", key))
  }
}

export default MainStore;
