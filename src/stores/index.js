import {configure, observable, action, flow, runInAction} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import SiteStore from "./Site";
import { StreamChat } from "stream-chat";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const letterNumber = /^[0-9a-zA-Z]+$/;

class RootStore {
  @observable client;

  @observable email;
  @observable name;
  @observable chatID;
  @observable chatClient;
  @observable accessCode;
  @observable chargeID;
  @observable redirectCB;

  @observable error = "";
  @observable OTPCode;

  constructor() {
    this.InitializeClient();
    this.siteStore = new SiteStore(this);
  }

  @action.bound
  InitializeClient = flow(function * () {
    this.client = undefined;

    let client;
    // Initialize ElvClient or FrameClient
    if(window.self === window.top) {
      const ElvClient = (yield import("@eluvio/elv-client-js")).ElvClient;
      client = yield ElvClient.FromConfigurationUrl({configUrl: "https://test.net955203.contentfabric.io/config"});
      // let wallet = client.GenerateWallet();
      // let signer = wallet.AddAccountFromMnemonic({
      //   mnemonic: wallet.GenerateMnemonic()
      // });
      const wallet = client.GenerateWallet();
      const signer = wallet.AddAccount({privateKey: "0x3e01aa41ee4bd8f2e09a31086039ab397ec2829691f748d6cfab3b70b8771632"});
      client.SetSigner({signer});
      this.client = client;
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
  RedeemCode = flow(function * (email, Token, name) {
    try {
      // Need to reinitialize client because tickets are on demo but site is on prod 
      // TODO: Have tickets and site on same config
      
      this.accessCode = yield this.client.RedeemCode({
        "tenantId": "iten3PumhoQT6LG4VTDZozu83a6qw9JS",
        "ntpId": "QOTPiWk1yVskFZB",
        "code": Token,
        "email": ""
      });

      
      if(!this.accessCode) {
        this.SetError("Invalid code");
        return false;
      }

      if (!re.test(String(email).toLowerCase())) {
        this.SetError("Invalid email");
        return false;
      }

      if (!(name.match(letterNumber))) {
        this.SetError("Invalid Chat Name");
        return false;
      }

      this.email = email;
      this.name = name;

      let chatClient = new StreamChat('xpkg6xgvwrnn');
      const token = chatClient.devToken(name);
      chatClient.setUser({ id: name, name: name,
        image: `https://getstream.io/random_svg/?name=${name}` }, token);

      this.chatClient = chatClient;

      return "rita-ora";
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error redeeming code:");
      // eslint-disable-next-line no-console
      console.error(error);

      this.SetError("Invalid code");
      return false;
    }
  });

  @action.bound
  CreateOTP = flow(function * () {
    try {
      // Need to reinitialize client because tickets are on demo but site is on prod
      // TODO: Have tickets and site on same config

      const wallet = this.client.GenerateWallet();
      const signer = wallet.AddAccount({privateKey: "28746b1d64dec6b1f1eafe05f69bd6af62c25b2b402ba4e2a18cae1f604d1130"});
      this.client.SetSigner({signer});
      
      let OTP = yield this.client.IssueNTPCode({
        "tenantId": "iten3PumhoQT6LG4VTDZozu83a6qw9JS",
        "ntpId": "QOTPiWk1yVskFZB",
        "email": ""
      });
      

      this.OTPCode = OTP.token;

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to createOTP:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  @action.bound
  CreateCharge = flow(function * (name, description, price) {
    try {
      let coinbase = require('coinbase-commerce-node');
      let coinClient = coinbase.Client;
      coinClient.init('7ca60022-a01b-4498-8c35-a2c2aef42605');

      var newCharge = new coinbase.resources.Charge({
        "name": `${name}`,
        "description": `${description}`,
        "local_price": {
          "amount": `${price}`,
          "currency": "USD"
        },
        "pricing_type": "fixed_price",
        "metadata": {
          // "customer_id": "id_1005",
          // "customer_name": "Satoshi Nakamoto"
        },
        "redirect_url": `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}success`,
        "cancel_url": `${window.location.href.substring(0, window.location.href.lastIndexOf("#") + 2)}`
      });
      let tempCharge, redirect;

      yield newCharge.save(function (error, response) {
        tempCharge = response.code;
        redirect = response.hosted_url;
      });
      this.chargeID = tempCharge;
      this.redirectCB = redirect;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to CreateCharge:");
      // eslint-disable-next-line no-console
      console.error(error);
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