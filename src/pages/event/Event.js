import React, {lazy, Suspense} from "react";
import {inject, observer} from "mobx-react";

import CloseIcon from "Icons/x.svg";
import Timer from "Common/Timer";
import EventTabs from "Event/tabs/EventTabs";
import Footer from "Layout/Footer";
import {FormatDateString} from "Utils/Misc";

import ImageIcon from "Common/ImageIcon";

const PromoPlayer = lazy(() => import("Event/PromoPlayer"));

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPromo: false,
      tab: 0,
      heroBackground: null
    };

    this.OpenPromoModal = this.OpenPromoModal.bind(this);
    this.ClosePromoModal = this.ClosePromoModal.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.siteStore.LoadPromos();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ClosePromoModal);
  }

  OpenPromoModal() {
    document.addEventListener("keydown", this.ClosePromoModal);

    this.setState({showPromo: true});
  }

  ClosePromoModal(event) {
    if(event && (event.key || "").toLowerCase() !== "escape") { return; }

    this.setState({showPromo: false});
  }

  Promos() {
    if(!this.state.showPromo) { return; }

    return (
      <>
        <div onClick={() => this.ClosePromoModal()} className="backdrop" />
        <ImageIcon
          key={"back-icon-close-modal"}
          className={"back-button-modal"}
          title={"Close Modal"}
          icon={CloseIcon}
          onClick={() => this.ClosePromoModal()}
        />

        <div className="modal show">
          <Suspense fallback={<div />}>
            <PromoPlayer />
          </Suspense>
        </div>
      </>
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

    return (
      <div className="page-container event-page-container">
        <div className="event-hero-background" style={{backgroundImage: `url(${this.props.siteStore.heroBackground})`}} />
        <div className="main-content-container event-container">
          <div className="event-container__heading">
            {
              // TODO: Use event_logo or event_header
            }
            <h1 className="name">{ this.props.siteStore.eventInfo.event_header }</h1>
            <h1 className="location">{ this.props.siteStore.eventInfo.event_subheader }</h1>
            <h1 className="time">{ FormatDateString(this.props.siteStore.eventInfo["date"]) }</h1>
          </div>

          <div className="event-container__button">
            <button
              className={`btnPlay ${this.props.siteStore.hasPromos ? "btnDetails__heroPlay" : "btnDetails__heroDetail"}`}
              onClick={() => this.handleNavigate()}
            >
              Buy Tickets
            </button>
            {
              this.props.siteStore.hasPromos ?
                <button onClick={this.OpenPromoModal} className="btnPlay btnDetails__heroDetail">
                  Watch Promo
                </button> : null
            }
          </div>
          <div className="event-container__countdown">
            <Timer classProp="ticket-icon" premiereTime={this.props.siteStore.eventInfo.date} />
          </div>


          <div className="event-container__overview" id="tickets-section">
            <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} />
          </div>
        </div>

        { this.state.showPromo ? this.Promos(): null}
        <Footer />
      </div>
    );
  }
}

export default Event;
