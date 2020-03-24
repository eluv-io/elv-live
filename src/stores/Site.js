import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class SiteStore {
  @observable siteLibraryId;

  @observable siteInfo;
  @observable titles = [];
  @observable channels = [];
  @observable playlists = [];
  @observable activeTitle;

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

      if(siteInfo.titles) {
        this.titles = yield this.LoadTitles(siteInfo.titles);
      }

      if(siteInfo.channels) {
        this.channels = yield this.LoadTitles(siteInfo.channels);
      }

      if(siteInfo.playlists) {
        this.playlists = yield this.LoadPlaylists(siteInfo.playlists);
      }

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
    if(!titleInfo) { return; }
    
    // Titles: {[index]: {[title-key]: { ...title }}
    let titles = [];
    yield Promise.all(
      Object.keys(titleInfo).map(async index => {
        try {
          const titleKey = Object.keys(titleInfo[index])[0];
          let title = titleInfo[index][titleKey];

          title.titleIndex = parseInt(index);

          if(title.channel_info) {
            title.playoutOptionsLinkPath = `public/asset_metadata/channels/${index}/${titleKey}/sources/default`;
            title.baseLinkUrl =
              await this.client.LinkUrl({
                libraryId: this.siteLibraryId,
                objectId: this.siteId,
                linkPath: `public/asset_metadata/channels/${index}/${titleKey}`
              });
          } else {
            title.playoutOptionsLinkPath = `public/asset_metadata/titles/${index}/${titleKey}/sources/default`;
            title.baseLinkUrl =
              await this.client.LinkUrl({
                libraryId: this.siteLibraryId,
                objectId: this.siteId,
                linkPath: `public/asset_metadata/titles/${index}/${titleKey}`
              });
          }

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
  LoadPlayoutOptions = flow(function * () {
    this.activeTitle.playoutOptions = yield this.client.PlayoutOptions({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      linkPath: this.activeTitle.playoutOptionsLinkPath,
      protocols: ["hls"],
      drms: ["aes-128", "clear"]
    });
  });

  @action.bound
  SetActiveTitle({channel=false, playlistIndex, titleIndex}) {
    if(channel) {
      this.activeTitle = this.channels[titleIndex];
    } else if(playlistIndex) {
      this.activeTitle = this.playlists[playlistIndex][titleIndex];
    } else {
      this.activeTitle = this.titles[titleIndex];
    }

    this.LoadPlayoutOptions();
  }

  @action.bound
  ClearActiveTitle() {
    this.activeTitle = undefined;
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
