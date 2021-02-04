import React, {Suspense, lazy} from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch} from "react-router";
import {BrowserRouter, Route, Redirect} from "react-router-dom";

// Ensure that if the app waits for loading, it shows the spinner for some minimum time to prevent annoying spinner flash
const MinLoadDelay = (Import, delay=500) => lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, delay));

  return Import;
});

const Support = MinLoadDelay(import("Support/Support"));
const CodeAccess = MinLoadDelay(import("Code/CodeAccess"));
const Event = MinLoadDelay(import("Event/Event"));
const Stream = MinLoadDelay(import("Stream/Stream"));
const Success = MinLoadDelay(import("Confirmation/Success"));

import {EluvioConfiguration} from "EluvioConfiguration";

import * as Stores from "Stores";

import "Styles/main.scss";
import SitePage from "Common/SitePage";
import {PageLoader} from "Common/Loaders";

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  async componentDidMount() {
    await this.props.rootStore.InitializeClient();
    await this.props.siteStore.LoadSiteSelector(EluvioConfiguration["object-id"]);
  }

  Routes() {
    if(!this.SiteLoaded()) {
      return <PageLoader />;
    }

    return (
      <Switch>
        <Route exact path="/:baseSlug?/:siteSlug/stream" component={SitePage(Stream)} />
        <Route exact path="/:baseSlug?/:siteSlug/success/:email/:id" component={SitePage(Success)} />
        <Route exact path="/:baseSlug?/:siteSlug/code" component={SitePage(CodeAccess)} />
        <Route exact path="/:baseSlug?/:siteSlug/support" component={SitePage(Support)} />
        <Route exact path="/:baseSlug?/:siteSlug" component={SitePage(Event)} />

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    );
  }

  SiteLoaded() {
    return this.props.rootStore.client && Object.keys(this.props.siteStore.availableSites).length > 0;
  }

  render() {
    return (
      <main className="app">
        <BrowserRouter>
          <Suspense fallback={<PageLoader/>}>
            { this.Routes() }
          </Suspense>
        </BrowserRouter>
      </main>
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

