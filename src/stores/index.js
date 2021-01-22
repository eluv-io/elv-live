import {configure, observable, action, flow, runInAction} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
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
    this.InitializeClient();
    this.siteStore = new SiteStore(this);
  }

  @action.bound
  InitializeClient = flow(function * () {


    // Initialize ElvClient
    const ElvClient = (yield import("@eluvio/elv-client-js")).ElvClient;
    let client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});

    const staticToken = btoa(JSON.stringify(EluvioConfiguration["anon-token"]));
    client.SetStaticToken(staticToken);

    this.client = client;
  });



  @action.bound
  RedeemCode = flow(function * (code, ntpId, tenantId) {

    try {
      let codeSiteId = yield this.client.RedeemCode({code, ntpId, tenantId});
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