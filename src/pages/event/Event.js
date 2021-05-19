import React, {lazy, Suspense} from "react";
import {inject, observer} from "mobx-react";

import EventTabs from "Event/tabs/EventTabs";
import Footer from "Layout/Footer";

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
      heroBackground: null,
      mobile: window.innerWidth < 700
    };

    this.HandleResize = this.HandleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.HandleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.HandleResize);
  }

  HandleResize() {
    const mobile = window.innerWidth < 700;
    if(mobile !== this.state.mobile) {
      this.setState({mobile});
    }
  }

  Promos() {
    if(!this.state.showPromo) { return; }

    return (
      <Modal
        Toggle={show => this.setState({showPromo: show})}
        className="modal--promo-modal"
        content={
          <Suspense fallback={<div/>}>
            {this.props.siteStore.promos.length > 0 ? <PromoPlayer/>
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
    }, () => {
      window.scrollTo({top: document.getElementById("buy-tickets-target").getBoundingClientRect().top + window.pageYOffset - 65, behavior: "smooth"});
    });
  };

  render() {
    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    const heroKey = this.state.mobile && this.props.siteStore.SiteHasImage("hero_background_mobile") ? "hero_background_mobile" : "hero_background";
    const headerKey = this.props.siteStore.darkMode ? "header_light" : "header_dark";
    const hasHeaderImage = this.props.siteStore.SiteHasImage(headerKey);

    return (
      <div className="page-container event-page">
        <div className="event-page__hero-container" style={{height: window.innerHeight}}>
          <div className={`event-page__hero ${this.props.siteStore.eventInfo.hero_info ? "event-page__hero-high-gradient" : ""}`} style={{backgroundImage: `url(${this.props.siteStore.SiteImageUrl(heroKey)})`}} />
          <div className={`event-page__heading ${this.props.siteStore.eventInfo.hero_info ? "event-page__heading-hidden" : ""}`}>
            {
              hasHeaderImage ?
                <div className="event-page__header-logo">
                  <img className="event-page_header-logo-image" src={this.props.siteStore.SiteImageUrl(headerKey)} alt={this.props.siteStore.eventInfo.event_header} />
                </div>
                : null
            }

            <h1 className={`event-page__header-name ${hasHeaderImage ? "hidden" : ""}`}>
              { this.props.siteStore.eventInfo.event_header }
            </h1>

            {
              this.props.siteStore.eventInfo.event_subheader ?
                <h2 className="event-page__subheader">{this.props.siteStore.eventInfo.event_subheader}</h2> : null
            }
            {
              this.props.siteStore.eventInfo.date ?
                <h2 className="event-page__date">{this.props.siteStore.eventInfo.date}</h2> : null
            }
          </div>

          <div className="event-page__buttons">
            {
              this.props.siteStore.currentSiteInfo.state === "Live Ended" ||
                // Any tickets available for purchase
                !this.props.siteStore.ticketClasses.find(ticketClass => !ticketClass.hidden && (!ticketClass.release_date || ticketClass.release_date < new Date())) ?
                null :
                <button
                  className={this.props.siteStore.promos.length > 0 ? "btn" : "btn btn--gold"}
                  onClick={() => this.handleNavigate()}
                >
                  Buy Tickets
                </button>
            }
            {
              this.props.siteStore.promos.length > 0 ?
                <button onClick={() => this.setState({showPromo: true})} className="btn btn--gold">
                  Watch Promo
                </button> : null
            }
          </div>
        </div>
        <div className="event-page__overview" id="buy-tickets-target">
          <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} />
        </div>

        { this.state.showPromo ? this.Promos(): null}
        <Footer />
      </div>
    );
  }
}

export default Event;
