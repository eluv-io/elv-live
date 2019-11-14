import {observable, action, flow} from "mobx";

class SiteStore {
  @observable site;
  @observable franchises = {};
  @observable titles = {};
  @observable activeTitle;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  LoadSite = flow(function * (objectId) {
    this.site = undefined;
    this.franchises = {};

    const client = this.rootStore.client;

    const libraryId = yield client.ContentObjectLibraryId({objectId});
    const versionHash = (yield client.ContentObject({libraryId, objectId})).hash;

    const siteInfo = yield client.ContentObjectMetadata({
      versionHash,
      metadataSubtree: "public"
    });

    let franchiseInfo = yield client.ContentObjectMetadata({
      versionHash,
      metadataSubtree: "asset_metadata/franchises",
      resolveLinks: true
    });

    yield Promise.all(
      Object.keys(franchiseInfo).map(async franchiseKey => {
        const franchiseVersionHash = await client.LinkTarget({
          versionHash,
          linkPath: `asset_metadata/franchises/${franchiseKey}`
        });

        const publicInfo = await client.ContentObjectMetadata({
          versionHash: franchiseVersionHash,
          metadataSubtree: "public"
        });

        franchiseInfo[franchiseKey] = {
          ...franchiseInfo[franchiseKey],
          key: franchiseKey,
          versionHash: franchiseVersionHash,
          name: publicInfo.name || "",
          description: publicInfo.description || ""
        };
      })
    );

    this.site = {
      libraryId,
      objectId,
      versionHash,
      name: siteInfo.name
    };

    this.franchises = franchiseInfo;

    yield Promise.all(
      Object.keys(this.franchises).map(async franchiseKey => await this.LoadFranchise(franchiseKey))
    );
  });

  @action.bound
  LoadFranchise = flow(function * (franchiseKey) {
    this.titles = {};

    const client = this.rootStore.client;

    const franchise = this.franchises[franchiseKey];

    yield Promise.all(
      Object.keys(franchise.titles).map(async titleKey => {
        const titleVersionHash = await client.LinkTarget({
          versionHash: franchise.versionHash,
          linkPath: `asset_metadata/titles/${titleKey}`
        });

        const publicInfo = await client.ContentObjectMetadata({
          versionHash: titleVersionHash,
          metadataSubtree: "public"
        });

        const playoutOptions = await client.PlayoutOptions({
          versionHash: titleVersionHash,
          protocols: ["hls"]
        });

        const titleInfo = this.franchises[franchiseKey].titles[titleKey];

        let components = {};
        await Promise.all(
          Object.keys(titleInfo.components).map(async component => {
            components[component] = await client.LinkUrl({
              versionHash: titleVersionHash,
              linkPath: `asset_metadata/components/${component}`
            });
          })
        );

        this.titles[titleKey] = {
          ...titleInfo,
          components,
          playoutOptions,
          key: titleKey,
          versionHash: titleVersionHash,
          name: publicInfo.name || "",
          description: publicInfo.description || ""
        };
      })
    );
  });

  @action.bound
  SetActiveTitle(titleKey) {
    this.activeTitle = titleKey;
  }

  @action.bound
  ClearActiveTitle() {
    this.SetActiveTitle(undefined);
  }
}

export default SiteStore;
