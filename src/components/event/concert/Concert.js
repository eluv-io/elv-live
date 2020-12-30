import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";

import EventTabs from "../EventTabs";
import Ticket from "../../livestream/Payment/Ticket";
import Navigation from  "../../home/Navigation";

import Logo from "../../../assets/images/logo/darkLogo.png";
import heroImg from "../../../assets/images/ritaora/hero1.jpg";
import hero1 from "../../../assets/images/ritaora/hero1.jpg";
import CloseIcon from "../../../assets/icons/x.svg";
import PaymentOverview from "../../livestream/Payment/PaymentOverview";
import Footer from "../../home/Footer";
// import { eventInfo } from "../../../assets/data/event";


@inject("rootStore")
@inject("siteStore")
@observer
class Concert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPayment: false,
      showTrailer: false,
      prodID: "",
      priceID: "",
      tab: 0

    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  Trailer() {

      return (
        <React.Fragment>
          <div onClick={() => this.setState({showTrailer: false})} className="backdrop" />

          <div className="modal show">
            <ImageIcon
              key={`back-icon-Close Modal`}
              className={"back-button-modal"}
              title={"Close Modal"}
              icon={CloseIcon}
              onClick={() => this.setState({showTrailer: false})}
            />

            <div className={`modal__container`}>          
              <iframe 
                width="100%" 
                height="100%"
                src={this.props.siteStore.eventSites[this.props.match.params.name]["eventInfo"][0]["trailer-url"]}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />          
            </div>
          </div>
       </React.Fragment>
    )
  }

  Payment() {

    return (
      <React.Fragment>
        <div onClick={this.props.siteStore.turnOffModal} className="backdrop" />
        <div className="ticket-modal ticket-modal-show">
          <ImageIcon
            key={`back-icon-Close Modal`}
            className={"back-button-modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={this.props.siteStore.turnOffModal}
          />
          <div className={`ticket-modal__container`}>
           <PaymentOverview priceID={this.state.priceID} prodID={this.state.prodID}/> 
          </div>

        </div>
      </React.Fragment>
    )
  }
  handleNavigate = myRef => {
  
    if (this.state.tab != 0) {
      this.setState({tab: 0});
      let domElement = document.getElementById("tabs");
      domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      let el = myRef.current;
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };


  render() {
    if (!this.props.siteStore.eventSites[this.props.match.params.name]) {
      return <Redirect to='/'/>;
    }
    let siteInfo = this.props.siteStore.eventSites[this.props.match.params.name];
    let eventInfo = siteInfo["eventInfo"][0];
    // let heroBackground = this.props.siteStore.eventImages["hero-background"];

    console.log("eventInfo",eventInfo);

    const myRef = React.createRef();

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    let thumbnail = heroImg;
    const backgroundColor =  "#000321";
    const backgroundHelp =  "#000112";
    const backgroundHelp2 =  "#00010a";
    const blackColor =  "#000000";

    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 55%, ${backgroundColor3} 60%, ${backgroundColor4} 65%, ${backgroundColor5}  70%, ${backgroundColor6} 75%, ${backgroundColor} 80%,  ${backgroundHelp} 85%,  ${backgroundHelp2} 90%, ${blackColor} 100%), url(${heroImg})`,
      backgroundPosition: "center",
      objectFit: "cover",
      height: "100vh",
      margin: "0",
      position: "absolute",
      width: "100%"
    };

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

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