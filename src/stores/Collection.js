import {observable, action, flow, computed} from "mobx";
import UrlJoin from "url-join";
import URI from "urijs";

class CollectionStore {
  @observable collections = {};

  @computed get client() {
    return this.rootStore.client;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  LoadCollection = flow(function * (tenantSlug, collectionSlug) {
    if(!this.collections[tenantSlug]) {
      this.collections[tenantSlug] = {};
    }

    this.collections[tenantSlug][collectionSlug] = (yield this.client.ContentObjectMetadata({
      ...this.rootStore.siteStore.siteParams,
      metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", tenantSlug, "collections", collectionSlug),
      resolveLinks: true,
      linkDepthLimit: 0
    })) || {};

    if(!this.collections[tenantSlug][collectionSlug]) { return; }

    if(this.collections[tenantSlug][collectionSlug].info.images.background) {
      this.collections[tenantSlug][collectionSlug].backgroundImage = this.CollectionURL(tenantSlug, collectionSlug, "info/images/background");
    }

    if(this.collections[tenantSlug][collectionSlug].info.images.logo) {
      this.collections[tenantSlug][collectionSlug].logoImage = this.CollectionURL(tenantSlug, collectionSlug, "info/images/logo");
    }
  });

  LoadCollectionItems = flow(function * (tenantSlug, collectionSlug) {
    this.collections[tenantSlug][collectionSlug].items = ((yield this.client.ContentObjectMetadata({
      ...this.rootStore.siteStore.siteParams,
      metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", tenantSlug, "collections", collectionSlug, "items"),
      resolveLinks: true,
      resolveIncludeSource: true
    })) || []).filter(item => item && item["."] && item["."].source);
  });

  CollectionURL(tenantSlug, collectionSlug, path="/") {
    if(!tenantSlug || !collectionSlug) {
      return "";
    }

    const uri = URI(this.rootStore.siteStore.baseSiteUrl);

    return uri
      .path(UrlJoin(uri.path(), "meta", "public", "asset_metadata", "tenants", tenantSlug, "collections", collectionSlug, path))
      .toString();
  }
}

export default CollectionStore;
