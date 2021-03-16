import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "./copy/Copy.yaml";
import FeaturedEvents from "Pages/main/components/FeaturedEvents";
import Logo from "Assets/images/logo/coloredEluvioLiveLogo.png";
import FeatureBlock from "Pages/main/components/FeatureBlock";

@inject("mainStore")
@observer
class Main extends React.Component {
  render() {
    return (
      <div className="page-content main-page">
        <FeaturedEvents />
        <div className="main-page__logo-block scroll-block" id="scroll-block-logo">
          <div className="main-page__logo-container">
            <img src={Logo} alt="Eluvio Live" className="main-page__logo" />
          </div>
          <h2 className="main-page__header">
            { Copy.main.header }
          </h2>
        </div>
        <div className="main-page__content-container">
          { this.props.mainStore.copyKeys.map(copyKey =>
            <FeatureBlock key={`feature-block-${copyKey}`} copyKey={copyKey} promoVideo={copyKey === "beautiful_quality"} />
          )}
        </div>
      </div>
    );
  }
}

export default Main;
