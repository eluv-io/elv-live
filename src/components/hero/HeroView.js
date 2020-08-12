import React from "react";
import {inject, observer} from "mobx-react";
import styled from "styled-components";
import SubscriptionPayment from "../payment/SubscriptionPayment";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class HeroView extends React.Component {

  preSubscribe() {
    return <SubscriptionPayment isNav={false} />;
  }

  afterSubscribe() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.title)} className="btnPlay btnPlay__heroPlay">
        Watch Movie
      </button>
    );
  }

  render() {
    const featuredTitle = this.props.title;
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    
    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

    const customLogo = this.props.siteStore.CreateLink(
      featuredTitle.logoUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );
    
    const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;
    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: linear-gradient(to bottom, ${backgroundColor1} 60%, ${backgroundColor2} 65%, ${backgroundColor3} 70%, ${backgroundColor4} 75%, ${backgroundColor5} 80%, ${backgroundColor6} 85%, ${backgroundColor} 90%), url(${thumbnail});
      height: 100vh;
      background-position: center;
      }
    `;

    return (
      <div className="hero-grid-view-container">
        <BackgroundStyleContainer />
        { customLogo ? <ImageIcon className="hero-grid-view-container__logo" icon={customLogo} label="logo"/> : <h1 className="hero-grid-view-container__heading-hero">{ featuredTitle.displayTitle }</h1>}
        <div className="hero-grid-view-container__button">            
          { this.props.siteStore.boughtSubscription ? this.afterSubscribe() : this.preSubscribe()}
          <button onClick={() => this.props.siteStore.SetSingleTitle(featuredTitle)} className="btnDetails btnDetails__heroDetail">
            View Details
          </button>
        </div>
      </div>
    );
  }
}

export default HeroView;
