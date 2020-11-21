import React from "react";
import {inject, observer} from "mobx-react";
import {withRouter} from "react-router";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";

import Card from "./livestream/Card";
import ritaHero from "../static/images/ritaora/hero5.jpg";

@inject("rootStore")
@inject("siteStore")
@withRouter
@observer
class Site extends React.Component {

  Content() {
    const siteCustomization = this.props.siteStore.siteCustomization || {};
    let arrangement = siteCustomization.arrangement;
    document.documentElement.style.setProperty('--bgColor', `${siteCustomization.colors.background}`);
    document.documentElement.style.setProperty('--pText', `${siteCustomization.colors.primary_text}`);
    document.documentElement.style.setProperty('--sText', `${siteCustomization.colors.secondary_text}`);
    
    let headers = [];
    let headerCount = 0;  // Using headerCount instead of headers.length because index needs to start at 0 and of edge case with no headers

    let cards = [];
    let content = [];

    let dateFormat = require('dateformat');

    for (let i = 0; i < arrangement.length; i++) {
      let entry = arrangement[i];
      if (arrangement[i].component == "header") {
        headers.push(
          <div className="live-content__title" key={i}>
            {entry.options.text}
          </div>
        );
        if (i != 0) {
          headerCount++;
        } 
      }
      else if (arrangement[i].component == "event") {
        if (cards[headerCount] === undefined || cards[headerCount].length == 0) {
          cards[headerCount] = [];
        }
        cards[headerCount].push(
          <Card
            key={i}
            eventType={i}
            name={entry.options.title}
            date={dateFormat(new Date(entry.options.date), "mmmm dS, yyyy · h:MM TT Z")}
            description={entry.options.description}
            icon={entry.featureImage}
          />
        );
      }
    }
    
    for (let i = 0; i < cards.length; i++) {
      content.push(headers[i]);
      content.push(
        <div className="live-content__container" key={`container-${i}`}>
          {cards[i]}
        </div>
      );
    }

    return (
      <div className="live-content">
        {content}
      </div>
    )
  }

  HeroView() {
    return (
      <div className="divbody">
        <div className="block">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-view-container">
          <div className="text">
            <h1 className="texth1">The New Standard for Live Streaming</h1>
            <p className="textp" >
              Eluvio Live streams all the world's events to you. Purchase tickets and stream live concerts, premieres, and performances. In beautiful 4K quality, directly from the artist, subscription free.
            </p>
          </div>

          <div className="img-wrapper">
            <img className="actual-img" src={ritaHero} />
            <h4 className="photo-heading">
              <span className="photo-heading-span">RITA ORA</span>
            </h4>
          </div>

        </div>


      </div>
      
    )
  }

  render() {
    if(!this.props.rootStore.client) {
      return null;
    }

    return (
      <div className="live-container">
        {/* NavBar */}
        <div className="live-nav">
          <ImageIcon className="live-nav--logo" icon={this.props.siteStore.logoUrl} label="Eluvio" />
          <Link to="/code" className="btn2 btn2--white live-nav--ticket">
            Redeem Ticket 
          </Link>
        </div>

        {/* Hero View */}
        {this.HeroView()}

        {/* Content from Site Customization */}
        {this.Content()}

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

export default Site;
