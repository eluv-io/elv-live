import {configure, observable, action, flow} from "mobx";

import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";

import SiteStore from "./Site";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

class RootStore {
  @observable client;
  @observable sites = [];
  @observable availableSites = [];
  @observable siteId;

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
        "@eluvio/elv-client-js"
      )).ElvClient;

      client = yield ElvClient.FromConfigurationUrl({
        configUrl: EluvioConfiguration["config-url"]
      });

      const wallet = client.GenerateWallet();
      const mnemonic = wallet.GenerateMnemonic();
      const signer = wallet.AddAccountFromMnemonic({mnemonic});

      client.SetSigner({signer});

      // Generated user will not have any available sites - load default
      this.sites = [EluvioConfiguration["site-id"]];
      this.SetSiteId(EluvioConfiguration["site-id"]);

      //client.ToggleLogging(true);
    } else {
      // Contained in IFrame
      client = new FrameClient({
        target: window.parent,
        timeout: 30
      });

      client.SendMessage({options: {operation: "HideHeader"}, noResponse: true});

      // Find available sites
      this.sites = yield this.FindSites(client);

      if(this.sites.length === 0) {
        // No available site - load default
        this.sites = [EluvioConfiguration["site-id"]];
        this.SetSiteId(EluvioConfiguration["site-id"]);
      } else if(this.sites.length === 1) {
        // Only one site available
        this.SetSiteId(this.sites[0]);
      }
    }

    // Setting the client signals the app to start rendering
    this.client = client;
  });

  FindSites = flow(function * (client) {
    let sites = [];

    const contentSpaceLibraryId =
      client.utils.AddressToLibraryId(
        client.utils.HashToAddress(
          yield client.ContentSpaceId()
        )
      );

    const groupAddresses = yield client.Collection({collectionType: "accessGroups"});
    yield Promise.all(
      groupAddresses.map(async groupAddress => {
        try {
          const groupSites = await client.ContentObjectMetadata({
            libraryId: contentSpaceLibraryId,
            objectId: client.utils.AddressToObjectId(groupAddress),
            metadataSubtree: "sites"
          });

          if(!groupSites || !groupSites.length) { return; }

          groupSites.forEach(siteId => sites.push(siteId));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to retrieve group metadata for ", groupAddress);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );

    return sites.filter((value, index, list) => list.indexOf(value) === index);
  });

  LoadAvailableSites = flow(function * () {
    this.availableSites = yield Promise.all(
      this.sites.map(async siteId => {
        const libraryId = await this.client.ContentObjectLibraryId({objectId: siteId});

        const siteName = await this.client.ContentObjectMetadata({
          libraryId,
          objectId: siteId,
          metadataSubtree: "public/name"
        });

        return {
          name: siteName,
          siteId
        };
      })
    );
  });

  @action.bound
  SetSiteId(id) {
    this.siteId = id;
  }
}

const root = new RootStore();

export const rootStore = root;
export const siteStore = root.siteStore;
