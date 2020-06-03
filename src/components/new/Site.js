import "../../static/stylesheets/new/app.scss";

import React from "react";
import {inject, observer} from "mobx-react";
import SearchBar from "../SearchBar";
import {LoadingElement} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class Site extends React.Component {
  render() {
    if(!this.props.siteStore.currentSite) { return null; }

    const mainSiteName = this.props.siteStore.sites[0].name;
    const subHeader = this.props.siteStore.sites.slice(1).map(site => site.name).join(" - ");

    return (
      <div className="site" id="site">
        <h2 className={`site-header ${subHeader ? "with-subheader" : ""}`} hidden={false}>
          { mainSiteName }
          <SearchBar key={`search-bar-${this.props.siteStore.searchQuery}`} />
        </h2>

        { subHeader ? <h3 className="site-subheader">{ subHeader }</h3> : null }

        <LoadingElement loading={this.props.siteStore.loading}>
          <div>
            Site Content
          </div>
        </LoadingElement>
      </div>
    );
  }
}

export default Site;
