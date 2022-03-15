import {configure, observable, action, flow, runInAction, toJS} from "mobx";
import {ElvClient} from "@eluvio/elv-client-js";
import { ElvWalletClient } from "@eluvio/elv-wallet-client";
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
  @observable app = "main";

  @observable pageWidth = window.innerWidth;

  @observable baseKey = 1;
  @observable walletKey = 1;
  @observable client;
  @observable redeemedTicket;
  @observable error = "";

  @observable basePublicUrl;

  @observable loggedOut = false;
  @observable loggingIn = false;

  @observable walletClient;
  @observable walletTarget;
  @observable walletLoaded = false;
  @observable walletLoggedIn = false;
  @observable walletVisibility = "hidden";

  @observable currentWalletRoute = "";
  @observable currentWalletState = {
    visibility: "hidden",
    location: {
      page: "wallet"
    },
    requireLogin: true
  };
  @observable defaultWalletState = {
    visibility: "hidden",
    requireLogin: true
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
  SetApp(app="main") {
    this.app = app;
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
  InitializeWalletClient = flow(function * ({target, tenantSlug, marketplaceSlug, darkMode=false}) {
    if(!target) { return; }

    this.walletTarget = target;

    this.DestroyWalletClient();

    let walletAppUrl = "https://wallet.contentfabric.io";
    if(window.location.hostname.startsWith("192.")) {
      walletAppUrl = `https://${window.location.hostname}:8090`;
    } else if(window.location.hostname.startsWith("live-stg")) {
      walletAppUrl = EluvioConfiguration["config-url"].includes("main.net955305") ?
        "https://core.test.contentfabric.io/wallet" :
        "https://core.test.contentfabric.io/wallet-demo";
    } else {
      // Prod
      walletAppUrl = EluvioConfiguration["config-url"].includes("main.net955305") ?
        "https://wallet.contentfabric.io" :
        "https://wallet.demov3.contentfabric.io";
    }

    this.walletClient = yield ElvWalletClient.InitializeFrame({
      walletAppUrl,
      target,
      tenantSlug,
      marketplaceSlug,
      darkMode
    });

    this.currentWalletRoute = yield this.walletClient.CurrentPath();

    if(!sessionStorage.getItem("wallet-logged-in") && this.AuthInfo()) {
      const { authToken, address, user } = this.AuthInfo();
      this.walletClient.SignIn({
        name: (user || {}).name,
        email: (user || {}).email,
        address,
        authToken
      });
    }

    const visibilityParam =
      new URLSearchParams(decodeURIComponent(window.location.search)).has("w") && "full";
    const initialVisibility = sessionStorage.getItem("wallet-visibility") || visibilityParam;
    if(initialVisibility) {
      this.SetWalletPanelVisibility({visibility: initialVisibility});
    }

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.ROUTE_CHANGE, event =>
      runInAction(() => this.currentWalletRoute = event.data)
    );

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_IN, () => {
      sessionStorage.setItem("wallet-logged-in", "true");

      if(marketplaceSlug) {
        this.walletClient.SetMarketplace({tenantSlug, marketplaceSlug});
      }

      runInAction(() => this.walletLoggedIn = true);
    });

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOG_OUT, () => {
      sessionStorage.removeItem("wallet-logged-in");

      runInAction(() => {
        this.currentWalletState.visibility = "hidden";
        this.walletLoggedIn = false;
        this.loggedOut = true;

        this.ClearAuthInfo();
      });
    });

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.LOADED, () =>
      runInAction(() => this.walletLoaded = true)
    );

    this.walletClient.AddEventListener(ElvWalletClient.EVENTS.CLOSE, async () => {
      await this.InitializeWalletClient({target, tenantSlug, marketplaceSlug});

      this.SetWalletPanelVisibility(this.defaultWalletState);
    });
  });

  @action.bound
  DestroyWalletClient() {
    if(this.walletClient) {
      this.walletClient.Destroy();
      this.walletClient = undefined;
    }
  }

  @action.bound
  ReloadWallet() {
    this.DestroyWalletClient();
    this.walletKey += 1;
  }

  SetMarketplaceFilters({filters}) {
    this.walletClient && this.walletClient.SetMarketplaceFilters({filters: toJS(filters)});
  }

  // Set default state for wallet
  @action.bound
  SetDefaultWalletState({visibility, location, video, requireLogin=true}) {
    this.defaultWalletState = {
      visibility,
      location,
      video,
      requireLogin
    };
  }

  @action.bound
  ResetDefaultWalletState() {
    this.defaultWalletState = {
      visibility: "hidden",
      requireLogin: false
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
  SetWalletPanelVisibility = flow(function * ({visibility, location, video, hideNavigation=false, requireLogin=true}) {
    const walletPanel = document.getElementById("wallet-panel");

    const visibilities = ["hidden", "side-panel", "modal", "full"];

    if(!walletPanel || !visibilities.includes(visibility)) {
      return;
    }

    while(!this.walletClient) {
      yield new Promise(r => setTimeout(r, 100));
    }

    if(location) {
      const currentPath = (yield this.walletClient.CurrentPath()) || "";

      if(location.generalLocation) {
        if(
          !(
            // If we generally want to navigate to the wallet or marketplace, check if we're already in it. If not, navigate to it
            location.page === "wallet" && currentPath.startsWith("/wallet") ||
            location.page === "marketplace" && currentPath.startsWith("/marketplace")
          // If we're in a drop event, always navigate
          ) || currentPath.includes("/events/")
        ) {
          yield this.walletClient.Navigate(toJS(location));
        }
      } else {
        yield this.walletClient.Navigate(toJS(location));
      }
    }

    this.walletClient.ToggleSidePanelMode(["modal", "side-panel"].includes(visibility));

    this.walletClient.ToggleNavigation(!hideNavigation);

    if(visibility === "full") {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

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

    if(visibility !== "hidden") {
      this.walletClient.SetActive(true);
    }

    this.currentWalletState = {
      visibility,
      location,
      route: yield this.walletClient.CurrentPath(),
      video,
      requireLogin
    };

    if(visibility === "full") {
      sessionStorage.setItem("wallet-visibility", "full");
    } else {
      sessionStorage.removeItem("wallet-visibility");
    }

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
  });

  // NOTE: Logging in via OAuth does NOT replace the client used in live, it only passes auth to the wallet frame
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

      if(idToken) {
        authInfo.idToken = idToken;
      }

      localStorage.setItem(
        "auth",
        this.client.utils.B64(JSON.stringify(authInfo))
      );

      if(!privateKey) {
        localStorage.setItem("hasLoggedIn", "true");
      }

      if(this.walletClient) {
        this.walletClient.SignIn({
          name: (user || {}).name,
          email: (user || {}).email,
          address: client.signer.address,
          idToken,
          authToken,
          privateKey
        });

        yield new Promise(resolve => setTimeout(resolve, 2000));
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
        } else if(!user) {
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
