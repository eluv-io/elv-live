import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class HeroGridHelper extends React.Component {

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
    
    const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;
    // const slicedGuy = backgroundColor.slice(0, -1);
    // const backgroundColor1 =  slicedGuy  + ', .0)';
    // const backgroundColor2 =  slicedGuy  + ', .3)';
    // const backgroundColor3 =  slicedGuy  + ', .4)';
    // const backgroundColor4 =  slicedGuy  + ', .7)';
    // const backgroundColor5 =  slicedGuy  + ', .8)';
    // const backgroundColor6 =  slicedGuy  + ', .9)';
    // console.log(backgroundColor1);

    const backgroundColor1 =  backgroundColor + '00';
    const backgroundColor2 =  backgroundColor + '4C';
    const backgroundColor3 =  backgroundColor+ '66';
    const backgroundColor4 =  backgroundColor + 'B3';
    const backgroundColor5 =  backgroundColor + 'CC';
    const backgroundColor6 =  backgroundColor+ 'E6';

    const backgroundStyle = {
      backgroundSize: "cover",
      // backgroundImage: `linear-gradient(to bottom, rgb(17, 17, 17, .0)  65%, rgb(17, 17, 17, .3) 70%, rgb(17, 17, 17, .4) 75%, rgb(17, 17, 17, .7) 80%, rgb(17, 17, 17, .8) 85%, rgb(17, 17, 17, .9) 90%, rgb(17, 17, 17, 1) 100%), url(${thumbnail})`,
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 65%, ${backgroundColor2} 70%, ${backgroundColor3}  75%, ${backgroundColor4} 80%, ${backgroundColor5}  85%, ${backgroundColor6} 90%, ${backgroundColor} 100%), url(${thumbnail})`,
      // backgroundImage: `linear-gradient(to bottom, rgb(17, 17, 17, .4) 75%, url(${thumbnail})`,
      height: "75vh",
      backgroundPosition: "center"
    };

    return (
      <React.Fragment>
        <div className="hero-grid-view-container">
          <div style={backgroundStyle} />
          <h1 className="hero-grid-view-container__heading-hero">{ featuredTitle.displayTitle }</h1>
          <div className="hero-grid-view-container__button">            
            <button onClick={() => this.props.playTitle(featuredTitle)} className="btnPlay">
              Play Now
            </button>
            <button onClick={() => this.props.modalOpen(featuredTitle)} className="btnDetails">
              View Details
            </button>
          </div>
          <p className="hero-grid-view-container__overview">{synopsis}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default HeroGridHelper;
