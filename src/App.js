import React, {Suspense, lazy} from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";

import * as Stores from "Stores";

import "Styles/common.scss";
import {PageLoader} from "Common/Loaders";

const MainApp = lazy(() => import("./MainApp"));
const SiteApp = lazy(() => import("./SiteApp"));

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <div className="app-container main-app-container">
              <Suspense fallback={<PageLoader/>}>
                <MainApp />
              </Suspense>
            </div>
          </Route>

          <Route>
            <div className="app-container site-app-container">
              <Suspense fallback={<PageLoader/>}>
                <SiteApp />
              </Suspense>
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    );
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

