import {observable, action, flow, runInAction} from "mobx";

class SiteStore {
  @observable site;
  @observable franchises = {};
  @observable titles = {};
  @observable authTokens = {};
  @observable activeTitle;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  async ResolveImageLinks({versionHash, imageSpec}) {
    let images = {};

    if(imageSpec) {
      await Promise.all(
        Object.keys(imageSpec).map(async image => {
          images[image] = await this.rootStore.client.LinkUrl({
            versionHash,
            linkPath: `asset_metadata/images/${image}`
          });
        })
      );
    }

    return images;
  }

  @action.bound
  LoadSite = flow(function * (objectId) {
    this.site = undefined;
    this.franchises = {};
    this.titles = {};

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
    const client = this.rootStore.client;
    const franchise = this.franchises[franchiseKey];

    yield Promise.all(
      Object.keys(franchise.titles).map(async titleKey => {
        const titleInfo = this.franchises[franchiseKey].titles[titleKey];

        const titleVersionHash = await client.LinkTarget({
          versionHash: franchise.versionHash,
          linkPath: `asset_metadata/titles/${titleKey}`
        });

        const poster = await client.LinkUrl({
          versionHash: titleVersionHash,
          linkPath: "asset_metadata/images/poster"
        });

        runInAction(() => {
          this.franchises[franchiseKey].titles[titleKey].poster = poster;
          this.franchises[franchiseKey].titles[titleKey].name = titleInfo.title || titleInfo.name;
        });
      })
    );
  });

  @action.bound
  LoadTitle = flow(function * (franchiseKey, titleKey) {
    if(this.titles[titleKey]) {
      // Already loaded
      return;
    }

    const client = this.rootStore.client;
    const franchise = this.franchises[franchiseKey];
    const titleInfo = this.franchises[franchiseKey].titles[titleKey];

    const titleVersionHash = yield client.LinkTarget({
      versionHash: franchise.versionHash,
      linkPath: `asset_metadata/titles/${titleKey}`
    });

    // Resolve images and playout options for trailers
    let trailers = {};
    if(titleInfo.trailers) {
      yield Promise.all(
        Object.keys(titleInfo.trailers).map(async key => {
          const trailerHash = await client.LinkTarget({
            versionHash: titleVersionHash,
            linkPath: `asset_metadata/trailers/${key}`
          });

          trailers[key] = {
            ...titleInfo.trailers[key],
            images: await this.ResolveImageLinks({
              versionHash: trailerHash,
              imageSpec: titleInfo.trailers[key].images
            }),
            playoutOptions: await client.BitmovinPlayoutOptions({
              versionHash: trailerHash,
              protocols: ["dash", "hls"]
            })
          };
        })
      );
    }

    // Resolve images and playout options for clips
    let clips = {};
    if(titleInfo.clips) {
      yield Promise.all(
        Object.keys(titleInfo.clips).map(async key => {
          const clipHash = await client.LinkTarget({
            versionHash: titleVersionHash,
            linkPath: `asset_metadata/clips/${key}`
          });

          clips[key] = {
            ...titleInfo.clips[key],
            images: await this.ResolveImageLinks({
              versionHash: clipHash,
              imageSpec: titleInfo.clips[key].images
            }),
            playoutOptions: await client.BitmovinPlayoutOptions({
              versionHash: clipHash,
              protocols: ["dash", "hls"]
            })
          };
        })
      );
    }
    /*
      // hls.js / dash.js
      const playoutOptions = await client.PlayoutOptions({
        versionHash: titleVersionHash,
        protocols: ["hls"]
      });
    */
    const images = yield this.ResolveImageLinks({
      versionHash: titleVersionHash,
      imageSpec: titleInfo.images
    });

    const playoutOptions = yield client.BitmovinPlayoutOptions({
      versionHash: titleVersionHash,
      protocols: ["dash", "hls"]
    });

    this.authTokens[titleKey] = yield client.GenerateStateChannelToken({
      versionHash: titleVersionHash
    });

    this.titles[titleKey] = {
      ...titleInfo,
      images,
      clips,
      trailers,
      playoutOptions,
      key: titleKey,
      versionHash: titleVersionHash,
      name: titleInfo.title || titleInfo.name || ""
    };
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
