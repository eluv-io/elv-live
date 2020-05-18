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

  @observable history = [];

  @observable libraries = {};
  @observable objects = {};

  @observable error = "";

  constructor() {
    this.InitializeClient();
    this.siteStore = new SiteStore(this);
  }

  @action.bound
  InitializeClient() {
    this.client = undefined;

    let client = new FrameClient({
      target: window.parent,
      timeout: 30
    });

    client.SendMessage({options: {operation: "HideHeader"}, noResponse: true});

    const appPath = window.location.hash
      .replace(/^\/*#?\/*/, "")
      .split("/");

    const initialContentId = appPath[0];

    if(initialContentId) {
      this.SetSiteId(initialContentId);
    }

    // Setting the client signals the app to start rendering
    this.client = client;
  }

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
  SetSiteId(id, pushHistory=true) {
    this.error = "";

    if(this.siteId && pushHistory) {
      this.history.push(this.siteId);
    }

    this.siteId = id;

    window.location.hash = `#/${id || ""}`;

    if(this.client && window.self !== window.top) {
      this.client.SendMessage({
        options: {
          operation: "SetFramePath",
          path: `#/${id || ""}`
        },
        noResponse: true
      });
    }
  }

  @action.bound
  PopSiteId() {
    this.SetSiteId(this.history.pop(), false);
  }

  @action.bound
  SetError(error) {
    this.error = error;
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
  ReturnToApps() {
    this.client.SendMessage({options: {operation: "ShowAppsPage"}, noResponse: true});
  }
}

const root = new RootStore();

export const rootStore = root;
export const siteStore = root.siteStore;
