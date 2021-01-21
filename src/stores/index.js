import {configure, observable, action, flow, runInAction} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import SiteStore from "./Site";
import {EluvioConfiguration} from "../config";

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

    let client;
    // Initialize ElvClient or FrameClient
    if(window.self === window.top) {
      const ElvClient = (yield import("@eluvio/elv-client-js")).ElvClient;
      client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]}); 

      const wallet = client.GenerateWallet();
      const mnemonic = wallet.GenerateMnemonic();
      const signer = wallet.AddAccountFromMnemonic({mnemonic});

      client.SetSigner({signer});
    } else {
      // Contained in IFrame
      client = new FrameClient({
        target: window.parent,
        timeout: 30
      });

      // Hide header if in frame
      if(client.SendMessage) {
        client.SendMessage({options: {operation: "HideHeader"}, noResponse: true});
      }
    }

    this.client = client;
  });



  @action.bound
  RedeemCode = flow(function * (ticketCode) {
    let codeObjectID;
    try {
      codeObjectID = yield this.client.RedeemCode({
        code: ticketCode,
        ntpId: "QOTPZsAzK5pU7xe",
        tenantId: "iten3tNEk7iSesexWeD1mGEZLwqHGMjB"
      
      });


    } catch (error) {
      try {
        console.log("Error redeeming code against otpId QOTPZsAzK5pU7xe:", codeObjectID, error);

        codeObjectID = yield this.client.RedeemCode({
          code: ticketCode,
          ntpId: "QOTPDi4phXuCFSn",
          tenantId: "iten3tNEk7iSesexWeD1mGEZLwqHGMjB"
      
        });

      }
      catch (error) { 
       console.log("Error redeeming code against otpId QOTPDi4phXuCFSn:", codeObjectID, error);
       this.SetError("Invalid code");
      }

    }

    if(!codeObjectID) {
      this.SetError("Returned empty object ID");
    } else {
      this.streamAccess = true;
      return codeObjectID; 
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