import {configure, observable, action, flow, runInAction} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import SiteStore from "./Site";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const letterNumber = /^[0-9a-zA-Z]+$/;

class RootStore {
  @observable client = undefined;
  @observable ticketClient = undefined;

  @observable email;
  @observable name;
  @observable chatID;
  @observable accessCode;
  @observable chargeID;
  @observable redirectCB;

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
      client = yield ElvClient.FromConfigurationUrl({configUrl: "https://demov3.net955210.contentfabric.io/config"}); 

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
  RedeemCode = flow(function * (email, Token) {
    try {
      this.accessCode = yield this.client.RedeemCode({
        code: Token,
        email: email,
        ntpId: "QOTPZsAzK5pU7xe",
        tenantId: "iten3tNEk7iSesexWeD1mGEZLwqHGMjB"
      });

      if(!this.accessCode) {
        this.SetError("Invalid code");
      }
     
      return this.accessCode;

    } catch (error) {
      console.error("Error redeeming code:", error);
      this.SetError("Invalid code");
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

  @action.bound
  UpdateRoute(path) {
    if(!this.client || !this.client.SendMessage) {
      return;
    }

    this.client.SendMessage({
      options: {
        operation: "SetFramePath",
        path: `/#/${path}`.replace("//", "/")
      },
      noResponse: true
    });
  }
}

const root = new RootStore();

export const rootStore = root;
export const siteStore = root.siteStore;