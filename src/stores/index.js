import {configure, observable, action, flow, runInAction, toJS} from "mobx";
import { ElvWalletClient } from "@eluvio/elv-client-js/src/walletClient";
import { ElvWalletFrameClient } from "@eluvio/elv-wallet-frame-client";
import UrlJoin from "url-join";
import SiteStore from "Stores/Site";
import CartStore from "Stores/Cart";
import MainStore from "Stores/Main";
import CollectionStore from "Stores/Collection";

import EluvioConfiguration from "EluvioConfiguration";
import {ElvClient} from "@eluvio/elv-client-js";
import {ToggleZendesk} from "Utils/Misc";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

let walletAppUrl;
if(window.location.hostname.startsWith("192.") || window.location.hostname.startsWith("elv-test.io")) {
  walletAppUrl = `https://${window.location.hostname}:8090`;
} else if(window.location.hostname.startsWith("live-stg")) {
  walletAppUrl = EluvioConfiguration.network === "main" ?
    //"https://core.test.contentfabric.io/wallet" :
    "https://wallet.preview.contentfabric.io" :
    "https://core.test.contentfabric.io/wallet-demo";
} else {
  // Prod
  walletAppUrl = EluvioConfiguration.network === "main" ?
    "https://wallet.contentfabric.io" :
    "https://wallet.demov3.contentfabric.io";
}

class RootStore {
  @observable app = "main";

  @observable pageWidth = window.innerWidth;

  @observable baseKey = 1;
  @observable walletKey = 1;
  @observable client;
  @observable redeemedTicket;
  @observable error = "";

  @observable basePublicUrl;

  @observable walletClient;
  @observable frameClient;

  @observable walletTarget;
  @observable walletLoaded = false;
  @observable walletLoggedIn = false;
  @observable walletVisibility = "hidden";

  @observable currentWalletState = {
    route: "",
    visibility: "hidden",
    location: {
      page: "wallet"
    }
  };

  @observable defaultWalletState = {
    visibility: "hidden"
  };

  @observable savedTickets = {};

  @observable marketplaceParams;

  constructor() {
    this.siteStore = new SiteStore(this);
    this.cartStore = new CartStore(this);
    this.mainStore = new MainStore(this);
    this.collectionStore = new CollectionStore(this);

    this.LoadRedeemedTickets();

    window.rootStore = this;

    window.addEventListener("resize", () => this.HandleResize());
  }

