import {configure, flow, makeAutoObservable, runInAction} from "mobx";
import UIStore from "./UI";
import EluvioConfiguration from "EluvioConfiguration";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,

  // May help debugging
  //disableErrorBoundaries: true
});

class MainStore {
  client;
  walletClient;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true, autoAction: true });

    runInAction(() => this.InitializeClient());

    window.mainStore = this;

    this.uiStore = new UIStore();
  }

  InitializeClient = flow(function * () {
    // Lazy import client
    const ElvWalletClient = (yield import("@eluvio/elv-client-js")).ElvWalletClient;
    this.walletClient = yield ElvWalletClient.Initialize({
      appId: "eluvio-live",
      network: EluvioConfiguration.network,
      mode: EluvioConfiguration.mode
    });

    this.client = this.walletClient.client;
  });
}

const store = new MainStore();

export const mainStore = store;
export const uiStore = store.uiStore;
