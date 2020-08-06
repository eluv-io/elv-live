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
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
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
      background-image: linear-gradient(to bottom, ${backgroundColor1} 50%, ${backgroundColor2} 55%, ${backgroundColor3} 60%, ${backgroundColor4} 65%, ${backgroundColor5} 70%, ${backgroundColor6} 80%, ${backgroundColor} 85%), url(${thumbnail});
      height: 100vh;
      background-position: center;
      }
    `;

    const Submit = () => {
      return (
        // <Link to={`/movie/:${featuredTitle.displayTitle}`} key={"content-object-iq__SufWAMfhP6P2tTUSrmdTjRdPfUM"}>
        <button onClick={() => this.props.siteStore.SetModalTitle(featuredTitle)} className="btnDetails btnDetails__heroDetail">
          View Details
        </button>
        // </Link>
      );
    };


    return (
      <div className="hero-grid-view-container">
        <BackgroundStyleContainer />
        { customLogo ? <ImageIcon className="hero-grid-view-container__logo" icon={customLogo} label="logo"/> : <h1 className="hero-grid-view-container__heading-hero">{ featuredTitle.displayTitle }</h1>}
        <div className="hero-grid-view-container__button">            
          { this.props.siteStore.boughtSubscription ? this.afterSubscribe() : this.preSubscribe()}

          {Submit()}
        </div>
        <p className="hero-grid-view-container__overview">{synopsis}</p>
      </div>
    );
  }
}

export default HeroView;
