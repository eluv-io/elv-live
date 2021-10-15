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
  @observable walletTarget;
  @observable redeemedTicket;
  @observable error = "";

  @observable basePublicUrl;

  @observable loggedOut = false;
  @observable loggingIn = false;
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

  PublicLink({versionHash, path, queryParams={}}) {
    if(!this.basePublicUrl) { return ""; }

    const url = new URL(this.basePublicUrl);
    url.pathname = UrlJoin("q", versionHash, "meta", path);

    Object.keys(queryParams).map(key => url.searchParams.append(key, queryParams[key]));

    return url.toString();
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

    const client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});

    this.basePublicUrl = yield client.FabricUrl({
      queryParams: {
        authorization: this.staticToken
      },
      noAuth: true
    });

    this.client = client;
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
  InitializeWalletClient = flow(function * ({target, marketplaceHash, darkMode=false}) {
    if(!target) { return; }

    this.walletTarget = target;

    this.DestroyWalletClient();

    this.walletLoggedIn = false;

    let walletAppUrl = "https://wallet.contentfabric.io";
    if(window.location.hostname.startsWith("live-stg")) {
      walletAppUrl = EluvioConfiguration["config-url"].includes("main.net955305") ?
        "https://core.test.contentfabric.io/elv-media-wallet-prod" :
        "https://core.test.contentfabric.io/elv-media-wallet";
    } else {
      // Prod
      walletAppUrl = EluvioConfiguration["config-url"].includes("main.net955305") ?
        "https://wallet.contentfabric.io" :
        "https://wallet.demov3.contentfabric.io";
    }

    //walletAppUrl = "https://192.168.0.17:8090";

    this.walletClient = yield ElvWalletClient.InitializeFrame({
      walletAppUrl,
      target,
      marketplaceHash,
      darkMode
    });

    if(this.siteStore.marketplaceHash) {
      marketplaceHash = this.siteStore.marketplaceHash;
      this.walletClient.SetMarketplace({marketplaceHash});
    }

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_IN, () => {
      runInAction(() => this.walletLoggedIn = true);
    });

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_OUT, () =>
      runInAction(() => {
        this.walletLoggedIn = false;
        this.loggedOut = true;

        this.ClearAuthInfo();
      })
    );

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.CLOSE, async () => {
      await this.InitializeWalletClient({target, marketplaceHash, darkMode});

      this.SetWalletPanelVisibility(this.defaultWalletState);
    });

    if(this.AuthInfo()) {
      this.walletClient.SetAuthInfo(this.AuthInfo());
    }
  });

  @action.bound
  DestroyWalletClient() {
    if(this.walletClient) {
      this.walletClient.Destroy();
      this.walletClient = undefined;
    }
  }

  SetMarketplaceFilters({filters}) {
    this.walletClient && this.walletClient.SetMarketplaceFilters({filters: toJS(filters)});
  }

  // Set default state for wallet
  @action.bound
  SetDefaultWalletState({visibility, location, video, darkMode}) {
    if(!darkMode){
      darkMode = this.siteStore.darkMode;
    }

    this.defaultWalletState = {
      visibility,
      location,
      video,
      darkMode
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
  CloseWalletModal() {
    // Note: Clicking inside the wallet frame does not trigger a click event, so any triggered click will be outside the wallet
    this.SetWalletPanelVisibility(this.defaultWalletState);

    const walletPanel = document.getElementById("wallet-panel");

    walletPanel.removeEventListener("click", this.CloseWalletModal);
    this.walletClient.RemoveEventListener(ElvWalletClient.EVENTS.LOG_IN, this.CloseWalletModal);
  }

  @action.bound
  SetWalletPanelVisibility({visibility, location, video, darkMode, hideNavigation=false}) {
    const walletPanel = document.getElementById("wallet-panel");

    const visibilities = ["hidden", "side-panel", "modal", "full"];

    if(!walletPanel || !visibilities.includes(visibility)) {
      return;
    }

    darkMode = typeof darkMode === "undefined" ? this.siteStore.darkMode : darkMode;

    this.walletClient.ToggleSidePanelMode(["modal", "side-panel"].includes(visibility));

    this.walletClient.ToggleNavigation(!hideNavigation);

    if(visibility === "modal") {
      this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_IN, this.CloseWalletModal);
      const Close = () => {
        // Note: Clicking inside the wallet frame does not trigger a click event, so any triggered click will be outside the wallet
        this.SetWalletPanelVisibility(this.defaultWalletState);

        walletPanel.removeEventListener("click", Close);
        this.walletClient.RemoveEventListener(ElvWalletClient.EVENTS.LOG_IN, Close);
      };

      walletPanel.addEventListener("click", Close);
      this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_IN, Close);
    }

    this.walletClient.ToggleDarkMode(darkMode);

    if(location) {
      this.walletClient.Navigate(toJS(location));
    }

    if(visibility !== "hidden") {
      this.walletClient.SetActive(true);
    }

    this.currentWalletState = {
      visibility,
      location,
      video
    };

    /*
    // Mute video if video is present and moving into full wallet view
    if(visibility === "full" && this.defaultWalletState.video && this.defaultWalletState.video.element) {
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

     */
  }

  @action.bound
  SetAuthInfo = flow(function * ({idToken, authToken, privateKey, user, tenantId, loginData={}}) {
    try {
      this.loggingIn = true;
      const client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});

      if(privateKey) {
        const wallet = client.GenerateWallet();
        const signer = wallet.AddAccount({privateKey});
        client.SetSigner({signer});
      } else {
        yield client.SetRemoteSigner({idToken, authToken, tenantId, extraData: loginData});
      }

      let authInfo = {
        address: client.signer.address,
        user: {
          name: (user || {}).name,
          email: (user || {}).email
        }
      };

      if(privateKey) {
        authInfo.privateKey = privateKey;
      } else {
        authInfo.authToken = client.signer.authToken;
      }

      localStorage.setItem(
        "auth",
        this.client.utils.B64(JSON.stringify(authInfo))
      );

      if(!privateKey) {
        localStorage.setItem("hasLoggedIn", "true");
      }

      if(this.walletClient) {
        this.walletClient.SetAuthInfo(authInfo);
      }
    } catch(error){
      // eslint-disable-next-line no-console
      console.error("Error logging in:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.loggingIn = false;
    }
  });

  ClearAuthInfo() {
    localStorage.removeItem("auth");
  }

  AuthInfo() {
    try {
      const tokenInfo = localStorage.getItem("auth");

      if(tokenInfo) {
        const { authToken, address, user } = JSON.parse(this.client.utils.FromB64(tokenInfo));
        const expiration = JSON.parse(atob(authToken)).exp;
        if(expiration - Date.now() < 4 * 3600 * 1000) {
          this.ClearAuthInfo();
        } else {
          return { authToken, address, user };
        }
      }
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to retrieve auth info");
      // eslint-disable-next-line no-console
      console.error(error);
    }
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
