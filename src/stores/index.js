import {configure, observable, action, flow, runInAction} from "mobx";
import {ElvClient} from "@eluvio/elv-client-js";
import SiteStore from "./Site";
import {EluvioConfiguration} from "EluvioConfiguration";


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
  RedeemCode = flow(function * (code, ntpId, tenantId) {
    try {
      // TODO: Remove
      let client = yield ElvClient.FromConfigurationUrl({configUrl: "https://demov3.net955210.contentfabric.io/config"});
      let codeSiteId = yield client.RedeemCode({code, ntpId, tenantId});
      this.streamAccess = true;
      return codeSiteId;
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
