import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";

import CloseIcon from "../../assets/icons/x.svg";
import { eventHeroView } from "../../assets/data/event";

import EventTabs from "./tabs/EventTabs";
import Navigation from  "../../components/layout/Navigation";
import PaymentOverview from "./payment/PaymentOverview";
import Footer from "../../components/layout/Footer";

@inject("rootStore")
@inject("siteStore")
@observer
class Concert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTrailer: false,
      tab: 0,
      heroBackground: undefined,
      eventInfo: this.props.siteStore.eventSites[this.props.match.params.name]["event_info"][0]
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    let heroBackground = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.match.params.name}/images/hero_background/default`});
    this.setState({heroBackground: heroBackground});
  }

  Trailer() {
    return (
      <React.Fragment>
        <div onClick={() => this.setState({showTrailer: false})} className="backdrop" />

        <div className="modal show">
          <ImageIcon
            key={"back-icon-close-modal"}
            className={"back-button-modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => this.setState({showTrailer: false})}
          />

          <div className={"modal__container"}>          
            <iframe 
              width="100%" 
              height="100%"
              src={this.props.siteStore.eventSites[this.props.match.params.name]["event_info"][0]["trailer_url"]}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />          
          </div>
        </div>
      </React.Fragment>
    );
  }

  Payment() {
    return (
      <React.Fragment>
        <div onClick={this.props.siteStore.turnOffModal} className="backdrop" />
        <div className="ticket-modal ticket-modal-show">
          <ImageIcon
            key={"back-icon-Close Modal"}
            className={"back-button-modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={this.props.siteStore.turnOffModal}
          />
          <div className={"ticket-modal__container"}>
            <PaymentOverview name={this.props.match.params.name} /> 
          </div>
        </div>
      </React.Fragment>
    );
  }
  handleNavigate = myRef => {
    if(this.state.tab != 0) {
      this.setState({tab: 0});
      let domElement = document.getElementById("tabs");
      domElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      let el = myRef.current;
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };


  render() {
    if(!this.props.siteStore.eventSites[this.props.match.params.name]) {
      return <Redirect to='/'/>;
    }

    let {eventInfo, heroBackground } = this.state;

    const myRef = React.createRef();

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, ${eventHeroView.backgroundColor1} 55%, ${eventHeroView.backgroundColor3} 60%, ${eventHeroView.backgroundColor4} 65%, ${eventHeroView.backgroundColor5}  70%, ${eventHeroView.backgroundColor6} 75%, ${eventHeroView.backgroundColor7} 80%,  ${eventHeroView.backgroundColor8} 85%,  ${eventHeroView.backgroundColor9} 90%, ${eventHeroView.backgroundColor10} 100%), url(${heroBackground})`,
      backgroundPosition: "center",
      objectFit: "cover",
      height: "100vh",
      margin: "0",
      position: "absolute",
      width: "100%"
    };


    return (
      <div className="event">
        <Navigation />

        <div style={backgroundStyle} />

        <div className="event-container">
          <div className="event-container__heading">
            <h1 className="name"> {eventInfo["artist"]} </h1>
            <h1 className="location">{ `Streaming Live from the ${eventInfo["location"]}` }</h1>
            <h1 className="time">{ eventInfo["date"] }</h1>
          </div>
          
          <div className="event-container__button">
            <button className="btnPlay btnDetails__heroPlay" onClick={() => this.handleNavigate(myRef)}>
              Buy Tickets
            </button>
            <button onClick={() => this.setState({showTrailer: true})} className="btnPlay btnDetails__heroDetail">
              Watch Promo
            </button> 
          </div> 

          <div className="event-container__overview">
            <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} name={this.props.match.params.name} refProp={myRef} />
          </div>
        </div>

        { this.state.showTrailer ? this.Trailer(): null}
        { this.props.siteStore.modalOn ? this.Payment(): null}

        <Footer />
      </div>
    );
  }
}

export default Concert;