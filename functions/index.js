const functions = require("firebase-functions");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");

const Networks = {
  main: "https://main.net955305.contentfabric.io/s/main/",
  demo: "https://demov3.net955210.contentfabric.io/s/demov3/",
};

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
    let sites = await loadElvLiveAsync();
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

  let sites = await loadElvLiveAsync();

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


const loadElvLiveAsync = async () => {

  const tenantsUrl = Networks.main +
    "qlibs/ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9/" +
    "q/iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R/meta/public/asset_metadata/tenants";

  const resp = await axios.get(tenantsUrl + "/?link_depth=2");
  const tenantData = resp.data;

  let tenantsAndSite = {};
  for(const [tenant_name, tenant_obj] of Object.entries(tenantData)) {
    let sites = tenant_obj["sites"];
    for(const [site_name, _] of Object.entries(sites)) {
      functions.logger.info("found", tenant_name, site_name);
      tenantsAndSite[tenant_name] = site_name;
    }
  }
  functions.logger.info("returning tenants", tenantsAndSite);

  let ret = {};
  for(const [tenant_name, site_name] of Object.entries(tenantsAndSite)) {
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

  const featuredEventsUrl = Networks.main +
    "qlibs/ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9/" +
    "q/iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R/meta/public/asset_metadata/featured_events";

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
  return ret;
};