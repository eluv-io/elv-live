import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "../copy/Copy.yaml";

@inject("mainStore")
@observer
class FeatureBlock extends React.Component {
  render() {
    const copy = Copy.main[this.props.copyKey];

    return (
      <div className="feature-block">
        <div className="feature-block__image-container">
          { this.props.image }
        </div>
        <div className="feature-block__text-container">
          <h2 className="feature-block__header">{ copy.header }</h2>
          <h3 className="feature-block__subheader">{ copy.subheader }</h3>
          <div className="feature-block__text">{ copy.text }</div>
        </div>
        <div className="feature-block__actions">
          <button className="feature-block__action">
            Learn More
          </button>
        </div>
      </div>
    );
  }
}

export default FeatureBlock;
