import React from "react";
import {inject, observer} from "mobx-react";
import Title from "./Title";

@inject("siteStore")
@observer
class Franchise extends React.Component {
  TitlePreview(titleKey) {
    const title = this.props.siteStore.franchises[this.props.franchiseKey].titles[titleKey];

    if(!title) { return; }

    return (
      <div
        key={`title-preview-${titleKey}`}
        className="title-preview"
        onClick={() => this.props.siteStore.SetActiveTitle(titleKey)}
      >
        <img
          alt={title.name}
          src={title.poster}
        />
        <h3>{title.name}</h3>
      </div>
    );
  }

  render() {
    const franchise = this.props.siteStore.franchises[this.props.franchiseKey];

    if(!franchise) { return; }

    if(this.props.siteStore.activeTitle) {
      return (
        <div className="franchise-container">
          <h2>{franchise.name}</h2>

          <Title
            franchiseKey={this.props.franchiseKey}
            titleKey={this.props.siteStore.activeTitle}
          />
        </div>
      );
    }

    return (
      <div className="franchise-container">
        <h2>{franchise.name}</h2>

        <div className={this.props.siteStore.activeTitle ? "" : "franchise-titles-container"}>
          { Object.keys(franchise.titles).map(titleKey => this.TitlePreview(titleKey)) }
        </div>
      </div>
    );
  }
}

export default Franchise;
