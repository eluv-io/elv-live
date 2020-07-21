import React from "react";
import {inject, observer} from "mobx-react";
import styled from "styled-components";

@inject("rootStore")
@inject("siteStore")
@observer
class HeroView extends React.Component {

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
    
    const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;
    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";

    const backgroundStyle = {
      backgroundSize: "100% 100%",
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 50%, ${backgroundColor2} 55%, ${backgroundColor3}  60%, ${backgroundColor4} 65%, ${backgroundColor5}  70%, ${backgroundColor6} 80%, ${backgroundColor} 85%), url(${thumbnail})`,
      height: "100vh",
      backgroundPosition: "center"
    };

    const BackgroundStyleContainer = styled.div`
      background-size: 100% 100%;
      background-image: linear-gradient(to bottom, ${backgroundColor1} 50%, ${backgroundColor2} 55%, ${backgroundColor3} 60%, ${backgroundColor4} 65%, ${backgroundColor5} 70%, ${backgroundColor6} 80%, ${backgroundColor} 85%), url(${thumbnail});
      height: 100vh;
      background-position: center;
      @media only screen and (max-height: 50em), screen and (max-width: 50em) {
        background-size: cover;
      }
      }
    `;

    return (
      <React.Fragment>
        <div className="hero-grid-view-container">
          <BackgroundStyleContainer />
          <h1 className="hero-grid-view-container__heading-hero">{ featuredTitle.displayTitle }</h1>
          <div className="hero-grid-view-container__button">            
            <button onClick={() => this.props.siteStore.PlayTitle(featuredTitle)} className="btnPlay">
              Play Now
            </button>
            <button onClick={() => this.props.siteStore.SetModalTitle(featuredTitle)} className="btnDetails">
              View Details
            </button>
          </div>
          <p className="hero-grid-view-container__overview">{synopsis}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default HeroView;
