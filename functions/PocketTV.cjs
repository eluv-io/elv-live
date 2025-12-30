const functions = require("firebase-functions");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");
const { createHash } = require("crypto");
const {user} = require("firebase-functions/v1/auth");

const WALLET_DEFAULTS = {
  "favicon": "/favicon.png",
  "site_name": "Eluvio Pocket TV",
  "title": "Eluvio Pocket TV",
  "image": "https://main.net955305.contentfabric.io/s/main/q/hq__t9orHZVWdKnAvWHjrJ7424a8uS2Tsfd33REBvJPrYkvDW34Ytak8eThKB5UbUJcXq8s3TbEmgQD/files/eluv.io/Eluvio-Share-Image-V4.jpg",
  "image_alt": "Logo",
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
  console.time(`${network}/${mode}: Updating pocket properties and domain map`);
  functions.logger.info(`${network}/${mode}: Updating properties and domain map`);

  const collection = `pocket-${network}-${mode}`;
  const metadata = await RetrieveMetadata({
    network,
    mode,
    path: "/public/asset_metadata",
    select: [
      "pocket_properties",
      "info/domain_map"
    ]
  });

  if(metadata) {
    let batch = db.batch();

    Object.keys(metadata.pocket_properties || {}).forEach(pocketSlug => {
      if(!pocketSlug) { return; }

      try {
        pocketSlug = pocketSlug.trim();
        const pocketData = {
          ...metadata.pocket_properties[pocketSlug],
          pocket_slug: pocketSlug,
          updatedAt: new Date().toISOString()
        };

        if(
          !pocketData["/"] ||
          !metadata.pocket_properties[pocketSlug].property_id
        ) { return; }

        pocketData.property_hash = pocketData["/"].split("/").find(segment => segment.startsWith("hq__"));
        delete pocketData["."];
        delete pocketData["/"];

        batch.set(db.doc(`${collection}-properties/${pocketSlug}`), pocketData, {merge: true});
        batch.set(db.doc(`${collection}-properties/${metadata.pocket_properties[pocketSlug].property_id}`), pocketData, {merge: true});
      } catch(error) {
        functions.logger.error(`${network}/${mode}: Error updating pocket property ${pocketSlug}`);
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

  console.timeEnd(`${network}/${mode}: Updating pocket properties and domain map`);
}

// Retrieve meta tags for property, updating only if hash has been updated
async function GetPocketMetaTags({db, network, mode, pocketSlugOrId}) {
  try {
    const collection = `pocket-${network}-${mode}`;
    let pocketData = (await db.doc(`${collection}-properties/${pocketSlugOrId}`).get())?.data();

    if(!pocketData || new Date(pocketData.updatedAt).getTime() < Date.now() - 30000) {
      await UpdateProperties({db, network, mode});
      pocketData = (await db.doc(`${collection}-properties/${pocketSlugOrId}`).get())?.data();
    }

    if(!pocketData) { return; }

    let metaTags;
    try {
      metaTags = JSON.parse(pocketData.meta_tags);

      // Meta tags from different property version
      if(metaTags?.property_hash !== pocketData.property_hash) {
        metaTags = undefined;
      }
    } catch(error) {}

    if(!metaTags) {
      console.time(`${network}/${mode}: Updating pocket property meta tags ${pocketSlugOrId}`);
      functions.logger.info(`${network}/${mode}: Updating pocket property meta tags ${pocketSlugOrId}`);
      // Update property data
      metaTags = (await RetrieveMetadata({
        network,
        mode,
        versionHash: pocketData.property_hash,
        path: "/public/asset_metadata/info/meta_tags"
      })) || {};

      metaTags.property_hash = pocketData.property_hash;

      await db.doc(`${collection}-properties/${pocketData.property_id}`)
        .set({meta_tags: JSON.stringify(metaTags)}, {merge: true});
      if(pocketData.property_slug) {
        await db.doc(`${collection}-properties/${pocketData.property_slug}`)
          .set({meta_tags: JSON.stringify(metaTags)}, {merge: true});
      }

      console.timeEnd(`${network}/${mode}: Updating pocket property meta tags ${pocketSlugOrId}`);
    }

    return metaTags;
  } catch(error) {
    functions.logger.error(`${network}/${mode}: Error retrieving pocket property meta tags for ${pocketSlugOrId}`);
    functions.logger.error(error);
  }
}

async function FindPocketSlugOrId({db, host, path, network, mode}) {
  const collection = `pocket-${network}-${mode}`;

  path = path.split("?")[0].replace(/\/$/, "");

  let pocketSlugOrId = path
    .replace(/^\//, "")
    .split("/")
    .filter(segment => segment)[0];

  let googleVerificationId, isCustomDomain;
  let redirect = false;
  try {
    const domainMap = (await db.doc(`${collection}-domains/${host}`).get())?.data();

    if(domainMap) {
      isCustomDomain = true;
      const domainMapSlug = domainMap.property_slug;
      googleVerificationId = domainMap.google_site_verification_id;
      redirect = path === "/";
      pocketSlugOrId = domainMapSlug;
    }
  } catch(error) {
    functions.logger.error(`${network}/${mode}: Error parsing properties slug from path ${path}`);
    functions.logger.error(error);
  }

  return { isCustomDomain, pocketSlugOrId, redirect, googleVerificationId };
}

const Sitemap = ({protocol, host, pocketSlugOrId, metaTags}) => {
  const url = new URL(protocol + "://" + host);

  let content = [];
  content.push("<url>");
  content.push(`<loc>${url.toString()}</loc>`);
  metaTags.updated_at && content.push(`<lastmod>${metaTags.updated_at}</lastmod>`);
  content.push("</url>");

  if(pocketSlugOrId) {
    url.pathname = pocketSlugOrId;
    content.push("<url>");
    content.push(`<loc>${url.toString()}</loc>`);
    metaTags.updated_at && content.push(`<lastmod>${metaTags.updated_at}</lastmod>`);
    content.push("</url>");
  }

  return (`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${content.join("\n")}\n</urlset>`);
};

// Note: Cannot write dynamic robots.txt with firebase functions
// https://github.com/firebase/firebase-tools/issues/3734

async function PocketMetadata(db, req, res) {
  const protocol = req.headers["X-Forwarded-Protocol"] || req.protocol || "https";
  let host = req.headers["x-forwarded-host"] || req.hostname;
  let path = req.headers["x-forwarded-url"] || req.originalUrl;

  const network = ["dv3", "demov3", "localhost", "127.0.0.1"].find(demoHost => host.includes(demoHost)) ? "demov3" : "main";
  const mode = network === "demov3" || host.includes("-dev") || host.includes(".dev") || host.includes("stg.") ? "staging" : "production";

  const { isCustomDomain, pocketSlugOrId, redirect, googleVerificationId } = await FindPocketSlugOrId({db, host, path, network, mode});

  if(redirect) {
    const url = new URL(protocol + "://" + host);
    url.pathname = pocketSlugOrId;
    res.redirect(302, url.toString());
    return;
  }

  let metaTags;
  if(pocketSlugOrId) {
    metaTags = await GetPocketMetaTags({db, network, mode, pocketSlugOrId});
  }

  metaTags = metaTags || WALLET_DEFAULTS;

  if(path === "/sitemap.xml") {
    res.setHeader("content-type", "application/xml");
    res.status(200).send(Sitemap({protocol, host, pocketSlugOrId, metaTags}));
    return;
  }

  const url = new URL(protocol + "://" + host);
  url.pathname = path;

  let html = fs.readFileSync(Path.resolve(__dirname, "./index-pocket-template.html")).toString();
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

  html = html.replaceAll("@@pocketSlug@@", pocketSlugOrId);
  html = html.replaceAll("@@pocketHash@@", metaTags?.property_hash);

  html = html.replaceAll("@@additionalContent@@", additionalContent);

  // Inject metadata
  res.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=1800");
  res.status(200).send(html);

  return true;
}

async function GeneratePocketIndex(db, req, res) {
  try {
    return await PocketMetadata(db, req, res);
  } catch(error) {
    functions.logger.error("Error updating pocket property metadata:");
    functions.logger.error(error);
  }
}

module.exports = GeneratePocketIndex;
