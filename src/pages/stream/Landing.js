import React from "react";
import {inject, observer} from "mobx-react";

import ColoredLogo from "Assets/images/logo/coloredEluvioLiveLogo.png";
import {NavLink, Redirect} from "react-router-dom";
import {ToggleZendesk} from "Utils/Misc";

@inject("siteStore")
@observer
class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tick: 0,
      interval:
        this.props.siteStore.currentSiteTicketSku.start_time
          ? setInterval(() => this.setState({tick: this.state.tick + 1}), 1000) : null
    };
  }

  componentDidMount() {
    ToggleZendesk(false);
  }

  componentWillUnmount() {
    clearTimeout(this.state.interval);

    ToggleZendesk(true);
  }

  Countdown() {
    const diffSeconds = (new Date(this.props.siteStore.currentSiteTicketSku.start_time) - new Date()) / 1000;
    const days = Math.floor(diffSeconds / 60 / 60 / 24);
    const hours = Math.floor((diffSeconds / 60 / 60) % 24);
    let minutes = Math.floor(diffSeconds / 60 % 60);

    if(days === 0 && hours === 0 && minutes === 0) {
      minutes = 1;
    }

    let countdownString = "";
    if(days > 0) {
      countdownString += `${days} ${days === 1 ? "day" : "days"} `;
    }

    if(hours > 0) {
      countdownString += `${hours} ${hours === 1 ? "hour" : "hours"} `;
    }

    if(minutes > 0) {
      countdownString += `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }

    if(diffSeconds <= 0) {
      clearInterval(this.state.interval);
      return (
        <NavLink className="landing-page__enter-event" to={this.props.siteStore.SitePath("stream")}>Enter
          Event</NavLink>
      );
    }

    const landingInfo = this.props.siteStore.currentSiteInfo.event_landing_page || {};
    const hasCountdown = this.props.siteStore.currentSiteTicketSku.start_time && !landingInfo.hide_countdown;

    return (
      <>
        <div className="landing-page__text-group">
          {
            // Message 1
            landingInfo.message_1 ?
              <div className="landing-page__text">
                { landingInfo.message_1 }
              </div> :
              <>
                <div className="landing-page__text landing-page__text-redeemed">Your Ticket is Redeemed</div>
                { !hasCountdown ? null : <div className="landing-page__text landing-page__text-begins">Event Begins In</div> }
              </>
          }
        </div>

        {
          // Countdown
          !hasCountdown ? <br /> :
            <div className="landing-page__text landing-page__text-countdown">{countdownString}</div>
        }

        <div className="landing-page__text landing-page__text-return">
          {
            // Message 2
            landingInfo.message_2 || "Use the link in your ticket email to return here at the time of the event"
          }
        </div>
      </>
    );
  }

  Header() {
    const landingInfo = this.props.siteStore.currentSiteInfo.event_landing_page || {};

    if(landingInfo.header_image) {
      return (
        <img
          className="landing-page__event-logo"
          src={this.props.siteStore.SiteUrl("info/event_landing_page/header_image")}
          alt={landingInfo.header_text || this.props.siteStore.eventInfo.event_header}
        />
      );
    }

    if(landingInfo.header_text) {
      return <h2 className="landing-page__event-header">{ landingInfo.header_text }</h2>;
    }

    return (
      this.props.siteStore.SiteHasImage("header_light") ?
        <img className="landing-page__event-logo" src={this.props.siteStore.SiteImageUrl("header_light")} alt={this.props.siteStore.eventInfo.event_header} /> :
        <h2 className="landing-page__event-header">{ this.props.siteStore.eventInfo.event_header }</h2>
    );
  }

  render() {
    if(!this.props.siteStore.currentSiteTicketSku) {
      return <Redirect to={this.props.siteStore.SitePath("code")} />;
    }

    return (
      <div className="page-container landing-page">
        <div className="landing-page__content">
          <img className="landing-page__logo" src={ColoredLogo} alt="Eluvio Live" />
          <div className="landing-page__text landing-page__text-presents">Presents</div>
          { this.Header() }
          { this.Countdown() }
          <NavLink className="landing-page__new-code-link" to={this.props.siteStore.SitePath("code")}>Want to use a different ticket?</NavLink>
        </div>
      </div>
    );
  }
}

export default Landing;
