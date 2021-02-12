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
            {this.props.siteStore.hasPromos ? <PromoPlayer />
              :<div className="error-message error-message-modal"> No Promos Available</div>
            }
          </Suspense>
        </div>
      </>
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
        <div className="event-hero-background" style={{backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0) 30%, #FFFEF7 80%, rgba(255, 255, 255, 1) 90%, rgba(255, 255, 255, 1) 100%), url(${this.props.siteStore.heroBackground})`}} />
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
            <h1 className="event-hero-header">{ this.props.siteStore.eventInfo.event_subheader }</h1>
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
                <button onClick={this.OpenPromoModal} className="btn--gold">
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
        <Footer />
      </div>
    );
  }
}

export default Event;
