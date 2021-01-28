import React from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "Common/AsyncComponent";
import {Redirect, withRouter} from "react-router";

const SitePage = Component => {
  @inject("siteStore")
  @observer
  @withRouter
  class SitePageComponent extends React.Component {
    render() {
      const slug = this.props.match.params.siteSlug;

      if(!this.props.siteStore.availableSites[slug]) {
        return <Redirect to={`${this.props.siteStore.basePath}`}/>;
      }

      return (
        <AsyncComponent
          Load={async () => {
            await this.props.siteStore.LoadSite(slug);
          }}
        >
          <Component {...this.props} />
        </AsyncComponent>
      );
    }
  }

  return SitePageComponent;
};

export default SitePage;
