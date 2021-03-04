import React from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "Common/AsyncComponent";
import {Redirect, withRouter} from "react-router";

const SitePage = Component => {
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
      const slug = this.props.match.params.siteSlug;

      const isFeatured = this.props.siteStore.featuredSiteSlugs.includes(slug) && !tenantSlug && !baseSlug;
      const validTenant = this.props.siteStore.availableTenants.includes(tenantSlug);

      if(!isFeatured && !validTenant) {
        return <Redirect to="/" />;
      }

      return (
        <AsyncComponent
          key={`site-page-${this.props.match.url}`}
          Load={async () => {
            if(!isFeatured) {
              await this.props.siteStore.LoadTenant(tenantSlug);
            }

            const validSlug = await this.props.siteStore.LoadSite({
              tenantSlug,
              baseSlug,
              slug,
              validateBaseSlug: !isFeatured
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
      );
    }
  }

  return SitePageComponent;
};

export default SitePage;
