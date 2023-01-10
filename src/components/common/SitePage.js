import React, {Suspense} from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "Common/AsyncComponent";
import {Redirect, withRouter} from "react-router";
import {PageLoader} from "Common/Loaders";
import Navigation from "Layout/Navigation";
import InitializeEventData from "Utils/StructuredEventData";
import {ToggleZendesk} from "Utils/Misc";

const SitePage = (Component, {mainPage=false, transparent=false, showHeader=true, showMarketplace=false, darkHeader=false, hideCheckout=false, hideRedeem=false, hideZendesk=false}={}) => {
  class SitePageComponent extends React.Component {
    constructor(props) {
      super(props);

      if(showMarketplace) {
        props.rootStore.SetWalletPanelVisibility({visibility: "full"});
      }

      this.state = {
        validSlug: false
      };
    }

    render() {
      const tenantSlug = this.props.match.params.tenantSlug;
      const siteSlug = this.props.match.params.siteSlug;

      const featuredSite = this.props.siteStore.FeaturedSite(siteSlug);
      const isFeatured = featuredSite && !tenantSlug;
      const validTenant = this.props.siteStore.availableTenants.includes(tenantSlug);

      if(!isFeatured && !validTenant) {
        return <Redirect to="/" />;
      }

      if(hideZendesk) {
        ToggleZendesk(false);
      }

      return (
        <>
          { showHeader && this.props.siteStore.siteSlug ?
            <Navigation mainPage={mainPage} transparent={transparent} dark={darkHeader} hideCheckout={hideCheckout} hideRedeem={hideRedeem} /> : null }
            <Suspense fallback={<PageLoader />}>
              <AsyncComponent
                key={`site-page-${this.props.match.url}`}
                _errorBoundaryClassname="page-container error-page-container"
                Load={async () => {
                  if(!isFeatured) {
                    await this.props.siteStore.LoadTenant({slug: tenantSlug});
                  }

                  const validSlug = await this.props.siteStore.LoadSite({
                    tenantSlug,
                    siteSlug,
                    fullLoad: true
                  });

                  try {
                    InitializeEventData(this.props.siteStore);
                  } catch(error) {
                    // eslint-disable-next-line no-console
                    console.error("Failed to initialize structured event data:");
                    // eslint-disable-next-line no-console
                    console.error(error);
                  }

                  if(this.props.siteStore.eventInfo.event_title) {
                    document.title = `${this.props.siteStore.eventInfo.event_title} | Eluvio Live`;
                  }

                  this.setState({validSlug});
                }}
              >
                {
                  this.state.validSlug ?
                    <Component {...this.props} /> :
                    <Redirect to="/" />
                }
              </AsyncComponent>
            </Suspense>
        </>
      );
    }
  }

  return inject("rootStore")(inject("siteStore")(withRouter(observer(SitePageComponent))));
};

export default SitePage;
