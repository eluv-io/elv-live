import React from "react";
import {inject, observer} from "mobx-react";

import CloseIcon from "Icons/x.svg";
import Timer from "Common/Timer";
import EventTabs from "Event/tabs/EventTabs";
import Navigation from  "Layout/Navigation";
import PaymentOverview from "Event/payment/PaymentOverview";
import Footer from "Layout/Footer";
import {FormatDateString} from "Utils/Misc";
import smoothscroll from "smoothscroll-polyfill";

import ImageIcon from "Common/ImageIcon";

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
              src={
                this.props.siteStore.eventInfo.trailer_url
              }
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
        <div onClick={this.props.siteStore.CloseCheckoutModal} className="backdrop" />
        <div className="ticket-modal ticket-modal-show">
          <ImageIcon
            key={"back-icon-Close Modal"}
            className={"back-button-modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={this.props.siteStore.CloseCheckoutModal}
          />
          <div className={"ticket-modal__container"}>
            <PaymentOverview />
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleNavigate = () => {
    // window.__forceSmoothScrollPolyfill__ = true;

    smoothscroll.polyfill();
    this.setState({
      tab: 0,
    }, () => document.getElementById("tickets-section").scrollIntoView({behavior: "smooth", block: "end"}));
  };


  render() {
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
      width: "100%",
      minHeight: "600px"
    };


    return (
      <div className="event" id="event-page">
        <Navigation />

        <div style={backgroundStyle} />

        <div className="event-container">
          <div className="event-container__heading">
            {this.props.siteStore.artistLogo ?
              <div className="event-hero-logo-container">
                <img className="event-hero-logo" src={this.props.siteStore.artistLogo}/> 
              </div> 
              : 
              <h1 className="event-hero-name">{ this.props.siteStore.eventInfo.event_header }</h1>
            }
            <h1 className="event-hero-header">{ this.props.siteStore.eventInfo.event_subheader }</h1>
            <h1 className="event-hero-date">{ FormatDateString(this.props.siteStore.eventInfo.date) }</h1>

          </div>

          <div className="event-container__button">
            <button className="btn" onClick={() => this.handleNavigate()}>
              Buy Tickets
            </button>
            <button onClick={() => this.setState({showTrailer: true})} className="btn--gold">
              Watch Promo
            </button>
          </div>
          
          {/* <div className="event-container__countdown">
            <Timer classProp="ticket-icon" premiereTime={this.props.siteStore.eventInfo.date} />
          </div> */}


          <div className="event-container__info" id="tickets-section">
            <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} />
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
