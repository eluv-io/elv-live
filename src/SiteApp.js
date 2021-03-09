import React, {Suspense, lazy} from "react";
import {inject, observer} from "mobx-react";
import {Switch} from "react-router";
import {Route, Redirect} from "react-router-dom";

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

import "Styles/site-app.scss";
import SitePage from "Common/SitePage";
import {PageLoader} from "Common/Loaders";
import Navigation from "Layout/Navigation";

@inject("rootStore")
@inject("siteStore")
@observer
class SiteApp extends React.Component {
  async componentDidMount() {
    await this.props.rootStore.InitializeClient();
    await this.props.siteStore.LoadMainSite();
  }

  /* Site specific */
  SiteRoutes() {
    if(!this.props.siteStore.siteLoaded) {
      return <PageLoader />;
    }

    return (
      <Switch>
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/stream" component={SitePage(Stream, false)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/success/:email/:id" component={SitePage(Success)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/code" component={SitePage(CodeAccess)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/support" component={SitePage(Support)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug" component={SitePage(Event)} />

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    );
  }

  render() {
    return (
      <div className={`site-app ${this.props.siteStore.darkMode ? "dark" : ""}`}>
        { this.SiteRoutes() }
      </div>
    );
  }
}

export default SiteApp;
