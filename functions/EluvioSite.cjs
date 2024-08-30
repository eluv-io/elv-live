const functions = require("firebase-functions");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");

const SITE_DEFAULTS = {
  "favicon": "/favicon.png",
  "site_name": "Eluvio: Creators of The Content Fabric",
  "title": "Eluvio: Creators of The Content Fabric",
  "description": "Next Gen Content Distribution: Ultra Fast, Efficient, and Tamper Proof. Open, Decentralized, Scalable and Secure. Built for the Third Generation Internet.",
  "image": "https://main.net955305.contentfabric.io/s/main/q/hq__c5BiwtZkNjuDz97RwyqmcH9sTovzogczogT1sUshFXowrC8ZZ3i2tBtRBVxNLDKhkgJApuo6d/files/eluv.io/Eluvio-Share-Image-V3.jpg",
  "image_alt": "Eluvio"
};

const FabricConfiguration = {
  demov3: {
    staticUrl: "https://demov3.net955210.contentfabric.io/s/demov3",
    staging: {
      siteId: "iq__2gkNh8CCZqFFnoRpEUmz7P3PaBQG",
      libraryId: "ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD",
    }
  },
  main: {
    staticUrl: "https://main.net955305.contentfabric.io/s/main",
    staging: {
      siteId: "iq__inauxD1KLyKWPHargCWjdCh2ayr",
      libraryId: "ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9",
    },
    production: {
      siteId: "iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R",
      libraryId: "ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9",
    }
  }
};

const StaticUrl = async ({network, versionHash, path}) => {
  const UrlJoin = (await import("url-join")).default;

  let url = new URL(FabricConfiguration[network].staticUrl);
  url.pathname = UrlJoin(url.pathname, "q", versionHash, "meta", path);

  return url.toString();
}

async function RetrieveMetadata({network, mode, versionHash, path, select, resolve=false}) {
  try {
    const UrlJoin = (await import("url-join")).default;
    let url = new URL(FabricConfiguration[network].staticUrl);
    const {siteId, libraryId} = FabricConfiguration[network][mode];

    if(versionHash) {
      url.pathname = UrlJoin(url.pathname, "q", versionHash, "meta", path);
    } else {
      url.pathname = UrlJoin(url.pathname, "qlibs", libraryId, "q", siteId, "meta", path);
    }

    url.searchParams.set("resolve_include_source", "true");

    if(resolve) {
      url.searchParams.set("resolve", "true");
      url.searchParams.set("resolve_ignore_errors", "true");
      url.searchParams.set("link_depth", "1");
    } else {
      url.searchParams.set("resolve", "false");
    }

    if(select) {
      select.forEach(key => url.searchParams.append("select", key));
    }

    return (await axios.get(url.toString())).data;
  } catch(error) {
    if(error.response && error.response.status === 404) {
      return;
    }

    functions.logger.error("Error retrieving properties map from fabric");
    functions.logger.error(JSON.stringify(error, null, 2));
  }
}

// Load tenant sites
async function UpdateTenant({db, network, mode, tenantSlug}) {
  functions.logger.info(`${network}/${mode}: Updating tenant ${tenantSlug} and domain map`);

  const collection = `${network}-${mode}`;
  const metadata = await RetrieveMetadata({
    network,
    mode,
    path: `/public/asset_metadata`,
    select: [
      "/info/domain_map",
      `tenants/${tenantSlug}/sites`
    ],
    resolve: true
  });

  if(metadata) {
    // Tenant
    let batch = db.batch();
    Object.keys(metadata.tenants?.[tenantSlug]?.sites || {}).forEach(siteSlug => {
      try {
        const siteData = {
          ...metadata.tenants[tenantSlug].sites[siteSlug],
          site_slug: siteSlug,
          updatedAt: new Date().toISOString()
        };

        if(!siteData["/"]) { return; }

        siteData.site_hash = siteData["/"].split("/").find(segment => segment.startsWith("hq__"));
        delete siteData["."];
        delete siteData["/"];

        batch.set(db.doc(`${collection}-sites/${tenantSlug}-${siteSlug}`), siteData, {merge: true});
      } catch(error) {
        functions.logger.error(`${network}/${mode}: Error updating site ${siteSlug}`);
        functions.logger.error(error);
      }
    });

    await batch.commit();

    // Update domain map
    batch = db.batch();
    (metadata.info?.domain_map || []).forEach(mapping => {
      if(!mapping.domain) {
        return;
      }

      batch.set(db.doc(`${collection}-domains/${mapping.domain}`), {...mapping});
    });

    await batch.commit();
  }
}

