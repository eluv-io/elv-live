import React, {lazy} from "react";
import {inject, observer} from "mobx-react";
import {Switch} from "react-router";
import {Route, BrowserRouter} from "react-router-dom";

// Ensure that if the app waits for loading, it shows the spinner for some minimum time to prevent annoying spinner flash
const MinLoadDelay = (Import, delay=500) => lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, delay));

  return Import;
});

const Support = MinLoadDelay(import("Support/Support"));
const CodeAccess = MinLoadDelay(import("Code/CodeAccess"));
const Event = MinLoadDelay(import("Event/Event"));
const Stream = MinLoadDelay(import("Stream/Stream"));
const Landing = MinLoadDelay(import("Stream/Landing"));
const Success = MinLoadDelay(import("Confirmation/Success"));

import "Styles/site-app.scss";
import SitePage from "Common/SitePage";
import {PageLoader} from "Common/Loaders";
import Collection from "Pages/collections/Collection";

@inject("rootStore")
@inject("siteStore")
@observer
class SiteApp extends React.Component {
  InitializeZendeskWidget() {
    if(document.getElementById("ze-snippet")) { return; }

    const zendeskImport = document.createElement("script");
    zendeskImport.id = "ze-snippet";
    zendeskImport.type = "text/javascript";
    zendeskImport.async = true;
    zendeskImport.src = "https://static.zdassets.com/ekr/snippet.js?key=cec6052c-e357-45e1-86b0-30f30e12eb85";
    document.body.appendChild(zendeskImport);
  }

  async componentDidMount() {
    this.InitializeZendeskWidget();

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
        <Route exact path="/:tenantSlug/collections/:collectionSlug" component={Collection} />

        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/event" component={SitePage(Landing, {invertHeader: true, hideCheckout: true, hideRedeem: true})} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/stream" component={SitePage(Stream, {showHeader: false})} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/success/:id" component={SitePage(Success)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/code" component={SitePage(CodeAccess)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug/support" component={SitePage(Support)} />
        <Route exact path="/:tenantSlug?/:baseSlug?/:siteSlug" component={SitePage(Event, {mainPage: true})} />

        <Route>
          <Route render={() => window.location.href = window.location.origin} />
        </Route>
      </Switch>
    );
  }

  render() {
    return (
      <div className={`site-app ${this.props.siteStore.darkMode ? "dark" : ""}`}>
        <BrowserRouter>
          { this.SiteRoutes() }
        </BrowserRouter>
      </div>
    );
  }
}

export default SiteApp;
