import React, {lazy, Suspense} from "react";
import {inject, observer} from "mobx-react";

import EventTabs from "Event/tabs/EventTabs";
import Footer from "Layout/Footer";

import Modal from "Common/Modal";
import UpcomingEvents from "Common/UpcomingEvents";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

const PromoPlayer = lazy(() => import("Event/PromoPlayer"));

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.mobileCutoff = this.props.siteStore.eventInfo.hero_info ? 600 : 900;

    this.state = {
      showPromo: false,
      tab: 0,
      heroBackground: null,
      width: window.innerWidth
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
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      if(this.state.width !== window.innerWidth) {
        this.setState({width: window.innerWidth});
      }
    }, 200);
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

  ScrollToTickets = () => {
    this.setState({
      tab: 0,
    }, () => {
      const target = document.querySelector(".ticket-group") || document.querySelector("event-page__overview");
      window.scrollTo({top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth"});
    });
  };

  Actions() {
    if(this.props.siteStore.isDropEvent) {
      return (
        <div className="event-page__buttons">
          {
            this.props.rootStore.walletLoggedIn ? null :
              <button
                className="btn btn--gold"
                onClick={() => this.props.rootStore.SetWalletPanelVisibility("modal")}
              >
                Get Started
              </button>
          }

          <button onClick={() => this.setState({showPromo: true})} className={this.props.rootStore.walletLoggedIn ? "btn btn--gold" : "btn"}>
            Join the Drop
          </button>
        </div>
      );
    }

    return (
      <div className="event-page__buttons">
        {
          // Ended
          this.props.siteStore.currentSiteInfo.state === "Live Ended" ||
          // Any tickets available for purchase
          !this.props.siteStore.ticketClasses.find(ticketClass => !ticketClass.hidden && (!ticketClass.release_date || ticketClass.release_date < new Date())) ?
            null :
            <button
              className={this.props.siteStore.promos.length > 0 ? "btn" : "btn btn--gold"}
              onClick={() => this.ScrollToTickets()}
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
    );
  }

  HeroVideo() {
    const heroVideo = this.props.siteStore.currentSiteInfo.event_images.hero_video;

    if(!heroVideo || !heroVideo["."]) { return; }

    return (
      (
        <div className="event-page__hero-video-container">
          <div
            className="event-page__hero-video"
            ref={element => {
              if(!element || this.state.player) { return; }

              this.setState({
                player: (
                  new EluvioPlayer(
                    element,
                    {
                      clientOptions: {
                        client: this.props.rootStore.client
                      },
                      sourceOptions: {
                        playoutParameters: {
                          versionHash: heroVideo["."].source
                        }
                      },
                      playerOptions: {
                        watermark: EluvioPlayerParameters.watermark.OFF,
                        muted: EluvioPlayerParameters.muted.ON,
                        autoplay: EluvioPlayerParameters.autoplay.WHEN_VISIBLE,
                        controls: EluvioPlayerParameters.controls.OFF,
                        playerCallback: ({videoElement}) => this.setState({video: videoElement})
                      }
                    }
                  )
                )
              });
            }}
          />
        </div>
      )
    );
  }

  render() {
    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };

    const mobile = this.state.width < this.mobileCutoff;
    const heroKey = mobile && this.props.siteStore.SiteHasImage("hero_background_mobile") ? "hero_background_mobile" : "hero_background";
    const headerKey = this.props.siteStore.darkMode ? "header_light" : "header_dark";
    const hasHeaderImage = this.props.siteStore.SiteHasImage(headerKey);

    let style = { height: window.innerHeight - (window.innerWidth < 1400 ? 60 : 0) };
    if(this.props.siteStore.eventInfo.hero_info && window.innerWidth > this.mobileCutoff) {
      style = {};
    }

    return (
      <div className={`page-container event-page ${this.props.siteStore.eventInfo.hero_info ? "event-page-no-header-info" : ""} ${mobile ? "event-page-mobile" : ""}`}>
        <div className="event-page__hero-container" style={style}>
          <div className="event-page__hero" style={{backgroundImage: `url(${this.props.siteStore.SiteImageUrl(heroKey)})`}} />
          { this.HeroVideo() }
          <div className="event-page__heading">
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
              this.props.siteStore.isDropEvent ?
                <h2 className="event-page__date-header">{this.props.siteStore.eventInfo.date_subheader}</h2> :
                this.props.siteStore.eventInfo.date ?
                  <h2 className="event-page__date">{this.props.siteStore.eventInfo.date}</h2> : null
            }
          </div>

          { this.Actions() }
        </div>

        { this.props.siteStore.isDropEvent ? <UpcomingEvents header="Upcoming Drops" events={this.props.siteStore.upcomingDropEvents} /> : null }

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
