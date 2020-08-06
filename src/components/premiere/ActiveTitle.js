import React from "react";
import {inject, observer} from "mobx-react";
import PremiereTabs from "./PremiereTabs";
import {ImageIcon} from "elv-components-js";
import NavigationBar from "../NavigationBar";

@inject("rootStore")
@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  playPremiere() {

    return (
      <button onClick={() => {this.props.siteStore.PlayTitle(this.props.siteStore.modalTitle); this.props.siteStore.OffModalTitle();}} className="btnPlay btnDetails__heroDetail">
        Play Now
      </button>
    );
  }

  render() {
    const featuredTitle = this.props.siteStore.modalTitle;
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

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
    const customLogo = this.props.siteStore.CreateLink(
      featuredTitle.logoUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

    return (
      <React.Fragment >
        <NavigationBar />

        <div style={backgroundStyle} className="active-background" />
        <div className="active-view-container active-view-container__done">
          {/* <h1 className="active-view-container__heading">{ featuredTitle.displayTitle }</h1> */}
          { customLogo ? <ImageIcon className="active-view-container__logo" icon={customLogo} label="logo"/> : <h1 className="active-view-container__heading"> {featuredTitle.displayTitle} </h1>}

          <div className="active-view-container__button">
            { this.playPremiere() }
            
            <button onClick={() => {this.props.siteStore.PlayTitle(this.props.siteStore.modalTitle); this.props.siteStore.OffModalTitle();}} className="btnPlay btnPlay__heroPlay">
              Watch Trailer
            </button>

            {/* <button onClick={() => this.props.siteStore.SetModalTitle(featuredTitle)} className="btnDetails btnDetails__heroDetail">
              View Details
            </button> */}
          </div>
          <div className="active-view-container__overview">
            <PremiereTabs title={featuredTitle}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ActiveTitle;