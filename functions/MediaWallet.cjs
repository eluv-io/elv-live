const functions = require("firebase-functions");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();

const B64 = str => Buffer.from(str, "utf-8").toString("base64");
const FromB64 = str => Buffer.from(str, "base64").toString("utf-8");

const WALLET_DEFAULTS = {
  "og:site_name": "Eluvio Media Wallet",
  "og:title": "Eluvio Media Wallet",
  "og:description": "The Eluvio Media Wallet is your personal vault for media collectibles, and your gateway to browse the best in premium content distributed directly by its creators and publishers.",
  "og:image": "https://main.net955305.contentfabric.io/s/main/q/hq__c5BiwtZkNjuDz97RwyqmcH9sTovzogczogT1sUshFXowrC8ZZ3i2tBtRBVxNLDKhkgJApuo6d/files/eluv.io/Eluvio-Share-Image-V3.jpg",
  "og:image:alt": "Eluvio"
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

async function RetrieveMetadata({network, mode, versionHash, path, select}) {
  try {
    const UrlJoin = (await import("url-join")).default;
    let url = new URL(FabricConfiguration[network].staticUrl);
    const {siteId, libraryId} = FabricConfiguration[network][mode];

    if(versionHash) {
      url.pathname = UrlJoin(url.pathname, "q", versionHash, "meta", path);
    } else {
      url.pathname = UrlJoin(url.pathname, "qlibs", libraryId, "q", siteId, "meta", path);
    }

    url.searchParams.set("resolve", "false");
    url.searchParams.set("resolve_include_source", "true");

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

async function FromOGParam(req, res) {
  let meta = "";

  let html = fs.readFileSync(Path.resolve(__dirname, "./index-wallet-template.html")).toString();

  let ogParam = req.query.og;

  if(ogParam) {
    try {
      const tags = JSON.parse(FromB64(ogParam));

      if(tags["og:image"]) {
        // Resolve static image URL to resolved node URL
        try {
          const imageUrl = new URL(tags["og:image"]);

          // Resolve with client IP address for more appropriate node selection
          const userIp = req.headers["x-appengine-user-ip"] || req.headers["x-forwarded-for"] || req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress;

          if(userIp) {
            imageUrl.searchParams.set("client_ip", userIp);
          }

          // Remove client IP address from resolved URL for privacy
          const resolvedImage = new URL((await axios.get(imageUrl.toString())).request.res.responseUrl);
          resolvedImage.searchParams.delete("client_ip");

          tags["og:image"] = resolvedImage.toString();
        } catch(error) {
          functions.logger.warn("Failed to resolve static image URL:");
          functions.logger.warn(error);
        }
      }

      Object.keys(tags).forEach((key) => {
        const val = tags[key].replaceAll("\"", "&quot;");
        if(WALLET_DEFAULTS[key]) {
          // Known field - Replace variable
          html = html.replaceAll(`@@${key}@@`, val);
        } else {
          // Other field - Append to metadata
          meta += `\n<meta property="${key}" content="${val}" />`;
        }
      });
    } catch(error) {
      functions.logger.error("Error parsing OG tags:");
      functions.logger.error(error);
    }
  }

  // Fill any defaults unset
  Object.keys(WALLET_DEFAULTS).forEach(key => {
    html = html.replaceAll(`@@${key}@@`, WALLET_DEFAULTS[key]);
  });

  const protocol = req.headers["X-Forwarded-Protocol"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.hostname;
  const path = req.headers["x-forwarded-url"] || req.originalUrl;

  const url = new URL(protocol + "://" + host);
  url.pathname = path;

  html = html.replaceAll("@@og:url@@", url.toString());
  html = html.replaceAll("@@FAVICON@@", "/favicon.png");

  // Inject metadata
  html = html.replace(/@@META@@/g, meta);
  res.status(200).send(html);
}

// Load latest property and domain mapping info
async function UpdateProperties({network, mode}) {
  functions.logger.info(`${network}/${mode}: Updating properties and domain map`);

  const collection = `${network}-${mode}`;
  const metadata = await RetrieveMetadata({
    network,
    mode,
    path: "/public/asset_metadata",
    select: [
      "media_properties",
      "info/domain_map"
    ]
  });

  if(metadata) {
    let batch = db.batch();
    Object.keys(metadata.media_properties || {}).forEach(propertySlug => {
      try {
        const propertyData = {
          ...metadata.media_properties[propertySlug],
          property_slug: propertySlug,
          updatedAt: new Date().toISOString()
        };

        if(!propertyData["/"]) { return; }

        propertyData.property_hash = propertyData["/"].split("/").find(segment => segment.startsWith("hq__"));
        delete propertyData["."];
        delete propertyData["/"];

        batch.set(db.doc(`${collection}-properties/${propertySlug}`), propertyData, {merge: true});
        batch.set(db.doc(`${collection}-properties/${metadata.media_properties[propertySlug].property_id}`), propertyData, {merge: true});
      } catch(error) {
        functions.logger.error(`${network}/${mode}: Error updating media property ${propertySlug}`);
        functions.logger.error(error);
      }
    });

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
async function GetPropertyMetaTags({network, mode, propertySlugOrId}) {
  const collection = `${network}-${mode}`;
  let propertyData = (await db.doc(`${collection}-properties/${propertySlugOrId}`).get())?.data();

  if(!propertyData || new Date(propertyData.updatedAt).getTime() < Date.now() - 60000) {
    await UpdateProperties({network, mode});
  }

  propertyData = (await db.doc(`${collection}-properties/${propertySlugOrId}`).get())?.data();

  let metaTags;
  if(propertyData) {
    try {
      metaTags = JSON.parse(propertyData.meta_tags)

      // Meta tags from different property version
      if(metaTags?.property_hash !== propertyData.property_hash) {
        metaTags = undefined;
      }
    } catch(error) {}
  }

  if(!metaTags) {
    functions.logger.info(`${network}/${mode}: Updating media property meta tags ${propertySlugOrId}`);
    // Update property data
    metaTags = (await RetrieveMetadata({
      network,
      mode,
      versionHash: propertyData.property_hash,
      path: "/public/asset_metadata/info/meta_tags"
    })) || {};

    metaTags.property_hash = propertyData.property_hash;

    await db.doc(`${collection}-properties/${propertyData.property_id}`)
      .set({meta_tags: JSON.stringify(metaTags)}, {merge: true});
    if(propertyData.property_slug) {
      await db.doc(`${collection}-properties/${propertyData.property_slug}`)
        .set({meta_tags: JSON.stringify(metaTags)}, {merge: true});
    }
  }

  return metaTags;
}

async function FindPropertySlugOrId({host, path, network, mode}) {
  const collection = `${network}-${mode}`;

  path = path.split("?")[0].replace(/\/$/, "");

  let propertySlugOrId;
  try {
    propertySlugOrId =
      // Thing directly after last /p in path
      [...path.matchAll(/\/p\/([^/]+)/g)]?.slice(-1)?.[0]?.[1] ||
      // Or first item in path
      path.replace(/^\//, "").split("/")[0];

    if(!propertySlugOrId) {
      const domainMap = (await db.doc(`${collection}-domains/${host}`).get())?.data();

      if(domainMap) {
        propertySlugOrId = domainMap.property_slug;
      }
    }
  } catch(error) {
    functions.logger.error("Error parsing properties slug or ID from path " + path);
    functions.logger.error(error);
  }

  return propertySlugOrId;
}

async function PropertyMetadata(req, res) {
  const protocol = req.headers["X-Forwarded-Protocol"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.hostname;
  const path = req.headers["x-forwarded-url"] || req.originalUrl;
  const network = ["demov3", "localhost"].find(demoHost => host.includes(demoHost)) ? "demov3" : "main";
  const mode = network === "demov3" || host.includes(".preview") || host.includes(".dev") ? "staging" : "production";

  const propertySlugOrId = await FindPropertySlugOrId({host, path, network, mode});
  console.log(propertySlugOrId);

  if(!propertySlugOrId) {
    return;
  }

  const metaTags = await GetPropertyMetaTags({network, mode, propertySlugOrId});

  if(!metaTags) {
    return;
  }

  const url = new URL(protocol + "://" + host);
  url.pathname = path;

  let html = fs.readFileSync(Path.resolve(__dirname, "./index-wallet-template.html")).toString();
  html = html.replaceAll("@@FAVICON@@", metaTags.favicon || "/favicon.png");
  html = html.replaceAll("@@og:site_name@@", metaTags.site_name || "Eluvio Media Wallet");
  html = html.replaceAll("@@og:title@@", metaTags.title || "Eluvio Media Wallet");
  html = html.replaceAll("@@og:description@@", metaTags.description || "");
  html = html.replaceAll("@@og:image@@", metaTags.image || "");
  html = html.replaceAll("@@og:image:alt@@", metaTags.image_alt || "");
  html = html.replaceAll("@@og:url@@", url.toString());

  // Inject metadata
  html = html.replace(/@@META@@/g, "");
  res.status(200).send(html);

  return true;
}

async function GenerateMediaWalletIndex(req, res) {
  try {
    if(await PropertyMetadata(req, res)) {
      return;
    }
  } catch(error) {
    functions.logger.error("Error updating property metadata:");
    functions.logger.error(error);
  }

  await FromOGParam(req, res);
}

module.exports = GenerateMediaWalletIndex;
