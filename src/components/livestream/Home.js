import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import Card from "./Card";
import artist1 from "../../static/images/livestream/artist1.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Home extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0,0);
  }

  render() {

    return (
      <div className="live-container">

        {/* NavBar */}
        <div className="live-nav">
          <ImageIcon className="live-nav__container--logo" icon={Logo} label="Eluvio" />
        </div>

        {/* Hero View */}
        <div className="live-hero">
          <div className="live-hero__container">
            <h1 className="live-hero__container__title">
                Live Concerts From your home. 
            </h1>
            <h2 className="live-hero__container__subtitle">
                Purchase livestream tickets for your favorite artists from the comfort of your home.
            </h2>
          </div>
          
          <div className="live-hero__cardMain">
            <div className="live-hero__cardMain__side">
                <ImageIcon className="live-hero__picture" icon={artist1} label="artist" />
                <h4 className="live-hero__heading">
                  <span className="live-hero__heading-span card__heading-span--4">Liam Payne</span>
                </h4>
            </div>
          </div>
        </div>

        {/* Content Selection */}
        <div className="live-content">
          <div className="live-content__title">
            Upcoming Livestreams
          </div>
          <Card />
        </div>

        {/* Footer */}
        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>

      </div>
    );
  }
}

export default Home;