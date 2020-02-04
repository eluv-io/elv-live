import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class SiteStore {
  @observable siteLibraryId;

  @observable siteInfo;
  @observable titles = [];
  @observable playlists = [];
  @observable activeTitleIndices = {
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

  @computed get activeTitle() {
    const {playlistIndex, titleIndex} = this.activeTitleIndices;

    if(titleIndex === undefined) { return undefined; }

    if(playlistIndex !== undefined) {
      return this.playlists[playlistIndex].titles[titleIndex];
    } else {
      return this.titles[titleIndex];
    }
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  LoadSite = flow(function * () {
    try {
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

      this.titles = yield this.LoadTitles(siteInfo.titles);
      this.playlists = yield this.LoadPlaylists(siteInfo.playlists);

      delete siteInfo.titles;
      delete siteInfo.playlists;

      this.siteInfo = siteInfo;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load site:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  @action.bound
  LoadTitles = flow(function * (titleInfo) {
    // Titles: {[index]: {[title-key]: { ...title }}
    let titles = [];
    yield Promise.all(
      Object.keys(titleInfo).map(async index => {
        try {
          const titleKey = Object.keys(titleInfo[index])[0];
          let title = titleInfo[index][titleKey];

          title.baseLinkUrl =
            await this.client.LinkUrl({
              libraryId: this.siteLibraryId,
              objectId: this.siteId,
              linkPath: `public/asset_metadata/titles/${index}/${titleKey}`
            });

          title.playoutOptionsLinkPath = `public/asset_metadata/titles/${index}/${titleKey}/sources/default`;

          title.titleIndex = parseInt(index);

          titles[title.titleIndex] = title;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load title ${index}`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );

    return titles.filter(title => title);
  });

  @action.bound
  LoadPlaylists = flow(function * (playlistInfo) {
    // Playlists: {[index]: {[playlist-name]: {[title-key]: { ...title }}}
    let playlists = [];
    yield Promise.all(
      Object.keys(playlistInfo).map(async index => {
        try {
          const playlistName = Object.keys(playlistInfo[index])[0];
          const playlistIndex = parseInt(index);

          const playlistTitles = await Promise.all(
            Object.keys(playlistInfo[index][playlistName]).map(async (titleKey, titleIndex) => {
              try {
                let title = playlistInfo[index][playlistName][titleKey];

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
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Failed to load title ${titleIndex} (${titleKey}) in playlist ${index} (${playlistName})`);
                // eslint-disable-next-line no-console
                console.error(error);
              }
            })
          );

          playlists[playlistIndex] = {
            playlistIndex,
            name: playlistName,
            titles: playlistTitles.filter(title => title)
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load playlist ${index}`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );

    return playlists.filter(playlist => playlist);
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
    this.activeTitleIndices = {
      playlistIndex,
      titleIndex
    };
  }

  @action.bound
  ClearActiveTitle() {
    this.activeTitleIndices = {
      playlistIndex: undefined,
      titleIndex: undefined
    };
  }

  @action.bound
  CreateLink(baseLink, path, query={}) {
    const basePath = URI(baseLink).path();

    return URI(baseLink)
      .path(UrlJoin(basePath, path))
      .addQuery(query)
      .toString();
  }
}

export default SiteStore;
