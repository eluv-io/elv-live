import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";

import CloseIcon from "Icons/x.svg";
import Timer from "Common/Timer";
import EventTabs from "Event/tabs/EventTabs";
import Navigation from  "Layout/Navigation";
import PaymentOverview from "Event/payment/PaymentOverview";
import Footer from "Layout/Footer";

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTrailer: false,
      tab: 0,
      heroBackground: null
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
  }

  Trailer() {
    return (
      <React.Fragment>
        <div onClick={() => this.setState({showTrailer: false})} className="backdrop" />
        <ImageIcon
          key={"back-icon-close-modal"}
          className={"back-button-modal"}
          title={"Close Modal"}
          icon={CloseIcon}
          onClick={() => this.setState({showTrailer: false})}
        />

        <div className="modal show">


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
      return <Redirect to={`${this.props.siteStore.basePath}`}/>;
    }

    let eventInfo = this.props.siteStore.eventSites[this.props.match.params.name]["event_info"][0];

    const myRef = React.createRef();

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0) 30%, #FFFEF7 80%, rgba(255, 255, 255, 1) 90%, rgba(255, 255, 255, 1) 100%), url(${this.props.siteStore.heroBackground})`,
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
          <div className="event-container__countdown">
            <Timer classProp="ticket-icon" premiereTime="March 15, 2021 20:00:00"/>
          </div>


          <div className="event-container__overview">
            <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} name={this.props.match.params.name} refProp={myRef} />
          </div>
        </div>

        { this.state.showTrailer ? this.Trailer(): null}
        { this.props.siteStore.showCheckout ? this.Payment(): null}

        <Footer />
      </div>
    );
  }
}

export default Event;