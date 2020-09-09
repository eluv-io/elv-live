import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class Home extends React.Component {

  render() {

    return (
      <div className="live-container">

        {/* NavBar */}
        <div className="live-nav">
          <ImageIcon className="live-nav__container--logo" icon={Logo} label="Eluvio" />
        </div>

        {/* Hero View */}
        <div className="live-hero">
          Hero View 
        </div>

        {/* Content Selection */}
        <div className="live-content">
          Content Selection 
        </div>

        {/* Footer */}
        <div className="live-footer">
          Copyright © Eluvio 2020 
        </div>

      </div>
    );
  }
}

export default Home;