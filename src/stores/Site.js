import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class SiteStore {
  @observable siteLibraryId;

  @observable siteInfo;
  @observable titles = [];
  @observable playlists = [];
  @observable activeTitle = {
    playlistIndex: undefined,
    titleIndex: undefined
  };

  @observable playoutUrl;
  @observable authToken;

  @computed get client() {
    return this.rootStore.client;
  }

  @computed get siteId() {
    return this.rootStore.siteId;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  LoadSite = flow(function * () {
    this.siteLibraryId = yield this.client.ContentObjectLibraryId({objectId: this.siteId});

    const siteName = yield this.client.ContentObjectMetadata({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      metadataSubtree: "public/name"
    });

    let siteInfo = yield this.client.ContentObjectMetadata({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      metadataSubtree: "public/asset_metadata",
      resolveLinks: true
    });

    siteInfo.name = siteName;

    siteInfo.baseLinkUrl = yield this.client.LinkUrl({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      linkPath: "public/asset_metadata"
    });

    // Produce links for titles and playlists

    // Titles: {[index]: {[title-key]: { ...title }}
    let titles = [];
    yield Promise.all(
      Object.keys(siteInfo.titles).map(async index => {
        const titleKey = Object.keys(siteInfo.titles[index])[0];
        let title = siteInfo.titles[index][titleKey];

        title.baseLinkUrl =
          await this.client.LinkUrl({
            libraryId: this.siteLibraryId,
            objectId: this.siteId,
            linkPath: `public/asset_metadata/titles/${index}/${titleKey}`
          });

        title.playoutOptionsLinkPath = `public/asset_metadata/titles/${index}/${titleKey}/sources/default`;

        title.titleIndex = parseInt(index);

        titles[title.titleIndex] = title;
      })
    );

    // Playlists: {[index]: {[playlist-name]: {[title-key]: { ...title }}}
    let playlists = [];
    yield Promise.all(
      Object.keys(siteInfo.playlists).map(async index => {
        const playlistName = Object.keys(siteInfo.playlists[index])[0];
        const playlistIndex = parseInt(index);

        const playlistTitles = await Promise.all(
          Object.keys(siteInfo.playlists[index][playlistName]).map(async (titleKey, titleIndex) => {
            let title = siteInfo.playlists[index][playlistName][titleKey];

            title.baseLinkUrl =
              await this.client.LinkUrl({
                libraryId: this.siteLibraryId,
                objectId: this.siteId,
                linkPath: `public/asset_metadata/playlists/${index}/${playlistName}/${titleKey}`
              });

            title.playoutOptionsLinkPath = `public/asset_metadata/playlists/${index}/${playlistName}/${titleKey}/sources/default`;

            title.playlistIndex = playlistIndex;
            title.titleIndex = titleIndex;

            return title;
          })
        );

        playlists[playlistIndex] = {
          playlistIndex,
          name: playlistName,
          titles: playlistTitles
        };
      })
    );

    this.titles = titles;
    this.playlists = playlists;

    delete siteInfo.titles;
    delete siteInfo.playlists;

    this.siteInfo = siteInfo;
  });

  @action.bound
  LoadPlayoutOptions = flow(function * ({playlistIndex, titleIndex}) {
    let title;
    if(playlistIndex !== undefined) {
      title = this.playlists[playlistIndex].titles[titleIndex];
    } else {
      title = this.titles[titleIndex];
    }

    const playoutOptions = yield this.client.PlayoutOptions({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      linkPath: title.playoutOptionsLinkPath,
      protocols: ["hls"],
      drms: ["aes-128"]
    });

    if(playlistIndex !== undefined) {
      this.playlists[playlistIndex].titles[titleIndex].playoutOptions = playoutOptions;
    } else {
      this.titles[titleIndex].playoutOptions = playoutOptions;
    }
  });

  @action.bound
  SetActiveTitle({playlistIndex, titleIndex}) {
    this.activeTitle = {
      playlistIndex,
      titleIndex
    };
  }

  @action.bound
  ClearActiveTitle() {
    this.activeTitle = {
      playlistIndex: undefined,
      titleIndex: undefined
    };
  }

  @action.bound
  CreateLink(baseLink, path) {
    const basePath = URI(baseLink).path();
    return URI(baseLink)
      .path(UrlJoin(basePath, path))
      .toString();
  }
}

export default SiteStore;
