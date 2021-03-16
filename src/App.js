import React, {Suspense, lazy} from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";

import * as Stores from "Stores";

import "Styles/common.scss";
import {PageLoader} from "Common/Loaders";

const MainApp = lazy(() => import("./MainApp"));
const SiteApp = lazy(() => import("./SiteApp"));

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  async componentDidMount() {
    if(!("scrollBehavior" in document.documentElement.style)) {
      await import("scroll-behavior-polyfill");
    }
  }

  render() {
    const mainPages = ["/", "/partners", "/technology", "/support", "/contact", "/terms", "/privacy"];

    if(mainPages.includes(window.location.pathname)) {
      // Main site
      return (
        <div className="app-container main-app-container">
          <Suspense fallback={<PageLoader/>}>
            <MainApp />
          </Suspense>
        </div>
      );
    } else {
      // Event site
      return (
        <div className="app-container site-app-container">
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

