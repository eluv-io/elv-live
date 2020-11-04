import React from "react";
import {inject, observer} from "mobx-react";
import PremiereTabs from "./PremiereTabs";
import {ImageIcon} from "elv-components-js";
import CloseIcon from "../../static/icons/x.svg";

// import NavigationBar from "../navigation/NavigationBar";
import styled from "styled-components";
import Trailer from "./Trailer";
import {
  Link
} from "react-router-dom";

const FormatName = (name) => {
  return (name || "")
    .split(/[_, \s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

@inject("rootStore")
@inject("siteStore")
@observer
class FilmRelease extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSeries: false,
      showTrailer: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // if(["series", "season"].includes(this.props.siteStore.singleTitle.title_type)){
    //   this.setState({isSeries: true});
    // }
  }

  Trailer() {

    let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.artist);
    let featuredTitle = eventInfo.stream;
    this.props.siteStore.PlayTrailer(featuredTitle);

    return (
      <React.Fragment>
        
        <div onClick={() => this.setState({showTrailer: false})} className="backdrop" />

        <div className="modal show" >
          <ImageIcon
            key={`back-icon-Close Modal`}
            className={"back-button__modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => this.setState({showTrailer: false})}
          />
          <div className={`modal__container`}>
            <Trailer/>
          </div>
        </div>
      </React.Fragment>

    )
  }

  render() {
    if (!this.props.siteStore.eventAssets.has(this.props.match.params.artist)) {
      return <Redirect to='/'/>;
    }

    let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.artist);
    let featuredTitle = eventInfo.stream;

    const thumbnail = eventInfo.eventImg;

    const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;

    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";


    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 80%, ${backgroundColor2} 82.55%, ${backgroundColor3}  85%, ${backgroundColor4} 87.5%, ${backgroundColor5}  90%, ${backgroundColor6} 95%, ${backgroundColor} 97%,${backgroundColor} 100%), url(${thumbnail})`,
      backgroundPosition: "center",
      objectFit: "cover",
      height: "100%",
    };

    const customLogo = eventInfo.logo;
    return (
      <div className="event-container">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo} label="Eluvio" />
        </div>
        <div style={backgroundStyle} className="active-background" />
        <div className="active-view-container active-view-container__done">
            { customLogo ? <ImageIcon className="active-view-container__logo" icon={customLogo} label="logo"/> : <h1 className="active-view-container__heading"> {featuredTitle.displayTitle} </h1>}
            
            <div className="active-view-container__button">
              <Link to={{
                  pathname: `/payment/${this.props.match.params.artist}`,
                  state: {
                    name: eventInfo.name,
                    icon: eventInfo.icon
                  }
                }}>
                <button className="btnPlay btnDetails__heroPlay" >
                  Buy Tickets
                </button>
              </Link>
              
              <button onClick={() => this.setState({showTrailer: true})} className="btnPlay btnDetails__heroDetail">
                Watch Trailer
              </button>
            </div>
            <div className="active-view-container__premiere">
              {eventInfo.date} 
            </div>

          <div className="active-view-container__overview">
            <PremiereTabs title={featuredTitle} type={"film"}/>
          </div>
        </div>
        { this.state.showTrailer ? this.Trailer(): null}
   

        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>
      </div>
    );
  }
}

export default FilmRelease;