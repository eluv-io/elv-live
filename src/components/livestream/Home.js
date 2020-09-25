import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import Card from "./Card";
import artist1 from "../../static/images/livestream/artist1.png";
import artist2 from "../../static/images/livestream/artist2.png";
import artist3 from "../../static/images/livestream/artist3.png";
import artist4 from "../../static/images/livestream/artist4.png";
import artist5 from "../../static/images/livestream/artist5.png";
import artist6 from "../../static/images/livestream/artist6.png";

import { Link } from "react-router-dom";

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
          <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
          <Link to="/code" className="btn2 btn2--white live-nav--ticket">
            Redeem Ticket 
          </Link>
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

          <div className="live-content__container">
            <Card
              name={"liampayne"}
              artist={"Liam Payne"}
              date={"Sep 8 · 7:00 PM PDT"}
              description={"Liam Payne Live At Bill Graham in San Francisco"}
              icon={artist1}
            />
            <Card
              name={"brandicarlile"}
              artist={"Brandi Carlile"}
              date={"Sep 12 · 4:00 PM PDT"}
              description={"Brandi Carlile Live At The Cornerstone in Berkeley"}
              icon={artist2}
            />
            <Card
              name={"perfumegenius"}
              artist={"Perfume Genius"}
              date={"Sep 24 · 7:00 PM PDT"}
              description={"Perfume Genius Live At Harvelle's in Chicago"}
              icon={artist3}
            />
            <Card
              name={"kotathefriend"}
              artist={"Kota the Friend"}
              date={"Sep 4 · 10:00 PM PDT"}
              description={"Kota the Friend Live At King Fish in Oakland"}
              icon={artist4}
            />
            <Card
              name={"orianthi"}
              artist={"Orianthi"}
              date={"Sep 19 · 6:00 PM PDT"}
              description={"Orianthi Live At The Whisky in Hollywood"}
              icon={artist5}
            />
            <Card
              name={"walkofftheearth"}
              artist={"Walk off the Earth"}
              date={"Sep 23 · 9:00 PM PDT"}
              description={"Walk off the Earth Live At The Fillmore in San Francisco"}
              icon={artist6}
            />
          </div>
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