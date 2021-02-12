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
      const baseSlug = this.props.match.params.baseSlug;
      const slug = this.props.match.params.siteSlug;

      if(!this.props.siteStore.availableSites[slug]) {
        return <Redirect to="/" />;
      }

      return (
        <AsyncComponent
          key={`site-page-${baseSlug}-${slug}`}
          Load={async () => {
            const validSlug = await this.props.siteStore.LoadSite(baseSlug, slug);

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
