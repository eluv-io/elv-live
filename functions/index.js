const functions = require("firebase-functions");
require("date");
const fs = require("fs");
const Path = require("path");
const axios = require("axios");

//
// Firebase cloud functions
// docs: https://firebase.google.com/docs/functions/
// logs: https://console.cloud.google.com/logs/query
//


//
// Firebase cloud function definitions for elv-live rewrite support
//

const WALLET_DEFAULTS = {
  "og:title": "Eluvio Media Wallet",
  "og:description": "The Eluvio Media Wallet is your personal vault for media collectibles, and your gateway to browse the best in premium content distributed directly by its creators and publishers.",
  "og:image": "https://wallet.contentfabric.io/public/Logo.png",
  "og:image:alt": "Eluvio"
};

const MaxCacheAge = 1000 * 60 * 5; // 5 min in millis
let elvLiveDataCache = {};
const FabricConfiguration = {
  demov3: {
    configUrl: "https://demov3.net955210.contentfabric.io/config",
    staging: {
      siteId: "iq__2gkNh8CCZqFFnoRpEUmz7P3PaBQG",
      libId: "ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD",
    }
  },
  main: {
    configUrl: "https://main.net955305.contentfabric.io/config",
    staging: {
      siteId: "iq__inauxD1KLyKWPHargCWjdCh2ayr",
      libId: "ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9",
    },
    production: {
      siteId: "iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R",
      libId: "ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9",
    }
  }
};

const B64 = str => Buffer.from(str, "utf-8").toString("base64");
const FromB64 = str => Buffer.from(str, "base64").toString("utf-8");

const getNetworkAndMode = (req) => {
  const originalHost = req.headers["x-forwarded-host"] || req.hostname;
  const network = originalHost.indexOf("demov3") > -1 ? "demov3" : "main";
  const mode = originalHost.indexOf("stg") > -1 || network == "demov3" ? "staging" : "production";

  // allow testing instance to hit both configs
  if(originalHost == "elv-rewriter.web.app") { return ["main", "staging"]; }
  if(originalHost == "elv-rewriter.firebaseapp.com") {return ["demov3", "staging"]; }

  return [network, mode];
};

const getNetworkPrefix = async (req) => {
  const [network, mode] = getNetworkAndMode(req);
  functions.logger.info("network/mode:", network, mode);
  const prefix = await getFabricApi(network);

  return [
    prefix + "/s/" + network +
    "/qlibs/" + FabricConfiguration[network][mode].libId +
    "/q/" + FabricConfiguration[network][mode].siteId,
    network + ":" + mode
  ];
};

const getFabricApi = async (network) => {
  const configUrl = FabricConfiguration[network].configUrl;

  const resp = await axios.get(configUrl);

  return resp.data["network"]["seed_nodes"]["fabric_api"][0];
};


// load elv-live data from network or cache
const loadElvLiveAsync = async (req) => {
  const [networkPrefix, networkId] = await getNetworkPrefix(req);
  let elvLiveData = elvLiveDataCache[networkId];

  const cache_date = elvLiveData?.date;
  if(!cache_date) {
    functions.logger.info("cache is empty");
  } else {
    const age_millis = Date.now() - cache_date;
    functions.logger.info("cache is from", new Date(cache_date), "aged", age_millis/1000, "sec");
    if(age_millis > MaxCacheAge) {
      functions.logger.info("cache is old, re-fetch");
    } else {
      if(elvLiveData.data)
        return elvLiveData.data;
    }
  }

  // load sites
  const tenantsUrl = networkPrefix + "/meta/public/asset_metadata/tenants";
  functions.logger.info("using tenants url", tenantsUrl);

  const resp = await axios.get(tenantsUrl + "/?link_depth=2&resolve_ignore_errors=true");
  const tenantData = resp.data;

  let tenantsAndSite = {};
  for(const [tenant_name, tenant_obj] of Object.entries(tenantData)) {
    let sites = tenant_obj?.["sites"];
    for(const [site_name, _] of Object.entries(sites)) {
      tenantsAndSite[tenant_name + "/" + site_name] = { tenant: tenant_name, site: site_name };
    }
  }
  functions.logger.info("returning tenants+sites", tenantsAndSite);

  let ret = {};

  for(const tenantAndSite of Object.values(tenantsAndSite)) {
    const tenant_name = tenantAndSite.tenant;
    const site_name = tenantAndSite.site;
    //functions.logger.info("load site", tenant_name, site_name);

    const site = tenantData?.[tenant_name]?.["sites"]?.[site_name]?.["info"] || {};
    const event_info = site?.["event_info"] || {};

    const title = event_info?.["event_title"] || "";
    const description = event_info?.["description"] || "";
    const image = tenantsUrl + "/" + tenant_name + "/sites/" + site_name +
      "/info/event_images/hero_background?width=1200";
    let favicon = "";
    if("favicon" in site && site.favicon != null) {
      favicon = tenantsUrl + "/" + tenant_name + "/sites/" + site_name + "/info/favicon";
    }

    ret[tenant_name + "/" + site_name] = {
      "title": title,
      "description": description,
      "image": image,
      "favicon": favicon,
    };
  }

  // load featured events
  const featuredEventsUrl = networkPrefix + "/meta/public/asset_metadata/featured_events";
  functions.logger.info("using featured_events url", featuredEventsUrl);

  const fe = await axios.get(featuredEventsUrl);
  const featuredEventData = fe.data;

  for(const [idx, event] of Object.entries(featuredEventData)) {
    for(const [eventName, eventData] of Object.entries(event)) {
      //functions.logger.info("load featured_event", eventName);
      const fe = eventData?.["info"] || {};
      const event_info = fe?.["event_info"] || {};

      const title = event_info?.["event_title"] || "";
      const description = event_info?.["description"] || "";
      const image = featuredEventsUrl + "/" + idx + "/" + eventName +
        "/info/event_images/hero_background?width=1200";
      let favicon = "";
      if("favicon" in fe && fe.favicon != null) {
        favicon = featuredEventsUrl + "/" + idx + "/" + eventName + "/info/favicon";
      }

      ret[eventName] = {
        "title": title,
        "description": description,
        "image": image,
        "favicon": favicon,
      };
    }
  }

  // load DNS info
  const dnsMappingsUrl = networkPrefix + "/meta/public/asset_metadata/info/domain_map";
  functions.logger.info("using domain_map url", dnsMappingsUrl);

  const dr = await axios.get(dnsMappingsUrl);
  const dnsMappings = dr.data;
  functions.logger.info("domain map", {"domain-map": dnsMappings});

  dnsMappings.forEach(domain => {
    const t = domain["tenant_slug"];
    const e = domain["event_slug"];
    const path = t == "" ? e : t + "/" + e;
    if(ret[path]) {
      ret[domain.domain] = { ...(ret[path]) };
    }
  });

  elvLiveData = { data: ret };
  elvLiveData["date"] = new Date().getTime();
  functions.logger.info("elvLiveData", elvLiveData);

  elvLiveDataCache[networkId] = elvLiveData;
  return ret;
};


