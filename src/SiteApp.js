import React, {lazy} from "react";
import {inject, observer} from "mobx-react";
import {Switch} from "react-router";
import {Route, BrowserRouter} from "react-router-dom";
import WalletFrame from "Pages/wallet/WalletFrame";
import Login from "Pages/login/index";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";
import "Styles/site-app.scss";
import SitePage from "Common/SitePage";
import {PageLoader} from "Common/Loaders";
import EluvioConfiguration from "../configuration";

// Ensure that if the app waits for loading, it shows the spinner for some minimum time to prevent annoying spinner flash
const MinLoadDelay = (Import, delay=500) => lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, delay));

  return Import;
});

const Support = MinLoadDelay(import("Support/Support"));
const CodeAccess = MinLoadDelay(import("Code/CodeAccess"));
const Event = MinLoadDelay(import("Event/Event"));
const Stream = MinLoadDelay(import("Stream/Stream"));
const Chat = MinLoadDelay(import("Stream/components/LiveChat"));
const Landing = MinLoadDelay(import("Stream/Landing"));
const Success = MinLoadDelay(import("Confirmation/Success"));
const Privacy = MinLoadDelay(import("Event/Privacy"));
const Terms = MinLoadDelay(import("Event/Terms"));
const Drop = MinLoadDelay(import("Pages/drop/Drop"));
const DropLanding = MinLoadDelay(import("Pages/drop/Landing"));

const Collection = MinLoadDelay(import("Pages/collections/Collection"));
const Collections = MinLoadDelay(import("Pages/collections/Collections"));

const baseUrl = new URL(window.location.origin);

const callbackUrl = new URL(baseUrl.toString());
callbackUrl.pathname = "/wallet/callback";

const logOutUrl = new URL(baseUrl.toString());
logOutUrl.pathname = "/wallet/logout";

const LoginPage = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore}) => {
  if(!rootStore.client) { return <PageLoader />; }

  return (
    <div className={`page-container login-route ${siteStore.loginCustomization.darkMode ? "login-route-dark" : "login-page"}`}>
      <Login callbackPage />
    </div>
  );
}))));

const LogOutHandler = inject("rootStore")(inject("siteStore")((observer(({rootStore, siteStore}) => {
  const auth0 = useAuth0();

  if(rootStore.loggedOut) {
    localStorage.setItem(
      "loginCustomization",
      JSON.stringify({
        redirectPath: window.location.pathname,
        ...siteStore.loginCustomization
      })
    );

    auth0.logout({
      returnTo: logOutUrl.toString()
    });
  }

  return null;
}))));


@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class SiteApp extends React.Component {
  InitializeZendeskWidget() {
    if(document.getElementById("ze-snippet")) { return; }

    const zendeskImport = document.createElement("script");
    zendeskImport.id = "ze-snippet";
    zendeskImport.type = "text/javascript";
    zendeskImport.async = true;
    zendeskImport.src = "https://static.zdassets.com/ekr/snippet.js?key=cec6052c-e357-45e1-86b0-30f30e12eb85";
    zendeskImport.addEventListener("load", () => {
      if(typeof zE === "undefined") { return; }

      zE("webWidget", "helpCenter:setSuggestions", { search: "eluvio" });
    });
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
      return (
        <Switch>
          <Route exact path="/wallet/callback" component={LoginPage} />
          <Route exact path="/wallet/logout" component={LoginPage} />

          <Route>
            <Route component={PageLoader} />
          </Route>
        </Switch>
      );
    }

    return (
      <Switch>
        <Route exact path="/wallet/callback" component={LoginPage} />
        <Route exact path="/wallet/logout" component={LoginPage} />

        <Route exact path="/:tenantSlug/collections" component={Collections} />
        <Route exact path="/:tenantSlug/collections/:collectionSlug" component={Collection} />

        <Route exact path="/:tenantSlug?/:siteSlug/event" component={SitePage(Landing, {darkHeader: true, hideCheckout: true, hideRedeem: true})} />
        <Route exact path="/:tenantSlug?/:siteSlug/stream" component={SitePage(Stream, {showHeader: false})} />
        <Route exact path="/:tenantSlug?/:siteSlug/drop/:dropId/event" component={SitePage(Drop, {darkHeader: true, hideZendesk: true, hideCheckout: true, hideRedeem: true})} />
        <Route exact path="/:tenantSlug?/:siteSlug/drop/:dropId" component={SitePage(DropLanding, {darkHeader: true, hideCheckout: true, hideRedeem: true})} />
        <Route exact path="/:tenantSlug?/:siteSlug/chat" component={SitePage(Chat, {showHeader: false, hideZendesk: true})} />
        <Route exact path="/:tenantSlug?/:siteSlug/success/:id" component={SitePage(Success)} />
        <Route exact path="/:tenantSlug?/:siteSlug/code" component={SitePage(CodeAccess)} />
        <Route exact path="/:tenantSlug?/:siteSlug/coupon-code" component={SitePage(CodeAccess)} />
        <Route exact path="/:tenantSlug?/:siteSlug/coupon-redeemed" component={SitePage(Landing, {darkHeader: true, hideCheckout: true, hideRedeem: true})} />
        <Route exact path="/:tenantSlug?/:siteSlug/support" component={SitePage(Support)} />
        <Route exact path="/:tenantSlug?/:siteSlug/privacy" component={SitePage(Privacy)} />
        <Route exact path="/:tenantSlug?/:siteSlug/terms" component={SitePage(Terms)} />
        <Route exact path="/:tenantSlug?/:siteSlug" component={SitePage(Event, {mainPage: true})} />

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
          <Auth0Provider
            domain={EluvioConfiguration["auth0-domain"] || "prod-elv.us.auth0.com"}
            clientId={EluvioConfiguration["auth0-configuration-id"] || "ONyubP9rFI5BHzmYglQKBZ1bBbiyoB3S"}
            redirectUri={callbackUrl.toString()}
            useRefreshTokens
            darkMode={this.props.siteStore.loginCustomization.darkMode}
          >
            { this.SiteRoutes() }
            <WalletFrame />
            <LogOutHandler />
          </Auth0Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default SiteApp;
