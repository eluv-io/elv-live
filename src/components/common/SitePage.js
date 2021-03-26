import React, {Suspense} from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "Common/AsyncComponent";
import {Redirect, withRouter} from "react-router";
import {PageLoader} from "Common/Loaders";
import Navigation from "Layout/Navigation";

const SitePage = (Component, {mainPage=false, showHeader=true}={}) => {
  @inject("siteStore")
  @observer
  @withRouter
  class SitePageComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        validSlug: false
      };
    }

    render() {
      const tenantSlug = this.props.match.params.tenantSlug;
      let baseSlug = this.props.match.params.baseSlug;
      const siteSlug = this.props.match.params.siteSlug;

      const featuredSite = this.props.siteStore.FeaturedSite(siteSlug);
      const isFeatured = featuredSite && !tenantSlug && !baseSlug;
      const validTenant = this.props.siteStore.availableTenants.includes(tenantSlug);

      if(!isFeatured && !validTenant) {
        return <Redirect to="/" />;
      }

      return (
        <>
          { showHeader && this.props.siteStore.siteSlug ? <Navigation mainPage={mainPage} /> : null }
          <Suspense fallback={<PageLoader />}>
            <AsyncComponent
              key={`site-page-${this.props.match.url}`}
              Load={async () => {
                if(!isFeatured) {
                  await this.props.siteStore.LoadTenant(tenantSlug);
                }

                const validSlug = await this.props.siteStore.LoadSite({
                  tenantSlug,
                  baseSlug,
                  siteSlug,
                  validateBaseSlug: !isFeatured,
                  preloadHero: true
                });

                if(!validSlug) { console.error(`Invalid base slug: ${baseSlug}`); }

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

  return SitePageComponent;
};

export default SitePage;