// Load featured sites
async function UpdateFeaturedSites({db, network, mode}) {
  functions.logger.info(`${network}/${mode}: Updating featured sites and domain map`);

  const collection = `${network}-${mode}`;
  const metadata = await RetrieveMetadata({
    network,
    mode,
    path: "/public/asset_metadata",
    select: [
      "featured_events",
      "tenants",
      "info/domain_map"
    ]
  });

  if(metadata) {
    // Featured Sites
    let batch = db.batch();
    Object.keys(metadata.featured_events || {}).forEach(index => {
      const siteSlug = Object.keys(metadata.featured_events[index])[0];

      if(!siteSlug) { return; }

      try {

        const siteData = {
          ...metadata.featured_events[index][siteSlug],
          site_slug: siteSlug,
          updatedAt: new Date().toISOString()
        };

        if(!siteData["/"]) { return; }

        siteData.site_hash = siteData["/"].split("/").find(segment => segment.startsWith("hq__"));
        delete siteData["."];
        delete siteData["/"];

        batch.set(db.doc(`${collection}-featured-sites/${siteSlug}`), siteData, {merge: true});
      } catch(error) {
        functions.logger.error(`${network}/${mode}: Error updating featured site ${siteSlug}`);
        functions.logger.error(error);
      }
    })
    await batch.commit();

    batch = db.batch();
    (metadata.info?.domain_map || []).forEach(mapping => {
      if(!mapping.domain) {
        return;
      }

      batch.set(db.doc(`${collection}-domains/${mapping.domain}`), {...mapping});
    });

    await batch.commit();
  }
}

// Retrieve meta tags for property, updating only if hash has been updated
async function GetSiteMetaTags({db, network, mode, tenantSlug, siteSlug}) {
  try {
    const collection = `${network}-${mode}`;

    let siteData;
    if(tenantSlug) {
      // Tenant Site
      siteData = (await db.doc(`${collection}-sites/${tenantSlug}-${siteSlug}`).get())?.data();

      if(!siteData || new Date(siteData.updatedAt).getTime() < Date.now() - 60000) {
        await UpdateTenant({db, network, mode, tenantSlug});
        siteData = (await db.doc(`${collection}-sites/${tenantSlug}-${siteSlug}`).get())?.data();
      }
    } else {
      // Featured Site
      siteData = (await db.doc(`${collection}-featured-sites/${siteSlug}`).get())?.data();

      if(!siteData || new Date(siteData.updatedAt).getTime() < Date.now() - 60000) {
        await UpdateFeaturedSites({db, network, mode});
        siteData = (await db.doc(`${collection}-featured-sites/${siteSlug}`).get())?.data();
      }
    }

    if(!siteData) { return; }

    let metaTags;
    try {
      metaTags = JSON.parse(siteData.meta_tags)

      // Meta tags from different property version
      if(metaTags?.site_hash !== siteData.site_hash) {
        metaTags = undefined;
      }
    } catch(error) {}

    if(!metaTags) {
      functions.logger.info(`${network}/${mode}: Updating site meta tags ${tenantSlug || ""}/${siteSlug}`);
      // Update property data
      metaTags = (await RetrieveMetadata({
        network,
        mode,
        versionHash: siteData.site_hash,
        path: "/public/asset_metadata/info",
        select: [
          "favicon",
          "event_info/event_title",
          "event_info/description"
        ]
      })) || {};

      metaTags = {
        site_hash: siteData.site_hash,
        site_name: metaTags?.event_info?.event_title || "",
        title: metaTags?.event_info?.event_title || "",
        description: metaTags?.event_info?.description || "",
        image: await StaticUrl({network, versionHash: siteData.site_hash, path: "public/asset_metadata/info/event_images/hero_background"}),
        favicon: !metaTags?.favicon ? undefined :
          await StaticUrl({network, versionHash: siteData.site_hash, path: "public/asset_metadata/info/favicon"})
      };

      if(tenantSlug) {
        await db.doc(`${collection}-sites/${tenantSlug}-${siteSlug}`)
          .set({meta_tags: JSON.stringify(metaTags)}, {merge: true});
      } else {
        await db.doc(`${collection}-featured-sites/${siteSlug}`)
          .set({meta_tags: JSON.stringify(metaTags)}, {merge: true});
      }
    }

    return metaTags;
  } catch(error) {
    functions.logger.error(`${network}/${mode}: Error retrieving site meta tags for ${tenantSlug || ""}/${siteSlug}`);
    functions.logger.error(error);
  }
}

