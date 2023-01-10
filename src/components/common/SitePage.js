import React, {Suspense, useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "Common/AsyncComponent";
import {PageLoader} from "Common/Loaders";
import Navigation from "Layout/Navigation";
import InitializeEventData from "Utils/StructuredEventData";
import {ToggleZendesk} from "Utils/Misc";
import {Navigate, useParams, useResolvedPath} from "react-router";

const RedirectToMain = () => {
  useEffect(() => {
    window.history.replaceState({}, null, "/");
    window.location.reload();
  }, []);

  return null;
};

const SitePageComponent = inject("rootStore")(inject("siteStore")(observer(({rootStore, siteStore, Component, mainPage=false, transparent=false, showHeader=true, showMarketplace=false, darkHeader=false, hideCheckout=false, hideRedeem=false, hideZendesk=false, ...props}) => {
  const url = useResolvedPath("").pathname;
  const {tenantSlug, siteSlug} = useParams();

  const [slugIsValid, setSlugIsValid] = useState(false);

  useEffect(() => {
    if(showMarketplace) {
      rootStore.SetWalletPanelVisibility({visibility: "full"});
    }
  }, []);

  const featuredSite = siteStore.FeaturedSite(siteSlug);
  const isFeatured = featuredSite && !tenantSlug;
  const validTenant = siteStore.availableTenants.includes(tenantSlug);

  if(!isFeatured && !validTenant) {
    return <Navigate replace to="/" />;
  }

  if(hideZendesk) {
    ToggleZendesk(false);
  }

  return (
    <>
      { showHeader && siteStore.siteSlug ?
        <Navigation mainPage={mainPage} transparent={transparent} dark={darkHeader} hideCheckout={hideCheckout} hideRedeem={hideRedeem} /> : null }
        <Suspense fallback={<PageLoader />}>
          <AsyncComponent
            key={`site-page-${url}`}
            _errorBoundaryClassname="page-container error-page-container"
            Load={async () => {
              if(!isFeatured) {
                await siteStore.LoadTenant({slug: tenantSlug});
              }

              const validSlug = await siteStore.LoadSite({
                tenantSlug,
                siteSlug,
                fullLoad: true
              });

              try {
                InitializeEventData(siteStore);
              } catch(error) {
                // eslint-disable-next-line no-console
                console.error("Failed to initialize structured event data:");
                // eslint-disable-next-line no-console
                console.error(error);
              }

              if(siteStore.eventInfo.event_title) {
                document.title = `${siteStore.eventInfo.event_title} | Eluvio Live`;
              }

              setSlugIsValid(validSlug);
            }}
          >
            {
              slugIsValid ?
                <Component {...props} /> :
                <RedirectToMain />
            }
          </AsyncComponent>
        </Suspense>
    </>
  );
})));


export default SitePageComponent;
