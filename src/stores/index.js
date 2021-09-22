import {configure, observable, action, flow, runInAction, toJS} from "mobx";
import {ElvClient} from "@eluvio/elv-client-js";
import { ElvWalletClient } from "@eluvio/elv-wallet-client/src/index";
import UrlJoin from "url-join";
import SiteStore from "Stores/Site";
import CartStore from "Stores/Cart";
import MainStore from "Stores/Main";
import CollectionStore from "Stores/Collection";

import EluvioConfiguration from "EluvioConfiguration";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

class RootStore {
  @observable pageWidth = window.innerWidth;

  @observable baseKey = 1;
  @observable client;
  @observable walletClient;
  @observable redeemedTicket;
  @observable error = "";

  @observable walletLoggedIn = false;
  @observable walletVisibility = "hidden";
  @observable currentWalletState = {
    visibility: "hidden",
    location: {
      page: "wallet"
    }
  };
  @observable defaultWalletState = {
    visibility: "hidden",
    location: {
      page: "wallet"
    }
  };

  @observable savedTickets = {};

  constructor() {
    this.siteStore = new SiteStore(this);
    this.cartStore = new CartStore(this);
    this.mainStore = new MainStore(this);
    this.collectionStore = new CollectionStore(this);

    this.LoadRedeemedTickets();

    window.rootStore = this;

    window.addEventListener("resize", () => this.HandleResize());
  }

  @action.bound
  LoadRedeemedTickets() {
    let savedTickets = localStorage.getItem("redeemed-tickets");
    if(savedTickets) {
      try {
        this.savedTickets = JSON.parse(atob(savedTickets));
      } catch(error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load redeemed tickets from localstorage:");
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  SaveRedeemedTickets() {
    try {
      localStorage.setItem(
        "redeemed-tickets",
        btoa(JSON.stringify(toJS(this.savedTickets)))
      );
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save redeemed tickets to localstorage:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  @action.bound
  InitializeClient = flow(function * () {
    if(this.client) { return; }

    this.client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});
  });

  @action.bound
  RedeemCode = flow(function * (code) {
    try {
      const client = yield ElvClient.FromConfigurationUrl({
        configUrl: EluvioConfiguration["config-url"]
      });

      const { objectId, ntpId } = yield client.RedeemCode({
        tenantId: this.siteStore.currentSiteInfo.tenant_id,
        code,
        includeNTPId: true
      });

      this.client = client;
      this.redeemedTicket = code;

      this.savedTickets[this.siteStore.siteSlug] = {
        code,
        ntpId,
        redeemedAt: Date.now()
      };

      this.SaveRedeemedTickets();

      return objectId;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Error redeeming code: ", error);
    }
  });

  @action.bound
  RedeemCouponCode = flow(function * (code, email, receiveEmails) {
    try {
      const objectId = yield this.RedeemCode(code);

      if(!objectId) { throw Error("Invalid code"); }

      const hash = yield this.client.LatestVersionHash({
        versionHash: "hq__67sMXymkhNwVraEEx3gmBDzNhLUjcaZncbrJH8zd3im7vq65pSrJA3pVjZm5YNdy2MrtP9Qnbc"
      });

      const url = new URL("https://host-154-14-185-104.contentfabric.io");
      url.pathname = UrlJoin("q", hash, "rep", "redeemer");
      url.searchParams.set("authorization", this.client.staticToken);

      const { confirmation_id } = yield (yield fetch(
        url.toString(),
        {
          method: "POST",
          body: JSON.stringify({
            "CODE": code,
            "EML": email,
            "CONSENT": receiveEmails
          })
        }
      )).json();

      this.savedTickets[this.siteStore.siteSlug].couponConfirmationId = confirmation_id;
      this.SaveRedeemedTickets();

      return objectId;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  /* Wallet */
  InitializeWalletClient = flow(function * ({target, marketplaceId, darkMode=false}) {
    if(!target) { return; }

    this.DestroyWalletClient();

    this.walletLoggedIn = false;

    this.walletClient = yield ElvWalletClient.InitializeFrame({
      walletAppUrl: "https://core.test.contentfabric.io/elv-media-wallet/?d",
      //walletAppUrl: "https://192.168.0.17:8090",
      target,
      marketplaceId,
      darkMode
    });

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_IN, () =>
      runInAction(() => this.walletLoggedIn = true)
    );

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_OUT, () =>
      runInAction(() => this.walletLoggedIn = false)
    );

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.CLOSE, () => {
      this.InitializeWalletClient({target, marketplaceId, darkMode});
    });
  });

  @action.bound
  DestroyWalletClient() {
    if(this.walletClient) {
      this.walletClient.Destroy();
      this.walletClient = undefined;
    }
  }

  // Set default state for wallet
  @action.bound
  SetDefaultWalletState({visibility, location, video}) {
    this.defaultWalletState = {
      visibility,
      location,
      video
    };
  }

  @action.bound
  ResetDefaultWalletState() {
    this.defaultWalletState = {
      visibility: "hidden",
      location: {
        page: "wallet"
      }
    };
  }

  @action.bound
  SetWalletPanelVisibility({visibility, location, video}) {
    const walletPanel = document.getElementById("wallet-panel");

    const visibilities = ["hidden", "side-panel", "modal", "full"];

    if(!walletPanel || !visibilities.includes(visibility)) {
      return;
    }

    this.walletClient.ToggleSidePanelMode(visibility === "side-panel");

    visibilities.forEach(v =>
      walletPanel.classList.remove(`wallet-panel-${v}`)
    );

    walletPanel.classList.add(`wallet-panel-${visibility}`);

    if(visibility === "modal") {
      const Close = () => {
        // Note: Clicking inside the wallet frame does not trigger a click event, so any triggered click will be outside the wallet
        this.SetWalletPanelVisibility(this.defaultWalletState);

        walletPanel.removeEventListener("click", Close);
        this.walletClient.RemoveEventListener(ElvWalletClient.EVENTS.LOG_IN, Close);
      };

      walletPanel.addEventListener("click", Close);

      this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_IN, Close);
    }

    if(location) {
      this.walletClient.Navigate(toJS(location));
    }

    // Mute video if video is present and moving into full wallet view
    if(visibility === "full" && this.defaultWalletState.video) {
      this.defaultWalletState = {
        ...this.defaultWalletState,
        video: {
          ...this.defaultWalletState.video,
          muted: this.defaultWalletState.video.element.muted
        }
      };

      this.defaultWalletState.video.element.muted = true;
    } else if(video && !video.muted) {
      video.element.muted = false;
    }

    this.currentWalletState = {
      visibility,
      location,
      video
    };
  }

  @action.bound
  SetError(error) {
    this.error = error;

    clearTimeout(this.errorTimeout);

    this.errorTimeout = setTimeout(() => {
      runInAction(() => this.SetError(""));
    }, 8000);
  }

  // Force reload of App.js (e.g. to switch main site to event site
  @action.bound
  UpdateBaseKey() {
    this.baseKey += 1;
  }

  @action.bound
  HandleResize() {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      if(this.pageWidth !== window.innerWidth) {
        runInAction(() => this.pageWidth = window.innerWidth);
      }
    }, 50);
  }
}

const root = new RootStore();

export const rootStore = root;
export const siteStore = root.siteStore;
export const cartStore = root.cartStore;
export const mainStore = root.mainStore;
export const collectionStore = root.collectionStore;
