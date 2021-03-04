import {configure, observable, action, flow, runInAction} from "mobx";
import {ElvClient} from "@eluvio/elv-client-js";
import SiteStore from "Stores/Site";
import CartStore from "Stores/Cart";
import MainStore from "Stores/Main";

import EluvioConfiguration from "EluvioConfiguration";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

class RootStore {
  @observable client;
  @observable streamAccess = false;
  @observable error = "";

  constructor() {
    this.siteStore = new SiteStore(this);
    this.cartStore = new CartStore(this);
    this.mainStore = new MainStore(this);

    window.rootStore = this;
  }

  @action.bound
  InitializeClient = flow(function * () {
    let client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});

    const staticToken = btoa(JSON.stringify({qspace_id: client.contentSpaceId}));
    client.SetStaticToken({token: staticToken});

    this.client = client;
  });

  @action.bound
  RedeemCode = flow(function * (code) {
    try {
      const client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});

      const siteId = yield client.RedeemCode({
        tenantId: this.siteStore.currentSiteInfo.tenant_id,
        code
      });

      if(client.utils.EqualHash(siteId, this.siteStore.siteId)) {
        throw Error(`Code redemption does not match current site: Received ${siteId} | Expected ${this.siteStore.siteId}`);
      }

      this.client = client;
      this.streamAccess = true;

      this.siteStore.ActivateCode(code);

      return siteId;
    } catch (error) {
       console.log("Error redeeming code: ", error);
    }
  });

  @action.bound
  SetError(error) {
    this.error = error;

    clearTimeout(this.errorTimeout);

    this.errorTimeout = setTimeout(() => {
      runInAction(() => this.SetError(""));
    }, 8000);
  }
}

const root = new RootStore();

export const rootStore = root;
export const siteStore = root.siteStore;
export const cartStore = root.cartStore;
export const mainStore = root.mainStore;