  Log(message="", error=false) {
    // eslint-disable-next-line no-console
    const logMethod = error === "warn" ? console.warn : error ? console.error : console.log;

    if(typeof message === "string") {
      message = `Eluvio Live | ${message}`;
    }

    logMethod(message);
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

    this.walletClient = yield ElvWalletClient.Initialize({
      appId: "eluvio-live",
      network: EluvioConfiguration.network,
      mode: EluvioConfiguration.mode
    });

    this.walletClient.appUrl = walletAppUrl;

    this.mainSiteId = this.walletClient.mainSiteId;

    if(this.walletClient.ClientAuthToken()) {
      this.walletLoggedIn = true;
    }

    this.basePublicUrl = yield this.walletClient.client.FabricUrl({
      queryParams: {
        authorization: this.staticToken
      },
      noAuth: true
    });

    this.client = this.walletClient.client;
  });

  @action.bound
  RedeemOffer = flow(function * ({tenantId, ntpId, code}) {
    return yield this.client.RedeemCode({
      tenantId,
      ntpId,
      code,
      includeNTPId: true
    });
  });

  @action.bound
  RedeemCode = flow(function * (code) {
    try {
      const client = yield ElvClient.FromNetworkName({
        networkName: EluvioConfiguration.network
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

  CheckFrameAddress = flow(function * (logIn=false) {
    const frameAddress = (yield this.frameClient.UserProfile())?.address;

    if(frameAddress && !this.client.utils.EqualAddress(frameAddress, this.walletClient.UserAddress())) {
      // eslint-disable-next-line no-console
      console.error("Frame logged in with wrong account");

      this.frameClient.LogOut();
    } else if(!frameAddress && logIn && this.walletClient.ClientAuthToken()) {
      this.frameClient.LogIn({clientAuthToken: this.walletClient.ClientAuthToken()});
    }
  });

  /* Wallet */
  InitializeFrameClient = flow(function * ({target, tenantSlug, marketplaceSlug, darkMode=false}) {
    if(!target) { return; }

    this.walletTarget = target;

    this.DestroyFrameClient();

    if(marketplaceSlug) {
      walletAppUrl = new URL(walletAppUrl);
      walletAppUrl.searchParams.set("hgm", "");
      walletAppUrl = walletAppUrl.toString();
    }

    this.frameClient = yield ElvWalletFrameClient.InitializeFrame({
      walletAppUrl,
      target,
      tenantSlug,
      marketplaceSlug,
      captureLogin: true,
      darkMode
    });

    if(marketplaceSlug) {
      this.marketplaceParams = {
        tenantSlug,
        marketplaceSlug
      };
    }

    this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_IN_REQUESTED, () =>
      runInAction(() => this.LogIn())
    );

    this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.ROUTE_CHANGE, event => {
      runInAction(() => this.currentWalletState.route = event.data);

      if(this.walletLoaded) {
        sessionStorage.setItem("wallet-route", event.data);
      }
    });

    this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_IN, () => this.CheckFrameAddress());

    this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_OUT, () => {
      this.walletClient.LogOut();

      sessionStorage.removeItem("wallet-route");

      runInAction(() => {
        this.SetWalletPanelVisibility({visibility: "hidden"});
        this.walletLoggedIn = false;
      });
    });

    this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOADED, async () => {
      this.CheckFrameAddress(true);

      // Saved wallet visibility + path
      const visibilityParam =
        (new URLSearchParams(decodeURIComponent(window.location.search)).has("w") && "full") ||
        "hidden";

      let initialVisibility = { visibility: visibilityParam };
      if(sessionStorage.getItem("wallet-visibility")) {
        try {
          initialVisibility = JSON.parse(sessionStorage.getItem("wallet-visibility"));
          // eslint-disable-next-line no-empty
        } catch(error) {}
      }

      initialVisibility.route = initialVisibility.route = sessionStorage.getItem("wallet-route") || "";
      this.SetWalletPanelVisibility(initialVisibility);

      setTimeout(() => {
        runInAction(() => this.walletLoaded = true);
      }, 500);
    });

    this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.CLOSE, async () => {
      setTimeout(async () => {
        await this.InitializeFrameClient({target, tenantSlug, marketplaceSlug});

        this.SetWalletPanelVisibility(this.defaultWalletState);
      }, 2000);
    });

    this.currentWalletState.route = yield this.frameClient.CurrentPath();

    // Fallback in case load event is not received
    setTimeout(() => runInAction(() => this.walletLoaded = true), 10000);
  });

  @action.bound
  DestroyFrameClient() {
    if(this.frameClient) {
      this.frameClient.Destroy();
      this.frameClient = undefined;
    }
  }

  @action.bound
  ReloadWallet() {
    this.DestroyFrameClient();
    this.walletKey += 1;
  }

  SetMarketplaceFilters({filters}) {
    this.frameClient && this.frameClient.SetMarketplaceFilters({filters: toJS(filters)});
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
      visibility: "hidden"
    };
  }

  @action.bound
  CloseWalletModal() {
    // Note: Clicking inside the wallet frame does not trigger a click event, so any triggered click will be outside the wallet
    this.SetWalletPanelVisibility(this.defaultWalletState);

    const walletPanel = document.getElementById("wallet-panel");

    walletPanel.removeEventListener("click", this.CloseWalletModal);
    this.frameClient.RemoveEventListener(ElvWalletFrameClient.EVENTS.LOG_IN, this.CloseWalletModal);
  }

  @action.bound
  SetWalletPanelVisibility = flow(function * ({visibility, location, route, video, hideNavigation=false}) {
    try {
      if(this.siteStore.marketplaceOnly) {
        visibility = "exclusive";
      }

      const walletPanel = document.getElementById("wallet-panel");

      const visibilities = ["hidden", "side-panel", "modal", "full", "exclusive"];

      if(!walletPanel || !visibilities.includes(visibility)) {
        return;
      }

      if(this.frameClient) {
        if(route) {
          yield this.frameClient.Navigate({path: route});
        } else if(location) {
          const currentPath = (yield this.frameClient.CurrentPath()) || "";

          if(location.generalLocation) {
            if(
              !(
                // If we generally want to navigate to the wallet or marketplace, check if we're already in it. If not, navigate to it
                location.page === "wallet" && currentPath.startsWith("/wallet") ||
                location.page === "marketplace" && currentPath.startsWith("/marketplace/")
                // If we're in a drop event, always navigate
              ) || currentPath.includes("/events/")
            ) {
              yield this.frameClient.Navigate(toJS(location));
            }
          } else {
            yield this.frameClient.Navigate(toJS(location));
          }
        }

        this.frameClient.ToggleSidePanelMode(["modal", "side-panel"].includes(visibility));

        this.frameClient.ToggleNavigation(!hideNavigation);

        if(visibility === "modal") {
          this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_IN, this.CloseWalletModal);
          const Close = () => {
            // Note: Clicking inside the wallet frame does not trigger a click event, so any triggered click will be outside the wallet
            this.SetWalletPanelVisibility(this.defaultWalletState);

            walletPanel.removeEventListener("click", Close);
            this.frameClient.RemoveEventListener(ElvWalletFrameClient.EVENTS.LOG_IN, Close);
          };

          walletPanel.addEventListener("click", Close);
          this.frameClient.AddEventListener(ElvWalletFrameClient.EVENTS.LOG_IN, Close);
        }

        this.currentWalletState = {
          visibility,
          location,
          route: yield this.frameClient.CurrentPath(),
          video
        };
      } else {
        this.currentWalletState.visibility = visibility;
      }

      if(["full", "exclusive"].includes(visibility)) {
        document.body.style.overflowY = "hidden";
        ToggleZendesk(false);
      } else {
        document.body.style.overflowY = "";
        ToggleZendesk(true);
      }

      if(visibility === "full") {
        sessionStorage.setItem("wallet-visibility", JSON.stringify({visibility, location}));
      } else {
        sessionStorage.removeItem("wallet-visibility");
      }

      // Pause video if video is present and moving into full wallet view
      if(visibility === "full" && this.defaultWalletState.video && this.defaultWalletState.video.element) {
        this.defaultWalletState = {
          ...this.defaultWalletState,
          video: {
            ...this.defaultWalletState.video,
            playing: !this.defaultWalletState.video.element.paused
          }
        };

        this.defaultWalletState.video.element.pause();
      } else if(video && video.playing) {
        video.element.play();
      }
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to adjust wallet client visibility:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  SignMetamask = flow(function * (message) {
    yield window.ethereum.request({method: "eth_requestAccounts"});
    const from = window.ethereum.selectedAddress;
    return yield window.ethereum.request({
      method: "personal_sign",
      params: [message, from, ""],
    });
  });

  @action.bound
  LogIn() {
    this.walletClient.LogIn({
      method: "redirect",
      callbackUrl: window.location.href,
      marketplaceParams: this.marketplaceParams,
      clearLogin: true
    });
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
