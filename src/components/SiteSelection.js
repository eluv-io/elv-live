import React from "react";
import AsyncComponent from "./AsyncComponent";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@observer
class SiteSelection extends React.Component {
  constructor(props) {
    super(props);

    this.PageContent = this.PageContent.bind(this);
  }

  PageContent() {
    return (
      <div className="site-selection">
        <h4>Select a Site</h4>

        <ul className="available-sites">
          { this.props.rootStore.availableSites.map(({name, siteId}) =>
            <li
              key={`site-selection-${siteId}`}
              onClick={() => this.props.rootStore.SetSiteId(siteId)}
            >
              { name }
            </li>
          )}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <AsyncComponent
        Load={
          async () => {
            await this.props.rootStore.LoadAvailableSites();
          }
        }
        render={this.PageContent}
      />
    );
  }
}

export default SiteSelection;
