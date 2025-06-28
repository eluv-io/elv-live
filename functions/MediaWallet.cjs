const functions = require("firebase-functions");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");

const WALLET_DEFAULTS = {
  "favicon": "/favicon.png",
  "site_name": "Eluvio Media Wallet",
  "title": "Eluvio Media Wallet",
  "description": "The Eluvio Media Wallet is your personal vault for media collectibles, and your gateway to browse the best in premium content distributed directly by its creators and publishers.",
  "image": "https://main.net955305.contentfabric.io/s/main/q/hq__c5BiwtZkNjuDz97RwyqmcH9sTovzogczogT1sUshFXowrC8ZZ3i2tBtRBVxNLDKhkgJApuo6d/files/eluv.io/Eluvio-Share-Image-V3.jpg",
  "image_alt": "Eluvio",
  "google_verification_id": "O0F7q8cj9n-Sh5tKTJTwJ1iPPz0N01zsgB0rCSaAs74"
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

// Load latest property and domain mapping info
async function UpdateProperties({db, network, mode}) {
  console.time(`${network}/${mode}: Updating properties and domain map`);
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

    /*
    console.log("\n\n")
    console.log(JSON.stringify(metadata, null, 2))
    console.log("\n\n")

     */
    Object.keys(metadata.media_properties || {}).forEach(propertySlug => {
      if(!propertySlug) { return; }

      try {
        propertySlug = propertySlug.trim();
        const propertyData = {
          ...metadata.media_properties[propertySlug],
          property_slug: propertySlug,
          updatedAt: new Date().toISOString()
        };

        if(
          !propertyData["/"] ||
          !metadata.media_properties[propertySlug].property_id
        ) { return; }

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

  console.timeEnd(`${network}/${mode}: Updating properties and domain map`);
}

// Retrieve meta tags for property, updating only if hash has been updated
async function GetPropertyMetaTags({db, network, mode, propertySlugOrId}) {
  try {
    const collection = `${network}-${mode}`;
    let propertyData = (await db.doc(`${collection}-properties/${propertySlugOrId}`).get())?.data();

    if(!propertyData || new Date(propertyData.updatedAt).getTime() < Date.now() - 60000) {
      await UpdateProperties({db, network, mode});
      propertyData = (await db.doc(`${collection}-properties/${propertySlugOrId}`).get())?.data();
    }

    if(!propertyData) { return; }

    let metaTags;
    try {
      metaTags = JSON.parse(propertyData.meta_tags);

      // Meta tags from different property version
      if(metaTags?.property_hash !== propertyData.property_hash) {
        metaTags = undefined;
      }
    } catch(error) {}

    if(!metaTags) {
      console.time(`${network}/${mode}: Updating media property meta tags ${propertySlugOrId}`);
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

      console.timeEnd(`${network}/${mode}: Updating media property meta tags ${propertySlugOrId}`);
    }

    return metaTags;
  } catch(error) {
    functions.logger.error(`${network}/${mode}: Error retrieving property meta tags for ${propertySlugOrId}`);
    functions.logger.error(error);
  }
}

async function FindPropertySlugOrId({db, host, path, network, mode}) {
  const collection = `${network}-${mode}`;

  path = path.split("?")[0].replace(/\/$/, "");

  let propertySlugOrId, googleVerificationId, isCustomDomain;
  let redirect = false;
  try {
    const domainMap = (await db.doc(`${collection}-domains/${host}`).get())?.data();

    if(domainMap) {
      isCustomDomain = true;
      propertySlugOrId = domainMap.property_slug;
      googleVerificationId = domainMap.google_site_verification_id;

      const propertiesInUrl = path
        .replace(/^\//, "")
        .split("/p/")
        .filter(segment => segment)
        .map(path => path.split("/")[0])
        .filter(segment=>segment);

      redirect = path !== "/sitemap.xml" && propertiesInUrl.length > 0 && !propertiesInUrl.includes(propertySlugOrId);
    } else {
      propertySlugOrId =
        // Thing directly after last /p in path
        [...path.matchAll(/\/p\/([^/]+)/g)]?.slice(-1)?.[0]?.[1] ||
        // Or first item in path
        path.replace(/^\//, "").split("/")[0];
    }
  } catch(error) {
    functions.logger.error(`${network}/${mode}: Error parsing properties slug from path ${path}`);
    functions.logger.error(error);
  }

  return { isCustomDomain, propertySlugOrId, redirect, googleVerificationId };
}

const Sitemap = ({protocol, host, propertySlugOrId, metaTags}) => {
  const url = new URL(protocol + "://" + host);

  let content = [];
  content.push("<url>");
  content.push(`<loc>${url.toString()}</loc>`);
  metaTags.updated_at && content.push(`<lastmod>${metaTags.updated_at}</lastmod>`);
  content.push("</url>");

  if(propertySlugOrId) {
    url.pathname = propertySlugOrId;
    content.push("<url>");
    content.push(`<loc>${url.toString()}</loc>`);
    metaTags.updated_at && content.push(`<lastmod>${metaTags.updated_at}</lastmod>`);
    content.push("</url>");
  }

  return (`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${content.join("\n")}\n</urlset>`);
};

// Note: Cannot write dynamic robots.txt with firebase functions
// https://github.com/firebase/firebase-tools/issues/3734

// Special root routes that should not be rewritten
const protectedRoutes = [
  "/action",
  "/flow",
  "/login",
  "/register",
  "/oidc"
];

async function PropertyMetadata(db, req, res) {
  const protocol = req.headers["X-Forwarded-Protocol"] || req.protocol || "https";
  let host = req.headers["x-forwarded-host"] || req.hostname;
  let path = req.headers["x-forwarded-url"] || req.originalUrl;

  const protectedPath = protectedRoutes.find(route => path.startsWith(route));
  if(protectedPath || path.includes("/index.html")) {
    path = "/";
  }

  const network = ["demov3", "localhost"].find(demoHost => host.includes(demoHost)) ? "demov3" : "main";
  const mode = network === "demov3" || host.includes(".preview") || host.includes(".dev") ? "staging" : "production";
  //const network = "demov3";
  //const mode = "main";

  const { isCustomDomain, propertySlugOrId, redirect, googleVerificationId } = await FindPropertySlugOrId({db, host, path, network, mode});

  if(redirect) {
    const url = new URL(protocol + "://" + host);
    url.pathname = propertySlugOrId;
    
    // cache the redirect for 5 minutes
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    
    res.redirect(302, url.toString());
    return;
  }

  let metaTags;
  if(propertySlugOrId) {
    metaTags = await GetPropertyMetaTags({db, network, mode, propertySlugOrId});
  }

  metaTags = metaTags || WALLET_DEFAULTS;

  if(path === "/sitemap.xml") {
    res.setHeader("content-type", "application/xml");

    // cache the response, at least for a little bit
      res.set('Cache-Control', 'public, max-age=30, s-maxage=60');
    
    res.status(200).send(Sitemap({protocol, host, propertySlugOrId, metaTags}));
    return;
  }

  const url = new URL(protocol + "://" + host);
  url.pathname = path;

  let html = fs.readFileSync(Path.resolve(__dirname, "./index-wallet-template.html")).toString();
  html = html.replaceAll("@@FAVICON@@", metaTags.favicon || WALLET_DEFAULTS.favicon);
  html = html.replaceAll("@@og:site_name@@", metaTags.site_name || WALLET_DEFAULTS.site_name);
  html = html.replaceAll("@@og:title@@", metaTags.title || WALLET_DEFAULTS.title);
  html = html.replaceAll("@@og:description@@", metaTags.description || "");
  html = html.replaceAll("@@og:image@@", metaTags.image || WALLET_DEFAULTS.image);
  html = html.replaceAll("@@og:image:alt@@", metaTags.image_alt || WALLET_DEFAULTS.image_alt);
  html = html.replaceAll("@@og:url@@", url.toString());

  let additionalContent = "";
  additionalContent += `\n<meta name="google-site-verification" content="${googleVerificationId || WALLET_DEFAULTS.google_verification_id}" />\n`;

  if(isCustomDomain) {
    additionalContent += "\n<link rel=\"sitemap\" type=\"application/xml\" title=\"Sitemap\" href=\"/sitemap.xml\">\n";
  }

  html = html.replaceAll("@@additionalContent@@", additionalContent);

  // cache the response, at least for a little bit
  res.set('Cache-Control', 'public, max-age=30, s-maxage=60');

  // Inject metadata
  res.status(200).send(html);

  return true;
}

async function GenerateMediaWalletIndex(db, req, res) {
  try {
    return await PropertyMetadata(db, req, res);
  } catch(error) {
    functions.logger.error("Error updating property metadata:");
    functions.logger.error(error);
  }
}

module.exports = GenerateMediaWalletIndex;
