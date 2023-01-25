import {configure, flow, makeAutoObservable, runInAction} from "mobx";
import UIStore from "./UI";
import EluvioConfiguration from "EluvioConfiguration";
import UrlJoin from "url-join";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,

  // May help debugging
  //disableErrorBoundaries: true
});

const libraryId = "ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD";
const objectId = "iq__2APUwchUAmMAKRgWStEN7ZXtAKkV";

const staticUrl = EluvioConfiguration.network === "main" ?
  "https://main.net955305.contentfabric.io/s/main" :
  "https://demov3.net955210.contentfabric.io/s/demov3";

const staticSiteUrl = UrlJoin(staticUrl, "qlibs", libraryId, "q", objectId);

const ProduceMetadataLinks = ({path="/", metadata}) => {
  // Primitive
  if(!metadata || typeof metadata !== "object") { return metadata; }

  // Array
  if(Array.isArray(metadata)) {
    return metadata.map((entry, i) => ProduceMetadataLinks({path: UrlJoin(path, i.toString()), metadata: entry}));
  }

  // Object
  if(metadata["/"] &&
    (metadata["/"].match(/\.\/(rep|files)\/.+/) ||
      metadata["/"].match(/^\/?qfab\/([\w]+)\/?(rep|files)\/.+/)))
  {
    // Is file or rep link - produce a url
    return {
      ...metadata,
      url: UrlJoin(staticSiteUrl, "/meta", path)
    };
  }

  let result = {};
  Object.keys(metadata).forEach(key => result[key] = ProduceMetadataLinks({path: UrlJoin(path, key), metadata: metadata[key]}));

  return result;
};

class MainStore {
  client;
  walletClient;

  mainSite;
  mainSiteHash;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true, autoAction: true });

    runInAction(() => this.InitializeClient());

    window.mainStore = this;

    this.uiStore = new UIStore();
  }

  InitializeClient = flow(function * () {
    const metadata = ProduceMetadataLinks({
      path: "/public/asset_metadata",
      metadata: yield (yield fetch(UrlJoin(staticSiteUrl, "/meta/public/asset_metadata"))).json()
    });

    this.mainSite = metadata.info;
  });

  get notification() {
    const notification = this.mainSite?.notification;

    if(!notification || !notification.active) {
      // eslint-disable-next-line getter-return
      return;
    }

    // Notification seen status is set as just the length of the notification text, as it is very unlikely to be the same between distinct notifications.
    const messageLength = notification.header.length + notification.text.length;
    const seen = parseInt(localStorage.getItem("dismissed-notification")) === messageLength;

    // eslint-disable-next-line getter-return
    if(seen) { return; }

    return notification;
  }

  DismissNotification() {
    const notification = this.mainSite?.notification;

    if(!notification) { return; }

    const messageLength = notification.header.length + notification.text.length;
    localStorage.setItem("dismissed-notification", messageLength);
  }
}

const store = new MainStore();

export const mainStore = store;
export const uiStore = store.uiStore;
