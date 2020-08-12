import React from "react";
import {inject, observer} from "mobx-react";
import SubscriptionPayment from "../payment/SubscriptionPayment";
import {ImageIcon} from "elv-components-js";
import styled from "styled-components";

@inject("rootStore")
@inject("siteStore")
@observer
class BoxFeature extends React.Component {
  preSubscribe() {
    return <SubscriptionPayment isNav={false} isFeature={true}/>;
  }

  afterSubscribe() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.title)} className={"btnPlay btnPlay__feature"}>
        WATCH NOW
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

  



    const BoxContainer = styled.div`
      margin-top: 7rem;
      background-size: cover;
      }
    `;

    const PhotoContainer = styled.div`
      background-image: url(${thumbnail});
      background-size: cover;
      height: 100%;
      width: 100%;
      background-position: center;
    }
    `;

    return (
      <BoxContainer
        className= "box-feature"
      >
        <div className="box-feature__container">
          { customLogo ? <ImageIcon className="box-feature__titleIcon" icon={customLogo} label="logo"/> : <h1 className="box-feature__title"> {featuredTitle.displayTitle} </h1>}
          <div className="box-feature__button">
            { this.props.siteStore.boughtSubscription ? this.afterSubscribe() : this.preSubscribe()}

            <button onClick={() => this.props.siteStore.SetSingleTitle(featuredTitle)} className="btnDetails btnDetails__featureDetail">
                VIEW DETAILS
            </button>
          </div>
        </div>

        <PhotoContainer />
      </BoxContainer>
    );
  }
}

export default BoxFeature;