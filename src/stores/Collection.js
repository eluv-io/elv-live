import {observable, action, flow, computed} from "mobx";
import UrlJoin from "url-join";
import URI from "urijs";
import EluvioConfiguration from "../../configuration";

class CollectionStore {
  @observable collections = {};

  @computed get client() {
    return this.rootStore.client;
  }

  EmbedURL({tenantSlug, collectionSlug, item}) {
    const collection = this.collections[tenantSlug][collectionSlug];

    const network = EluvioConfiguration["config-url"].includes("demov3") ? "demo" : "main";

    const embedUrl = URI("https://embed.v3.contentfabric.io")
      .query({
        net: network,
        ptk: null,
        p: null,
        dk: null,
        sh: null,
        st: null,
        ap: null,
        ct: "h",
        ten: collection.info.access.tenant_id,
        ntp: collection.info.access.ntp_id,
        sbj: btoa(collection.subject),
        vid: item["."].source,
        data: btoa(JSON.stringify({
          meta_tags: {
            "og:title": item.display_title || item.title
          }
        }))
      });

    return embedUrl.toString();
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

  RedeemCode = flow(function * ({tenantSlug, collectionSlug, subject, code}) {
    const collection = this.collections[tenantSlug][collectionSlug];

    yield this.client.RedeemCode({
      tenantId: collection.info.access.tenant_id,
      ntpId: collection.info.access.ntp_id,
      email: (subject || "").trim(),
      code: (code || "").trim()
    });

    this.collections[tenantSlug][collectionSlug].subject = subject;
    this.collections[tenantSlug][collectionSlug].code = code;

    this.collections[tenantSlug][collectionSlug].items = ((yield this.client.ContentObjectMetadata({
      ...this.rootStore.siteStore.siteParams,
      metadataSubtree: UrlJoin("public", "asset_metadata", "tenants", tenantSlug, "collections", collectionSlug, "items"),
      resolveLinks: true,
      resolveIncludeSource: true
    })) || [])
      .filter(item => item && item["."] && item["."].source)
      .map(item => {
        item.embedUrl = this.EmbedURL({tenantSlug, collectionSlug, item});
        return item;
      });
  });

  TransferNFT = flow(function * ({tenantSlug, collectionSlug, ethereumAddress, email}) {
    const collection = this.collections[tenantSlug][collectionSlug];

    return yield (yield this.client.authClient.MakeAuthServiceRequest({
      method: "POST",
      path: UrlJoin("as", "otp", "nft", collection.info.access.tenant_id, collection.info.access.ntp_id),
      body: {
        _PASSWORD: (collection.code || "").trim(),
        _EMAIL: (collection.subject || "").trim(),
        _NFT_EMAIL: (email || "").trim(),
        _ETH_ADDR: (ethereumAddress || "").trim()
      }
    })).json();
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
