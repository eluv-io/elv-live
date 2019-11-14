import React from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "./AsyncComponent";
import Franchise from "./Franchise";

@inject("siteStore")
@observer
class Site extends React.Component {
  PageContent() {
    if(!this.props.siteStore.site) { return; }

    return (
      <div className="site-container">
        <h1>{this.props.siteStore.site.name}</h1>

        {
          Object.keys(this.props.siteStore.franchises).map(franchiseKey =>
            <Franchise franchiseKey={franchiseKey} key={`franchise-${franchiseKey}`} />
          )
        }
      </div>
    );
  }

  render() {
    return (
      <AsyncComponent
        Load={async () => {
          await this.props.siteStore.LoadSite("iq__3hgxWJ8uNVYWyT7QbEafrqfLMJTv");
        }}
      >
        { this.PageContent() }
      </AsyncComponent>
    );
  }
}

export default Site;
