import React from "react";
import {inject, observer} from "mobx-react";
import Timer from "./Timer";
import PremierePayment from "./PremierePayment";

@inject("rootStore")
@inject("siteStore")
@observer
class MoviePremiere extends React.Component {

  nowPremiere() {
    return <PremierePayment />;
  }

  playPremiere() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.title)} className="btnPlay">
        Play Now
      </button>
    );
  }

  render() {
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: vh }
    );

    const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;

    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";

    const backgroundStyle = {
      backgroundSize: "cover",
      // backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 65%, ${backgroundColor2} 70%, ${backgroundColor3} 75%, rgb(17, 17, 17, .7) 80%, rgb(17, 17, 17, .8) 85%, rgb(17, 17, 17, .9) 90%, ${backgroundColor} 100%), url(${thumbnail})`,
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 50%, ${backgroundColor2} 55%, ${backgroundColor3}  60%, ${backgroundColor4} 65%, ${backgroundColor5}  70%, ${backgroundColor6} 80%, ${backgroundColor} 85%), url(${thumbnail})`,
      
      backgroundPosition: "center"
    };

    return (
      <React.Fragment>
        <div style={backgroundStyle} className="premiere-background" />
        <div className={ this.props.siteStore.premiereCountdown ? "premiere-view-container premiere-view-container__done" : "premiere-view-container"}>
          <h1 className="premiere-view-container__heading">{ featuredTitle.displayTitle }</h1>
          <Timer />
          <div className="premiere-view-container__button">
            { this.props.siteStore.premiereCountdown ? (this.props.siteStore.boughtPremiere ? this.playPremiere() : this.nowPremiere()) : null }
            
            <button onClick={() => this.props.siteStore.PlayTitle(featuredTitle)} className="btnPlay">
              Watch Trailer
            </button>

            <button onClick={() => this.props.siteStore.SetModalTitle(featuredTitle)} className="btnDetails">
              View Details
            </button>
          </div>
          <p className="premiere-view-container__overview">{synopsis}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default MoviePremiere;