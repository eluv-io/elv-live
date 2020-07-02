import React from "react";
import {inject, observer} from "mobx-react";
import Timer from './Timer';
import Payments from './Payments';

@inject("rootStore")
@inject("siteStore")
@observer
class MoviePremiere extends React.Component {

  nowPremiere() {
    return <Payments />;
  }

  playPremiere() {
    return (
      <button onClick={() => this.props.playTitle(this.props.title)} className="btnPlay">
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
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, rgb(17, 17, 17, 0) 65%, rgb(17, 17, 17, .3) 70%, rgb(17, 17, 17, .4) 75%, rgb(17, 17, 17, .7) 80%, rgb(17, 17, 17, .8) 85%, rgb(17, 17, 17, .9) 90%, rgb(17, 17, 17, 1) 100%), url(${thumbnail})`,
      backgroundPosition: "center"
    };

    return (
      <React.Fragment>
        <div style={backgroundStyle} className="hero-background" />
        <div className="hero-view-container">
          <h1 className="hero-view-container__heading">{ featuredTitle.displayTitle }</h1>
          <Timer />
          <div className="hero-view-container__button">
            { this.props.siteStore.premiereCountdown ? (this.props.siteStore.boughtPremiere ? this.playPremiere() : this.nowPremiere()) : null }
            
            <button onClick={() => this.props.playTitle(featuredTitle)} className="btnPlay">
              Watch Trailer
            </button>

            <button onClick={() => this.props.modalOpen(featuredTitle)} className="btnDetails">
              View Details
            </button>
          </div>
          <p className="hero-view-container__overview">{synopsis}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default MoviePremiere;