// Firebase Function Definitions

// health check
exports.ping = functions.https.onRequest((req, res) => {
  functions.logger.info("headers dumper", {host: req.hostname});
  let body = "";
  for(const [key, value] of Object.entries(req.headers)) {
    body = body + "\t header=\"" + key + "\" val=\"" + value + "\"<br/>\n";
  }

  res.status(200).send(`<!DOCTYPE html>
    <html> <head> <title>cloud functions headers test</title> </head>
    <body> hostname ${req.hostname} /
           url ${req.url} /
           href ${req.href} /
           referrer ${req.referrer} /
           originalUrl ${req.originalUrl} /
           path ${req.path}<br/>
      ${body} </body> </html>`);
});

//
// Firebase cloud function definitions for Previewable Share URLs
// https://github.com/qluvio/elv-apps-projects/issues/210
//

// Read `og` parameter if present, and inject corresponding meta tags into html
exports.create_previewable_link = functions.https.onRequest(async (req, res) => {
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

  // Inject metadata
  html = html.replace(/@@META@@/g, meta);
  res.status(200).send(html);
});

// load and return elv-live data for this network/mode
exports.load_elv_live_data = functions.https.onRequest(async (req, res) => {
  try {
    let sites = await loadElvLiveAsync(req);
    functions.logger.info("loaded elv-live sites", {sites: sites});
    res.status(200).send(sites);
  } catch(error) {
    functions.logger.info(error);
    res.status(500).send("something went wrong.");
  }
});

// create index.html with metadata based on url path
exports.create_index_html = functions.https.onRequest(async (req, res) => {
  if(req.url.endsWith("robots.txt")) {
    res.status(200).send("User-agent: *\nDisallow: \nAllow: /\n");
    return;
  }

  let html = fs.readFileSync(Path.resolve(__dirname, "./index-live-template.html")).toString();

  let sites = {};
  try {
    sites = await loadElvLiveAsync(req);
  } catch(e) {
    functions.logger.error("cannot loadElvLiveAsync", e);
  }

  const originalHost = req.headers["x-forwarded-host"] || req.hostname;
  let originalUrl = req.headers["x-forwarded-url"] || req.url;
  const fullPath = originalHost + originalUrl;
  if(originalUrl.indexOf("?") > 0) {
    originalUrl = originalUrl.slice(0, originalUrl.indexOf("?"));
  }
  if(originalUrl.endsWith("/")) {
    originalUrl = originalUrl.slice(0, -1);
  }

  let title = "Eluvio: Creators of The Content Fabric";
  let description = "Next Gen Content Distribution: Ultra Fast, Efficient, and Tamper Proof. Open, Decentralized, Scalable and Secure. Built for the Third Generation Internet.";
  let image = "https://main.net955305.contentfabric.io/s/main/q/hq__2MQf6oJwqXdyrNDu3WaA19CiFoeK6W2RhiPZnPEmKLJ3CUoTFuTB25YuzFxsSQfomnPEMKpSVT/files/eluv.io/Eluvio-Share-Image.jpg";
  let favicon = "/favicon.png";

  // Inject metadata
  functions.logger.info("compare against incoming host", originalHost, "and url", originalUrl);
  functions.logger.info("checking sites", Object.keys(sites));
  for(const [site, site_metadata] of Object.entries(sites)) {
    // match dns hostname, or match a path
    if(originalHost == site || originalUrl == ("/" + site)) {
      functions.logger.info("match", site, site_metadata);
      title = site_metadata.title?.replaceAll("\"", "&quot;") || title;
      description = site_metadata.description?.replaceAll("\"", "&quot;");
      image = site_metadata.image || image;
      console.log("image", image)
      favicon = site_metadata.favicon || favicon;
      break;
    }
  }

  html = html.replace(/@@TITLE@@/g, title);
  html = html.replace(/@@DESCRIPTION@@/g, description);
  html = html.replace(/@@IMAGE@@/g, image);
  html = html.replace(/@@FAVICON@@/g, favicon);
  html = html.replace(/@@REWRITTEN_FROM@@/g, fullPath);
  html = html.replace(/@@URL@@/g, "https://" + fullPath);

  res.status(200).send(html);
});

