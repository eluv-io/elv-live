import React, {lazy, Suspense} from "react";
import {inject, observer} from "mobx-react";

import CloseIcon from "Icons/x.svg";
import Timer from "Common/Timer";
import EventTabs from "Event/tabs/EventTabs";
import Footer from "Layout/Footer";
import {FormatDateString} from "Utils/Misc";

import ImageIcon from "Common/ImageIcon";
import Checkout from "Event/checkout/Checkout";
import Modal from "Common/Modal";

const PromoPlayer = lazy(() => import("Event/PromoPlayer"));

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPromo: false,
      tab: 0,
      heroBackground: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.siteStore.LoadPromos();
  }

  Promos() {
    if(!this.state.showPromo) { return; }

    return (
      <Modal
        Toggle={show => this.setState({showPromo: show})}
        className="modal--promo-modal"
        content={
          <Suspense fallback={<div/>}>
            {this.props.siteStore.hasPromos ? <PromoPlayer/>
              : <div className="error-message error-message-modal"> No Promos Available</div>
            }
          </Suspense>
        }
      />
    );
  }

  handleNavigate = () => {
    this.setState({
      tab: 0,
    }, () => document.getElementById("overview-container").scrollIntoView({behavior: "smooth", block: "start"}));
  };


  render() {
    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    return (
      <div className="page-container event-page-container">
        <div className="event-hero-background" style={{backgroundImage: `url(${this.props.siteStore.heroBackground})`}} />
        <div className="main-content-container event-container">
          <div className="event-container__heading">
            {this.props.siteStore.eventLogo ?
              <div className="event-hero-logo-container">
                <img className="event-hero-logo" src={this.props.siteStore.eventLogo}/>
              </div>
              :
              <h1 className="event-hero-name">{ this.props.siteStore.eventInfo.event_header }</h1>
            }
            {/* <h1 className="name">{ this.props.siteStore.eventInfo.event_header }</h1> */}
            {
              this.props.siteStore.eventInfo.event_subheader ?
                <h1 className="event-hero-header">{this.props.siteStore.eventInfo.event_subheader}</h1> : null
            }
            <h1 className="event-hero-date">{ FormatDateString(this.props.siteStore.eventInfo["date"]) }</h1>
          </div>

          <div className="event-container__button">
            <button
              className={this.props.siteStore.hasPromos ? "btn" : "btn--gold"}
              onClick={() => this.handleNavigate()}
            >
              Buy Tickets
            </button>
            {
              this.props.siteStore.hasPromos ?
                <button onClick={() => this.setState({showPromo: true})} className="btn--gold">
                  Watch Promo
                </button> : null
            }
          </div>

          {/* <div className="event-container__countdown">
            <Timer classProp="ticket-icon" premiereTime={this.props.siteStore.eventInfo.date} />
          </div> */}


          <div className="event-container__overview">
            <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} />
          </div>
        </div>

        { this.state.showPromo ? this.Promos(): null}
        { this.props.cartStore.showCheckoutOverlay ? <Checkout /> : null }
        <Footer />
      </div>
    );
  }
}

export default Event;
