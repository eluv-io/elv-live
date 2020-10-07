import React from "react";
import {inject, observer} from "mobx-react";

import {Redirect, withRouter} from "react-router";
import AsyncComponent from "./AsyncComponent";

// import MoviePremiere from "./premiere/MoviePremiere";
// import ActiveTitle from "./premiere/ActiveTitle";
// import HeroGrid from "./hero/HeroGrid";
// import OldBoxFeature from "./hero/OldBoxFeature";
// import BoxFeature from "./hero/BoxFeature";
// import NewVideoFeature from "./hero/NewVideoFeature";
// import SwiperGrid from "./grid/SwiperGrid";
// import ViewTitle from "./ViewTitle";
// import TitleGrid from "./grid/TitleGrid";
// import NavigationBar from "./NavigationBar";

import Card from "./livestream/Card";
import {ImageIcon} from "elv-components-js";
import Logo from "../static/images/Logo.png";
import { Link } from "react-router-dom";
import artist1 from "../static/images/livestream/artist1.png";
import liamE from "../static/images/livestream/liam-event.png";

const FormatName = (name) => {
  return (name || "")
    .split(/[_, \s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


@inject("rootStore")
@inject("siteStore")
@withRouter
@observer
class Site extends React.Component {
  // ArrangementEntry(entry, i) {
  //   const key = `arrangement-entry-${i}`;
  //   let dateFormat = require('dateformat');

  //   let name, titles;
  //   switch (entry.type) {
  //     case "playlist":
  //       const playlist = this.props.siteStore.siteInfo.playlists.find(playlist => playlist.slug === entry.playlist_slug);
  //       name = entry.label;
  //       // titles = playlist.titles;
  //       break;
  //     case "asset":
  //       name = entry.label;
  //       titles = this.props.siteStore.siteInfo.assets[entry.name];
  //       break;
  //     default:
  //       // eslint-disable-next-line no-console
  //       console.error("Unknown Asset Type:", entry.type);
  //       // eslint-disable-next-line no-console
  //       console.error(entry);
  //       return;
  //   }


  //   // const variant = entry.options && entry.options.variant;
  //   switch (entry.component) {
  //     case "event":
  //       return (
  //         <Card
  //           key={key}
  //           name={entry.options.title}
  //           date={dateFormat(new Date(entry.options.date), "mmmm dS, yyyy · h:MM TT Z")}
  //           description={entry.options.description}
  //           icon={entry.featureImage}
  //         />
  //       );
  //     case "header":
  //       return (
  //         <div className="live-content__title">
  //           {entry.options.text}
  //         </div>
  //       );
  //     default:
  //       // eslint-disable-next-line no-console
  //       console.error("Unknown component:", entry.component);
  //       // eslint-disable-next-line no-console
  //       console.error(entry);
  //   }
  // }

  Content() {
    const siteCustomization = this.props.siteStore.siteCustomization || {};
    let arrangement = siteCustomization.arrangement;
    document.documentElement.style.setProperty('--bgColor', `${siteCustomization.colors.background}`);
    document.documentElement.style.setProperty('--pText', `${siteCustomization.colors.primary_text}`);
    document.documentElement.style.setProperty('--sText', `${siteCustomization.colors.secondary_text}`);
    
    let headers = [];
    let cards = [];
    let headerCount = 0; 
    let ret = [];
    let dateFormat = require('dateformat');

    for (var i = 0; i < arrangement.length; i++) {
      let entry = arrangement[i];
      if (arrangement[i].component == "header") {
        headers.push(
          <div className="live-content__title">
            {entry.options.text}
          </div>
        );
        if (i != 0) {
          headerCount++;
        } 
      }
      else if (arrangement[i].component == "event") {
        if (cards[headerCount] === undefined || cards[headerCount].length == 0) {
          cards[headerCount] = [
            <Card
              key={i}
              name={entry.options.title}
              date={dateFormat(new Date(entry.options.date), "mmmm dS, yyyy · h:MM TT Z")}
              description={entry.options.description}
              icon={entry.featureImage}
            />
          ];
        }
        else {
          cards[headerCount].push(
            <Card
              key={i}
              name={entry.options.title}
              date={dateFormat(new Date(entry.options.date), "mmmm dS, yyyy · h:MM TT Z")}
              description={entry.options.description}
              icon={entry.featureImage}
            />
          );
        }
      }
    }
    
    for (var i = 0; i < cards.length; i++) {
      ret.push(headers[i]);
      ret.push(
        <div className="live-content__container">
          {cards[i]}
        </div>
      );
    }
    return (
      <div className="live-content">
        {ret}
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
              <ImageIcon className="live-hero__picture" icon={this.props.siteStore.siteCustomization.arrangement[1].eventImage} label="artist" />
              <h4 className="live-hero__heading">
                <span className="live-hero__heading-span card__heading-span--4">Madison Beer</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Content Selection */}
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
