import React, {Suspense, lazy, useEffect} from "react";
import {createRoot} from "react-dom/client";
import {inject, observer, Provider} from "mobx-react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
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
const Drop = MinLoadDelay(import("Pages/drop/Drop"));
const DropLanding = MinLoadDelay(import("Pages/drop/Landing"));

const RedirectToMain = () => {
  useEffect(() => {
    window.history.replaceState({}, null, "/");
    window.location.reload();
  }, []);

  return null;
};

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
          <Routes>
            <Route path="*" element={<PageLoader />} />
          </Routes>
        );
      }

      return (
        <>
          <Routes>
            <Route exact path="/:tenantSlug?/:siteSlug/event" element={<SitePage Component={Landing} darkHeader hideCheckout hideRedeem />} />
            <Route exact path="/:tenantSlug?/:siteSlug/stream" element={<SitePage Component={Stream} showHeader={false} />} />
            <Route exact path="/:tenantSlug?/:siteSlug/drop/:dropId/event" element={<SitePage Component={Drop} darkHeader hideZendesk hideCheckout hideRedeem />} />
            <Route exact path="/:tenantSlug?/:siteSlug/drop/:dropId" element={<SitePage Component={DropLanding} darkHeader hideCheckout hideRedeem transparent />} />
            { /* <Route exact path="/:tenantSlug?/:siteSlug/chat" element={<SitePage Component=hat} {showHeader={false} hideZendesk})} /> */ }
            <Route exact path="/:tenantSlug?/:siteSlug/offer/:offerId" element={<SitePage Component={Offer} />} />
            <Route exact path="/:tenantSlug?/:siteSlug/code" element={<SitePage Component={CodeAccess} />} />
            <Route exact path="/:tenantSlug?/:siteSlug/coupon-code" element={<SitePage Component={CodeAccess} />} />
            <Route exact path="/:tenantSlug?/:siteSlug/coupon-redeemed" element={<SitePage Component={Landing} darkHeader hideCheckout hideRedeem />} />
            <Route exact path="/:tenantSlug?/:siteSlug/support" element={<SitePage Component={Support} />} />
            <Route exact path="/:tenantSlug?/:siteSlug/faq" element={<SitePage Component={Support} />} />
            <Route path="/:tenantSlug?/:siteSlug/marketplace/*" element={<SitePage Component={Event} mainPage transparent showMarketplace />} />
            <Route path="/:tenantSlug?/:siteSlug/wallet/*" element={<SitePage Component={Event} mainPage transparent showMarketplace />} />

            <Route exact path="/:tenantSlug?/:siteSlug" element={<SitePage Component={Event} mainPage transparent />} />

            <Route path="*" element={<RedirectToMain />} />
          </Routes>
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


createRoot(document.getElementById("app")).render(
  <Provider {...Stores}>
    <SiteApp />
  </Provider>
);
