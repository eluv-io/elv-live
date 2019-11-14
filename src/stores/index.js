import {configure, observable, action, flow} from "mobx";

import {FrameClient} from "elv-client-js/src/FrameClient";

import SiteStore from "./Site";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

class RootStore {
  @observable client;
  @observable balance = 0;
  @observable availableProtocols = ["hls"];
  @observable availableDRMs = ["aes-128"];

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
      const ElvClient = (yield import(
        /* webpackChunkName: "elv-client-js" */
        /* webpackMode: "lazy" */
        "elv-client-js"
      )).ElvClient;

      client = yield ElvClient.FromConfigurationUrl({
        configUrl: EluvioConfiguration["config-url"]
      });

      const wallet = client.GenerateWallet();
      const mnemonic = wallet.GenerateMnemonic();
      const signer = wallet.AddAccountFromMnemonic({mnemonic});

      client.SetSigner({signer});

      client.ToggleLogging(true);
    } else {
      // Contained in IFrame
      client = new FrameClient({
        target: window.parent,
        timeout: 30
      });
    }

    this.availableDRMs = yield client.AvailableDRMs();

    const balance = parseFloat(
      yield client.GetBalance({
        address: yield client.CurrentAccountAddress()
      })
    );

    let availableProtocols = ["hls"];
    if(this.availableDRMs.includes("widevine")) {
      availableProtocols.push("dash");
    }

    this.client = client;
    this.availableProtocols = availableProtocols;
    this.balance = balance;
  })
}

const rootStore = new RootStore();

export const root = rootStore;
export const siteStore = rootStore.siteStore;
