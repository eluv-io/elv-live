import {configure, observable, action, flow, runInAction} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient";
import SiteStore from "./Site";
import { StreamChat } from "stream-chat";

// Force strict mode so mutations are only allowed within actions.
configure({
  enforceActions: "always"
});

const Hash = (code) => {
  const chars = code.split("").map(code => code.charCodeAt(0));
  return chars.reduce((sum, char, i) => (chars[i + 1] ? (sum * 2) + char * chars[i+1] * (i + 1) : sum + char), 0).toString();
};

class RootStore {
  @observable client;
  @observable playoutOptions;

  @observable availableSites = [];

  @observable email;
  @observable name;
  @observable chatID;
  @observable chatClient;
  @observable accessCode;

  @observable libraries = {};
  @observable objects = {};

  @observable error = "";
  
  @observable background;
  @observable logo;
  @observable OTPcode = "abc";


  constructor() {
    this.siteStore = new SiteStore(this);
    this.InitializeClient();
  }

  @action.bound
  InitializeClient = flow(function * () {
    this.client = undefined;

    let client;
    // Initialize ElvClient or FrameClient
    if(window.self === window.top) {
      const ElvClient = (yield import("@eluvio/elv-client-js")).ElvClient;

      client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});

      const wallet = client.GenerateWallet();
      // const mnemonic = wallet.GenerateMnemonic();
      // const signer = wallet.AddAccountFromMnemonic({mnemonic});
      const signer = wallet.AddAccount({privateKey: "0x06407eef6fa8c78afb550b4e24a88956f1a07b4a74ff76ffaacdacb4187892d6"});

      client.SetSigner({signer});
      yield client.SetNodes({fabricURIs: ["https://host-66-220-3-86.contentfabric.io"]});
      
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

  RedeemCode = flow(function * (email, code, name) {
    try {
      // HERE: Function to check OTP password
      
      //     if(!codeInfo || !codeInfo.ak) {
      //       this.SetError("Invalid code");
      //       return false;
      //     }

      this.accessCode = true; //True or False whether it got redeemed


      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(email).toLowerCase())) {
        this.SetError("Invalid email");
        return false;
      }
      const letterNumber = /^[0-9a-zA-Z]+$/;
      if (!(name.match(letterNumber))) {
        this.SetError("Invalid Chat Name");
        return false;
      }

      this.email = email;
      this.name = name;

      this.chatClient = new StreamChat('7h9psjzs3nb6');
      this.chatID = yield this.chatClient.devToken(this.name);

      
      let siteId = "iq__uwWvF1Wy9EeqWXiRU9bR3zRSJe1";

      return siteId;
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
      this.OTPcode = "test12345"; //assign new OTP ticket
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to createOTP:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });
  // RedeemCode = flow(function * (siteSelectorId, email, code, name) {
  //   let client;
  //   try {
  //     const hash = Hash(code);

  //     const versionHash = yield this.client.LatestVersionHash({objectId: siteSelectorId});

  //     const isGlobalSelector = (yield this.client.ContentObjectMetadata({
  //       versionHash,
  //       metadataSubtree: "public/site_selector_type"
  //     })) === "global";

  //     let codeInfo;
  //     if(isGlobalSelector) {
  //       // Get unresolved meta to determine length of selector list
  //       const selectorList = yield this.client.ContentObjectMetadata({
  //         versionHash,
  //         metadataSubtree: "public/site_selectors"
  //       });

  //       for(let i = 0; i < selectorList.length; i++) {
  //         codeInfo = yield this.client.ContentObjectMetadata({
  //           versionHash,
  //           metadataSubtree: `public/site_selectors/${i}/${hash}`
  //         });

  //         if(codeInfo && codeInfo.ak) {
  //           break;
  //         }
  //       }
  //     } else {
  //       codeInfo = yield this.client.ContentObjectMetadata({
  //         versionHash,
  //         metadataSubtree: `public/codes/${hash}`
  //       });
  //     }

  //     if(!codeInfo || !codeInfo.ak) {
  //       this.SetError("Invalid code");
  //       return false;
  //     }
  //     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //     if (!re.test(String(email).toLowerCase())) {
  //       this.SetError("Invalid email");
  //       return false;
  //     }
  //     const letterNumber = /^[0-9a-zA-Z]+$/;
  //     if (!(name.match(letterNumber))) {
  //       this.SetError("Invalid Chat Name");
  //       return false;
  //     }

