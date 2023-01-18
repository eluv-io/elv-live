// Set actual device height in viewport meta tag
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
  "/",
  "/partners",
  "/blockchain",
  "/partners"
];

const Load = async () => {
  const path = window.location.pathname;

  if(!("scrollBehavior" in document.documentElement.style)) {
    await import("scroll-behavior-polyfill");
  }

  if(path === "/careers") {
    window.location.href = "https://eluvio.workable.com/";
    return;
  }

  if(MAIN_SITE_PATHS.find(mainPath => path.startsWith(mainPath))) {
    await import("./main/MainApp");
  } else {
    await import("./SiteApp");
  }
};

Load();
