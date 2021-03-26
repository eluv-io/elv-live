import React, {lazy, Suspense} from "react";
import {inject, observer} from "mobx-react";

import EventTabs from "Event/tabs/EventTabs";
import Footer from "Layout/Footer";
import {FormatDateString} from "Utils/Misc";

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
      mobile: window.innerHeight > window.innerWidth
    };

    this.HandleResize = this.HandleResize.bind(this);
  }

  componentDidMount() {
    this.props.siteStore.LoadPromos();
    window.addEventListener("resize", this.HandleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.HandleResize);
  }

  HandleResize() {
    const mobile = window.innerWidth < 900;
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
    }, () => {
      window.scrollTo({top: document.getElementById("overview-container").getBoundingClientRect().top + window.pageYOffset - 65, behavior: "smooth"});
    });
  };


  render() {
    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    const heroKey = this.state.mobile && this.props.siteStore.SiteHasImage("hero_background_mobile") ? "hero_background_mobile" : "hero_background";

    return (
      <div className="page-container event-page">
        <div className="event-page__hero-container">
          <div className="event-page__hero" style={{backgroundImage: `url(${this.props.siteStore.SiteImageUrl(heroKey)})`}} />
          <div className="event-page__heading">
            {
              this.props.siteStore.SiteHasImage("header_dark") ?
                <div className="event-page__header-logo">
                  <img className="event-page_header-logo-image" src={this.props.siteStore.SiteImageUrl("header_dark")}/>
                </div>
                :
                <h1 className="event-page__header-name">{ this.props.siteStore.eventInfo.event_header }</h1>
            }
            {
              this.props.siteStore.eventInfo.event_subheader ?
                <h2 className="event-page__subheader">{this.props.siteStore.eventInfo.event_subheader}</h2> : null
            }
            <h2 className="event-page__date">{ FormatDateString(this.props.siteStore.eventInfo["date"]) }</h2>
          </div>

          <div className="event-page__buttons">
            <button
              className={this.props.siteStore.hasPromos ? "btn" : "btn btn--gold"}
              onClick={() => this.handleNavigate()}
            >
              Buy Tickets
            </button>
            {
              this.props.siteStore.hasPromos ?
                <button onClick={() => this.setState({showPromo: true})} className="btn btn--gold">
                  Watch Promo
                </button> : null
            }
          </div>
        </div>
        <div className="event-page__overview">
          <EventTabs title={null} tab={this.state.tab} handleChange={handleChange} type={"concert"} />
        </div>

        { this.state.showPromo ? this.Promos(): null}
        <Footer />
      </div>
    );
  }
}

export default Event;