  //     const ElvClient = (yield import("@eluvio/elv-client-js")).ElvClient;
  //     client = yield ElvClient.FromConfigurationUrl({configUrl: EluvioConfiguration["config-url"]});
  //     const wallet = client.GenerateWallet();

  //     const encryptedPrivateKey = atob(codeInfo.ak);
  //     const signer = yield wallet.AddAccountFromEncryptedPK({encryptedPrivateKey, password: code});

  //     client.SetSigner({signer});

  //     this.email = email;
  //     this.name = name;

  //     this.chatClient = new StreamChat('7h9psjzs3nb6');
  //     this.chatID = yield this.chatClient.devToken(this.name);

  //     this.accessCode = code;
  //     this.client = client;

  //     return codeInfo.sites[0].siteId;
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Error redeeming code:");
  //     // eslint-disable-next-line no-console
  //     console.error(error);

  //     this.SetError("Invalid code");
  //     return false;
  //   }
  // });


  async FindSites() {
    let sites = [];

    const contentSpaceLibraryId =
      this.client.utils.AddressToLibraryId(
        this.client.utils.HashToAddress(
          await this.client.ContentSpaceId()
        )
      );

    const groupAddresses = await this.client.Collection({collectionType: "accessGroups"});
    await Promise.all(
      groupAddresses.map(async groupAddress => {
        try {
          const groupSites = await this.client.ContentObjectMetadata({
            libraryId: contentSpaceLibraryId,
            objectId: this.client.utils.AddressToObjectId(groupAddress),
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
  }

  @action.bound
  LoadAvailableSites = flow(function * () {
    const sites = yield this.FindSites();

    this.availableSites = yield Promise.all(
      sites.map(async siteId => {
        try {
          const libraryId = await this.client.ContentObjectLibraryId({objectId: siteId});

          const siteName = await this.client.ContentObjectMetadata({
            libraryId,
            objectId: siteId,
            metadataSubtree: "public/name"
          });

          return {
            name: siteName,
            objectId: siteId
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to retrieve available site info:", siteId);
          // eslint-disable-next-line no-console
          console.error(error);
        }
      })
    );
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
  ListLibraries = flow(function * () {
    const libraryIds = yield this.client.ContentLibraries();

    this.libraries = {};

    (yield Promise.all(
      libraryIds.map(async libraryId => {
        try {
          const metadata = await this.client.ContentObjectMetadata({
            libraryId,
            objectId: libraryId.replace("ilib", "iq__")
          });

          this.libraries[libraryId] = {
            libraryId,
            name: metadata.public && metadata.public.name || metadata.name || libraryId,
            metadata
          };
        } catch (error) {
          return undefined;
        }
      })
    ));
  });

  @action.bound
  ListObjects = flow(function * ({libraryId, page=1, perPage=25, filter="", cacheId=""}) {
    const metadata = yield this.client.ContentObjectMetadata({
      libraryId,
      objectId: libraryId.replace("ilib", "iq__")
    });

    this.libraries[libraryId] = {
      libraryId,
      name: metadata.public && metadata.public.name || metadata.name || libraryId,
      metadata
    };

    let filters = [];
    if(filter) {
      filters.push({key: "/public/name", type: "cnt", filter});
    }

    let { contents, paging } = yield this.client.ContentObjects({
      libraryId,
      filterOptions: {
        select: [
          "description",
          "image",
          "name",
          "player_background",
          "public"
        ],
        filter: filters,
        start: (page-1) * perPage,
        limit: perPage,
        sort: "public/name",
        cacheId
      }
    });

    this.objects[libraryId] = (yield Promise.all(
      contents.map(async object => {
        const latestVersion = object.versions[0];

        return {
          objectId: latestVersion.id,
          versionHash: latestVersion.hash,
          name: latestVersion.meta.public && latestVersion.meta.public.name || latestVersion.meta.name || latestVersion.id,
          metadata: latestVersion.meta
        };
      })
    ));

    return paging;
  });

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

  @action.bound
  ReturnToApps() {
    if(this.client && this.client.SendMessage) {
      this.client.SendMessage({options: {operation: "ShowAppsPage"}, noResponse: true});
    }
  }
}

const root = new RootStore();

export const rootStore = root;
export const siteStore = root.siteStore;
