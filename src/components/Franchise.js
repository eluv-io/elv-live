import React from "react";
import {inject, observer} from "mobx-react";
import Title from "./Title";

@inject("siteStore")
@observer
class Franchise extends React.Component {
  render() {
    const franchise = this.props.siteStore.franchises[this.props.franchiseKey];

    if(!franchise) { return; }

    return (
      <div className="franchise-container">
        <h2>{franchise.name}</h2>

        <div className={this.props.siteStore.activeTitle ? "" : "franchise-titles-container"}>
          {
            Object.keys(franchise.titles).map(titleKey =>
              <Title titleKey={titleKey} key={`title-${titleKey}`}/>
            )
          }
        </div>
      </div>
    );
  }
}

export default Franchise;
