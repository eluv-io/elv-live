import React, {lazy, Suspense} from "react";
import {inject, observer} from "mobx-react";

import CloseIcon from "Icons/x.svg";
import Timer from "Common/Timer";
import EventTabs from "Event/tabs/EventTabs";
import Navigation from  "Layout/Navigation";
import PaymentOverview from "Event/payment/PaymentOverview";
import Footer from "Layout/Footer";
import {FormatDateString} from "Utils/Misc";

import ImageIcon from "Common/ImageIcon";
import AsyncComponent from "Common/AsyncComponent";

const PromoPlayer = lazy(() => import("Event/PromoPlayer"));

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPromo: false,
      promoIndex: 0,
      tab: 0,
      heroBackground: null
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
  }

  Promos() {
    if(!this.state.showPromo) { return; }

    let nextButton, previousButton;
    if(this.props.siteStore.promos.length > 0) {
      previousButton = (
        <button
          className="previous-promo-button"
          disabled={this.state.promoIndex <= 0}
          onClick={() => this.setState({promoIndex: this.state.promoIndex - 1})}
        />
      );

      nextButton = (
        <button
          className="next-promo-button"
          disabled={this.state.promoIndex >= this.props.siteStore.promos.length - 1}
          onClick={() => this.setState({promoIndex: this.state.promoIndex + 1})}
        />
      );
    }

    return (
      <>
        <div onClick={() => this.setState({showPromo: false})} className="backdrop" />
        <ImageIcon
          key={"back-icon-close-modal"}
          className={"back-button-modal"}
          title={"Close Modal"}
          icon={CloseIcon}
          onClick={() => this.setState({showPromo: false})}
        />

        <div className="modal show">
          { previousButton }
          <Suspense fallback={<div />}>
            <AsyncComponent
              Load={this.props.siteStore.LoadPromos}
              loadingSpin={true}
              render={() => {
                return (
                  <PromoPlayer key={`promo-player-${this.state.promoIndex}`} promoIndex={this.state.promoIndex} />
                );
              }}
            />
          </Suspense>
          { nextButton }
        </div>
      </>
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
      width: "100%"
    };


    return (
      <div className="page-container event-page-container">
        <Navigation />

        <div style={backgroundStyle} />

        <div className="event-container">
          <div className="event-container__heading">
            <h1 className="name">{ this.props.siteStore.eventInfo.artist }</h1>
            <h1 className="location">{ this.props.siteStore.eventInfo.event_header }</h1>
            <h1 className="time">{ FormatDateString(this.props.siteStore.eventInfo["date"]) }</h1>
          </div>

          <div className="event-container__button">
            <button className="btnPlay btnDetails__heroPlay" onClick={() => this.handleNavigate()}>
              Buy Tickets
            </button>
            <button onClick={() => this.setState({showPromo: true})} className="btnPlay btnDetails__heroDetail">
              Watch Promo
            </button>
          </div>
          <div className="event-container__countdown">
            <Timer classProp="ticket-icon" premiereTime={this.props.siteStore.eventInfo.date} />
          </div>


          <div className="event-container__overview" id="tickets-section">
            <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} />
          </div>
        </div>

        { this.state.showPromo ? this.Promos(): null}
        { this.props.siteStore.showCheckout ? this.Payment(): null}

        <Footer />
      </div>
    );
  }
}

export default Event;
