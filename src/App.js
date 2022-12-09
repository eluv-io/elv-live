import React, {Suspense, lazy} from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";

import * as Stores from "Stores";

import "Styles/common.scss";
import {PageLoader} from "Common/Loaders";

const MainApp = lazy(() => import("./MainApp"));
const SiteApp = lazy(() => import("./SiteApp"));

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

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  async componentDidMount() {
    if(!("scrollBehavior" in document.documentElement.style)) {
      await import("scroll-behavior-polyfill");
    }

    SetHeight();
    window.addEventListener("resize", SetHeight);
  }

  render() {
    if(window.location.pathname === "/careers") {
      window.location.href = "https://eluvio.workable.com/";
      return null;
    }

    const mainPages = ["/", "/partners", "/technology", "/blockchain", "/next", "/contact", "/terms", "/privacy", "/news", "/careers"];

    let mainSite = mainPages.includes(window.location.pathname);
    if(window.location.pathname.startsWith("/wallet")) {
      mainSite = mainPages.includes(sessionStorage.getItem("redirectPath") || "");
    }

    if(mainSite) {
      // Main site
      return (
        <div key={`main-page-${this.props.rootStore.baseKey}`} className="app-container main-app-container">
          <Suspense fallback={<PageLoader/>}>
            <MainApp />
          </Suspense>
        </div>
      );
    } else {
      // Event site
      return (
        <div key={`main-page-${this.props.rootStore.baseKey}`} className="app-container site-app-container">
          <Suspense fallback={<PageLoader/>}>
            <SiteApp />
          </Suspense>
        </div>
      );
    }
  }
}

render(
  (
    <Provider {...Stores}>
      <App />
    </Provider>
  ),
  document.getElementById("app")
);

