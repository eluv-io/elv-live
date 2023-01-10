import React, {Suspense, lazy} from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Switch} from "react-router";
import {Route, BrowserRouter} from "react-router-dom";
import "Styles/site-app.scss";
import SitePage from "Common/SitePage";
import {PageLoader} from "Common/Loaders";
import WalletFrame from "Pages/wallet/WalletFrame";
import * as Stores from "Stores";

// Ensure that if the app waits for loading, it shows the spinner for some minimum time to prevent annoying spinner flash
const MinLoadDelay = (Import, delay=500) => lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, delay));

  return Import;
});

const Support = MinLoadDelay(import("Support/Support"));
const CodeAccess = MinLoadDelay(import("Code/CodeAccess"));
const Offer = MinLoadDelay(import("Code/Offer"));
const Event = MinLoadDelay(import("Event/Event"));
const Stream = MinLoadDelay(import("Stream/Stream"));
//const Chat = MinLoadDelay(import("Stream/components/LiveChat"));
const Landing = MinLoadDelay(import("Stream/Landing"));
const Success = MinLoadDelay(import("Confirmation/Success"));
const Privacy = MinLoadDelay(import("Event/Privacy"));
const Terms = MinLoadDelay(import("Event/Terms"));
const Drop = MinLoadDelay(import("Pages/drop/Drop"));
const DropLanding = MinLoadDelay(import("Pages/drop/Landing"));

const SiteApp = inject("rootStore")(
  inject("siteStore")(inject("cartStore")(observer(class SiteApp extends React.Component {
    async componentDidMount() {
      this.props.rootStore.SetApp("site");

      await this.props.rootStore.InitializeClient();
      await this.props.siteStore.LoadMainSite();
    }

    /* Site specific */
    SiteRoutes() {
      if(!this.props.siteStore.siteLoaded) {
        return (
          <Switch>
            <Route>
              <Route component={PageLoader} />
            </Route>
          </Switch>
        );
      }

      return (
        <>
          <Switch>
            <Route exact path="/:tenantSlug?/:siteSlug/event" component={SitePage(Landing, {darkHeader: true, hideCheckout: true, hideRedeem: true})} />
            <Route exact path="/:tenantSlug?/:siteSlug/stream" component={SitePage(Stream, {showHeader: false})} />
            <Route exact path="/:tenantSlug?/:siteSlug/drop/:dropId/event" component={SitePage(Drop, {darkHeader: true, hideZendesk: true, hideCheckout: true, hideRedeem: true})} />
            <Route exact path="/:tenantSlug?/:siteSlug/drop/:dropId" component={SitePage(DropLanding, {darkHeader: true, hideCheckout: true, hideRedeem: true, transparent: true})} />
            { /* <Route exact path="/:tenantSlug?/:siteSlug/chat" component={SitePage(Chat, {showHeader: false, hideZendesk: true})} /> */ }
            <Route exact path="/:tenantSlug?/:siteSlug/success/:id" component={SitePage(Success)} />
            <Route exact path="/:tenantSlug?/:siteSlug/offer/:offerId" component={SitePage(Offer)} />
            <Route exact path="/:tenantSlug?/:siteSlug/code" component={SitePage(CodeAccess)} />
            <Route exact path="/:tenantSlug?/:siteSlug/coupon-code" component={SitePage(CodeAccess)} />
            <Route exact path="/:tenantSlug?/:siteSlug/coupon-redeemed" component={SitePage(Landing, {darkHeader: true, hideCheckout: true, hideRedeem: true})} />
            <Route exact path="/:tenantSlug?/:siteSlug/support" component={SitePage(Support)} />
            <Route exact path="/:tenantSlug?/:siteSlug/privacy" component={SitePage(Privacy)} />
            <Route exact path="/:tenantSlug?/:siteSlug/terms" component={SitePage(Terms)} />
            <Route path="/:tenantSlug?/:siteSlug/marketplace" component={SitePage(Event, {mainPage: true, transparent: true, showMarketplace: true})} />
            <Route exact path="/:tenantSlug?/:siteSlug" component={SitePage(Event, {mainPage: true, transparent: true})} />

            <Route>
              <Route render={() => window.location.href = window.location.origin} />
            </Route>
          </Switch>
        </>
      );
    }

    render() {
      return (
        <div key={`main-page-${this.props.rootStore.baseKey}`} className="app-container site-app-container">
          <Suspense fallback={<PageLoader/>}>
            <div className={`site-app ${this.props.siteStore.darkMode ? "dark" : ""}`}>
              <BrowserRouter>
                { this.SiteRoutes() }
              </BrowserRouter>

              <WalletFrame />
            </div>
          </Suspense>
        </div>
      );
    }
  })))
);


render(
  (
    <Provider {...Stores}>
      <SiteApp />
    </Provider>
  ),
  document.getElementById("app")
);
