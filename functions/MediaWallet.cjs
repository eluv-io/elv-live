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
    functions.logger.error("Error retrieving properties map from fabric");
    functions.logger.error(error);
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

async function FindProperty({host, path, network, mode}) {
  const collection = `${network}-${mode}`;
  const propertiesDocument = db.doc(`${collection}/mediaProperties`);
  const propertiesData = await (propertiesDocument).get()

  const propertyData = await (propertiesDocument).get()

  let propertiesMap, domainMap;
  if(propertiesData.exists && new Date(propertiesData.data().updatedAt).getTime() > Date.now() - 60000) {
    try {
      propertiesMap = JSON.parse(propertyData.data().propertiesMap);
      domainMap = JSON.parse(propertyData.data().domainMap);
    } catch(error) {
      functions.logger.error("Error parsing properties map from firebase");
      functions.logger.error(error);
    }
  }

  if(!propertiesMap || !domainMap) {
    // Update from fabric metadata
    functions.logger.info("Updating media properties");

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
      propertiesMap = metadata.media_properties;
      domainMap = metadata.info?.domain_map || [];

      await propertiesDocument.set({
        propertiesMap: JSON.stringify(propertiesMap),
        domainMap: JSON.stringify(domainMap),
        updatedAt: new Date().toISOString()
      });
    }
  }

  if(!propertiesMap) { return; }

  let propertySlugOrId;
  try {
    propertySlugOrId =
      domainMap.find(mapping => mapping.domain?.includes(host))?.property_slug ||
      // Thing directly after last /p in path
      [...path.matchAll(/\/p\/([^/]+)/g)]?.slice(-1)?.[0]?.[1] ||
      // Or first item in path
      path.replace(/^\//, "").split("/")[0]
  } catch(error) {
    functions.logger.error("Error parsing properties slug or ID from path " + path);
    functions.logger.error(error);
  }

  return propertySlugOrId && propertiesMap[propertySlugOrId];
}

async function GetPropertyMetaTags({network, mode, propertyInfo}) {
  const collection = `${network}-${mode}`;
  const versionHash = propertyInfo["/"].split("/").find(segment => segment.startsWith("hq__"));
  const propertyDocument = db.doc(`${collection}/${propertyInfo.property_id}`);
  const propertyData = await (propertyDocument).get()

  let info;
  if(propertyData.exists && propertyData.data().versionHash === versionHash) {
    try {
      info = JSON.parse(propertyData.data().info);
    } catch(error) {
      functions.logger.error("Error parsing properties map from firebase");
      functions.logger.error(error);
    }
  }

  if(!info) {
    functions.logger.info("Updating media property " + propertyInfo.property_id);
    // Update property data
    info = await RetrieveMetadata({
      network,
      mode,
      versionHash,
      path: "/public/asset_metadata/info/meta_tags"
    });
    await propertyDocument.set({
      info: JSON.stringify(info),
      versionHash,
      updatedAt: new Date().toISOString()
    });
  }

  return info;
}

async function PropertyMetadata(req, res) {
  const protocol = req.headers["X-Forwarded-Protocol"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.hostname;
  const path = req.headers["x-forwarded-url"] || req.originalUrl;
  const network = ["demov3", "localhost"].find(demoHost => host.includes(demoHost)) ? "demov3" : "main";
  const mode = network === "demov3" || host.includes("preview") ? "staging" : "production";

  const propertyInfo = await FindProperty({host, path, network, mode});

  if(!propertyInfo) {
    return;
  }

  const metaTags = await GetPropertyMetaTags({network, mode, propertyInfo});

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
