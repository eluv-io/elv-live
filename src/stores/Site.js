import {observable, action, flow} from "mobx";
import UrlJoin from "url-join";

class SiteStore {
  @observable site;
  @observable franchises = {};
  @observable titles = {};
  @observable authTokens = {};
  @observable activeTitle;

  constructor(rootStore) {
    this.rootStore = rootStore;
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
      produceLinkUrls: true,
      resolveLinks: true
    });

    yield Promise.all(
      Object.keys(franchiseInfo).map(async franchiseKey => {
        const franchiseVersionHash = await client.LinkTarget({
          versionHash,
          linkPath: `asset_metadata/franchises/${franchiseKey}`
        });

        franchiseInfo[franchiseKey] = {
          ...franchiseInfo[franchiseKey],
          versionHash: franchiseVersionHash
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
  });

  @action.bound
  LoadTitle = flow(function * (franchiseKey, titleKey) {
    if(this.titles[titleKey]) {
      // Already loaded
      return;
    }

    const client = this.rootStore.client;
    const franchiseVersionHash = yield client.LinkTarget({
      versionHash: this.site.versionHash,
      linkPath: `asset_metadata/franchises/${franchiseKey}`
    });
    const titleInfo = this.franchises[franchiseKey].titles[titleKey];

    const titleVersionHash = yield client.LinkTarget({
      versionHash: franchiseVersionHash,
      linkPath: UrlJoin(
        "asset_metadata",
        "titles",
        titleKey
      )
    });

    // Resolve playout options for trailers
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
            playoutOptions: await client.BitmovinPlayoutOptions({
              versionHash: trailerHash,
              protocols: ["dash", "hls"]
            })
          };
        })
      );
    }

    // Resolve playout options for clips
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

    const playoutOptions = yield client.BitmovinPlayoutOptions({
      versionHash: titleVersionHash,
      protocols: ["dash", "hls"]
    });

    this.authTokens[titleKey] = yield client.GenerateStateChannelToken({
      versionHash: titleVersionHash
    });

    this.titles[titleKey] = {
      ...titleInfo,
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