async function FindSiteSlugs({db, host, path, network, mode}) {
  try {
    const collection = `${network}-${mode}`;

    path = path.split("?")[0].replace(/\/$/, "").replace(/^\//, "");

    const MAIN_SITE_PATHS = [
      "/community",
      "/wallet",
      "/content-fabric",
      "/apps",
      "/features",
      "/about",
      "/creators-and-publishers",
      "/media-wallet",
      "/register"
    ];

    let [tenantSlugOrSiteSlug, siteSlug] = path.split("/");

    // Definitely not a site if it is one of the main site pages
    if(MAIN_SITE_PATHS.includes(`/${tenantSlugOrSiteSlug}`)) {
      return {};
    }

    if(!tenantSlugOrSiteSlug && !host.includes("eluv.io") && !host.includes("eluv-io")) {
      // Custom domain
      const domainMap = (await db.doc(`${collection}-domains/${host}`).get())?.data();

      if(domainMap) {
        tenantSlugOrSiteSlug = domainMap.tenant_slug || domainMap.event_slug;
        siteSlug = tenantSlugOrSiteSlug && domainMap.event_slug;
      }
    }

    return {tenantSlugOrSiteSlug, siteSlug};
  } catch(error) {
    functions.logger.error(`${network}/${mode}: Error parsing site slug from path ${path}`);
    functions.logger.error(error);
  }

  return {};
}

async function SiteMetadata(db, req, res) {
  const protocol = req.headers["X-Forwarded-Protocol"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.hostname;
  const path = req.headers["x-forwarded-url"] || req.originalUrl;
  const network = ["demov3", "localhost"].find(demoHost => host.includes(demoHost)) ? "demov3" : "main";
  const mode = network === "demov3" || host.includes(".preview") || host.includes(".dev") ? "staging" : "production";

  const { tenantSlugOrSiteSlug, siteSlug } = await FindSiteSlugs({db, host, path, network, mode});

  let metaTags;
  if(tenantSlugOrSiteSlug) {
    metaTags = await GetSiteMetaTags({
      db,
      network,
      mode,
      tenantSlug: siteSlug ? tenantSlugOrSiteSlug : undefined,
      siteSlug: siteSlug || tenantSlugOrSiteSlug
    });
  }

  metaTags = metaTags || SITE_DEFAULTS;

  const url = new URL(protocol + "://" + host);
  url.pathname = path;

  let html = fs.readFileSync(Path.resolve(__dirname, "./index-live-template.html")).toString();
  html = html.replaceAll("@@FAVICON@@", metaTags.favicon || SITE_DEFAULTS.favicon);
  html = html.replaceAll("@@og:site_name@@", metaTags.site_name || SITE_DEFAULTS.site_name);
  html = html.replaceAll("@@og:title@@", metaTags.title || SITE_DEFAULTS.title);
  html = html.replaceAll("@@og:description@@", metaTags.description || "");
  html = html.replaceAll("@@og:image@@", metaTags.image || SITE_DEFAULTS.image);
  html = html.replaceAll("@@og:image:alt@@", metaTags.image_alt || SITE_DEFAULTS.image_alt);
  html = html.replaceAll("@@og:url@@", url.toString());

  // Inject metadata
  res.status(200).send(html);

  return true;
}

async function GenerateEluvioSiteIndex(db, req, res) {
  try {
    return await SiteMetadata(db, req, res)
  } catch(error) {
    functions.logger.error("Error updating site metadata:");
    functions.logger.error(error);
  }
}

module.exports = GenerateEluvioSiteIndex;
