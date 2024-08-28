const SetHeight = () => {
  const content = document.querySelector("meta[name=viewport]").content || "";
  let attributes = {};
  content.split(",").forEach(entry => {
    const [key, value] = entry.split("=");
    attributes[key.trim()] = (value || "").trim();
  });

  attributes.height = window.innerHeight;

  document.querySelector("meta[name=viewport]").content =
    Object.keys(attributes).map(key => `${key}=${attributes[key]}`).join(", ");
};

SetHeight();
window.addEventListener("resize", SetHeight);

const MAIN_SITE_PATHS = [
  //"/",
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

const Document = async (filename) => {
  const doc = await import("./main/static/documents/" + filename);
  const documentUrl = window.URL.createObjectURL(new Blob([doc.default], {type: "text/html"}));
  document.body.innerHTML = `<iframe src="${documentUrl}" style="width: 100%;height: 100vh;border: 0;overflow:auto" class="document"/>`;
  document.body.style.margin = "0";
};

const Load = async () => {
  const path = window.location.pathname;

  if(!("scrollBehavior" in document.documentElement.style)) {
    await import("scroll-behavior-polyfill");
  }

  if(path === "/careers") {
    window.location.href = "https://eluvio.workable.com/";
    return;
  }
  
  if(path === "/community") {
    window.location.href = "https://wallet.contentfabric.io/ibc";
  } else if(path === "/privacy") {
    Document("PrivacyPolicy.html");
  } else if(path === "/terms") {
    Document("Terms.html");
  } else if(path === "/platform-terms") {
    Document("PlatformServicesAgreement.html");
  } else if(path === "/" || MAIN_SITE_PATHS.find(mainPath => path.startsWith(mainPath))) {
    await import("./main/MainApp");
  } else {
    await import("./SiteApp");
  }
};

Load();
