const functions = require("firebase-functions");
const date = require("date");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");


let WalletConfiguration = {
  demo: {
    configUrl: "https://demov3.net955210.contentfabric.io/config",
    contentUrl: "https://demov3.net955210.contentfabric.io/s/demov3",
    staging: {
      siteId: "iq__2gkNh8CCZqFFnoRpEUmz7P3PaBQG",
      libId: "ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD",
    }
  },
  main: {
    configUrl: "https://main.net955305.contentfabric.io/config",
    contentUrl: "https://main.net955305.contentfabric.io/s/main",
    staging: {
      siteId: "iq__inauxD1KLyKWPHargCWjdCh2ayr",
      libId: "ilib____________",
    },
    production: {
      siteId: "iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R",
      libId: "ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9",
    }
  }
};


const getNetworkPrefix = (req) => {
  const originalHost = req.headers["x-forwarded-host"] || "";
  let network = originalHost.indexOf("demov3") > -1 ? "demo" : "main";
  let mode = originalHost.indexOf("stg") > -1 ? "staging" : "production";

  // "qlibs/ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9/q/iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R/";
  return WalletConfiguration[network].contentUrl + "/qlibs/" + WalletConfiguration[network][mode].libId
      + "/q/" + WalletConfiguration[network][mode].siteId;
};

// unused until cache invalidation supported
let elv_live_data_cache = {};

//
// Firebase cloud functions definitions for rewrite support
// https://firebase.google.com/docs/functions/write-firebase-functions
//

// ping: header dump utility
exports.ping = functions.https.onRequest((req, res) => {
  functions.logger.info("headers dumper", {host: req.hostname});

  let meta = "";
  let body = "";
  for(const [key, value] of Object.entries(req.headers)) {
    meta = meta + "\t<meta property=\"og:" + key + "\" content=\"" + value + "\" />\n";
    body = body + "\tmeta property=\"og:" + key + "\" content=\"" + value + "\"<br/>\n";
  }

  res.status(200).send(`<!doctype html>
    <head> 
      <title>functions test</title> 
      ${meta}
    </head>
    <body> 
      ${req.hostname} / ${req.url} / ${req.href} / ${req.referrer} / ${req.originalUrl} / ${req.path}<br/>
      ${body}
    </body> </html> `);
});

exports.load_elv_live_data = functions.https.onRequest(async (req, res) => {
  try {
    let sites = await loadElvLiveAsync(req);
    functions.logger.info("loaded elv-live sites", sites);

    res.status(200).send(sites);
  } catch(error) {
    functions.logger.info(error);
    res.status(500).send("something went wrong.");
  }
});

// create index.html with metadata based on url path
exports.create_index_html = functions.https.onRequest(async (req, res) => {
  let html = fs.readFileSync(Path.resolve(__dirname, "./index-template.html")).toString();

  let sites = await loadElvLiveAsync(req);

  // Inject metadata
  const originalHost = req.headers["x-forwarded-host"] || req.hostname;
  const originalUrl = req.headers["x-forwarded-url"] || req.url;
  const fullPath = originalHost + originalUrl;
  const meta = "<meta property=\"rewritten-from\" content=\"" + fullPath + "\" />\n";

  let title = "Eluvio Media Wallet";
  let description = "Eluvio Media wallet accessed from " + fullPath;
  let image = "https://live.eluv.io/875458425032ed6b77076d67678a20a1.png";

  for(const [key, value] of Object.entries(sites)) {
    functions.logger.info("checking", key);
    if(originalUrl.indexOf(key) > -1) {
      functions.logger.info("match", key);
      title = value.title;
      description = value.description;
      image = value.image;
      break;
    }
  }

  html = html.replace(/@@TITLE@@/g, title);
  html = html.replace(/@@DESCRIPTION@@/g, description);
  html = html.replace(/@@IMAGE@@/g, image);
  html = html.replace(/@@ADDITIONAL_META@@/g, meta);

  res.status(200).send(html);
});


const loadElvLiveAsync = async (req) => {
  const cache_date = elv_live_data_cache?.date;
  if(!cache_date) {
    functions.logger.info("cache is empty");
  } else {
    functions.logger.info("cache is from", new Date(cache_date));
  }

  const tenantsUrl = getNetworkPrefix(req) +
      "/meta/public/asset_metadata/tenants";
  functions.logger.info("using tenants url", tenantsUrl);

  const resp = await axios.get(tenantsUrl + "/?link_depth=2");
  const tenantData = resp.data;

  let tenantsAndSite = {};
  for(const [tenant_name, tenant_obj] of Object.entries(tenantData)) {
    let sites = tenant_obj["sites"];
    for(const [site_name, _] of Object.entries(sites)) {
      functions.logger.info("found", tenant_name, site_name);
      tenantsAndSite[tenant_name + "/" + site_name] = { tenant: tenant_name, site: site_name };
    }
  }
  functions.logger.info("returning tenants+sites", tenantsAndSite);

  let ret = {};
  for(const [_, tenantAndSite] of Object.entries(tenantsAndSite)) {
    const tenant_name = tenantAndSite.tenant;
    const site_name = tenantAndSite.site;
    functions.logger.info("load site", tenant_name, site_name);

    const site = tenantData[tenant_name]["sites"][site_name]["info"];
    const event_info = site["event_info"] || {};

    const title = event_info["event_title"] || "";
    const description = event_info["description"] || "";
    const image = tenantsUrl + "/" + tenant_name + "/sites/" + site_name +
      "/info/event_images/hero_background?width=1200";

    ret[tenant_name + "/" + site_name] = {
      "title": title,
      "description": description,
      "image": image,
    };
    ret[site_name] = {
      "title": title,
      "description": description,
      "image": image,
    };
  }

  const featuredEventsUrl = getNetworkPrefix(req) +
      "/meta/public/asset_metadata/featured_events";
  functions.logger.info("using features_events url", featuredEventsUrl);

  const fe = await axios.get(featuredEventsUrl);
  const featuredEventData = fe.data;

  for(const [idx, event] of Object.entries(featuredEventData)) {
    for(const [eventName, eventData] of Object.entries(event)) {
      functions.logger.info("load featured_event", eventName);
      const fe = eventData["info"];
      const event_info = fe["event_info"] || {};

      const title = event_info["event_title"] || "";
      const description = event_info["description"] || "";
      const image = featuredEventsUrl + "/" + idx + "/" + eventName +
        "/info/event_images/hero_background?width=1200";

      ret[eventName] = {
        "title": title,
        "description": description,
        "image": image,
      };
    }
  }

  functions.logger.info("elv-live site metadata", ret);
  elv_live_data_cache = ret;
  elv_live_data_cache["date"] = new Date().getTime();
  functions.logger.info("elv_live_data_cache date", elv_live_data_cache["date"]);
  return ret;
};