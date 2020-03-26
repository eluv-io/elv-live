import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class SiteStore {
  @observable siteLibraryId;

  @observable siteInfo;
  @observable titles = [];
  @observable channels = [];
  @observable playlists = [];
  @observable dashSupported = false;
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
      const availableDRMS = yield this.client.AvailableDRMs();
      this.dashSupported = availableDRMS.includes("widevine");

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
    // Playlists: {[slug]: { order, name, list: {[title-slug]: { ... }}}

    let playlists = [];
    yield Promise.all(
      Object.keys(playlistInfo).map(async playlistSlug => {
        try {
          const {name, order, list} = playlistInfo[playlistSlug];

          let titles = [];
          await Promise.all(
            Object.keys(list).map(async titleSlug => {
              try {
                let title = list[titleSlug];

                const titleLinkPath = `public/asset_metadata/playlists/${playlistSlug}/list/${titleSlug}`;
                title.baseLinkUrl =
                  await this.client.LinkUrl({
                    libraryId: this.siteLibraryId,
                    objectId: this.siteId,
                    linkPath: titleLinkPath
                  });

                title.playoutOptionsLinkPath = UrlJoin(titleLinkPath, "sources", "default");

                title.playlistIndex = order;
                title.titleIndex = title.order;

                titles[parseInt(title.order)] = title;
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Failed to load title ${titleSlug} in playlist ${order} (${name})`);
                // eslint-disable-next-line no-console
                console.error(error);
              }
            })
          );

          playlists[parseInt(order)] = {
            playlistIndex: order,
            name,
            titles: titles.filter(title => title)
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load playlist ${playlistSlug}`);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );

    return playlists.filter(playlist => playlist);
  });

  @action.bound
  SetActiveTitle = flow(function * ({channel=false, playlistIndex, titleIndex}) {
    let activeTitle;
    if(channel) {
      activeTitle = this.channels[titleIndex];
    } else if(playlistIndex !== undefined) {
      activeTitle = this.playlists[playlistIndex].titles[titleIndex];
    } else {
      activeTitle = this.titles[titleIndex];
    }

    const playoutOptions = yield this.client.PlayoutOptions({
      libraryId: this.siteLibraryId,
      objectId: this.siteId,
      linkPath: activeTitle.playoutOptionsLinkPath,
      protocols: ["hls", "dash"],
      drms: ["aes-128", "widevine", "clear"]
    });

    this.activeTitle = activeTitle;
    this.activeTitle.playoutOptions = playoutOptions;
  });

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
