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
      interval: setInterval(() => this.setState({tick: this.state.tick + 1}), 1000)
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
    if(this.props.siteStore.eventActive) {
      return (
        <NavLink className="landing-page__enter-event" to={this.props.siteStore.SitePath("stream")}>Enter Event</NavLink>
      );
    }

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

    return (
      <>
        <div className="landing-page__text-group">
          <div className="landing-page__text landing-page__text-redeemed">Your Ticket is Redeemed</div>
          <div className="landing-page__text landing-page__text-begins">Event Begins In</div>
        </div>
        <div className="landing-page__text landing-page__text-countdown">{ countdownString }</div>
        <div className="landing-page__text landing-page__text-return">Use the link in your ticket email to return here at the time of the event</div>
      </>
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
          <img className="landing-page__event-logo" src={this.props.siteStore.SiteImageUrl("header_light")} alt={this.props.siteStore.eventInfo.event_header} />
          { this.Countdown() }
          <NavLink className="landing-page__new-code-link" to={this.props.siteStore.SitePath("code")}>Want to use a different ticket?</NavLink>
        </div>
      </div>
    );
  }
}

export default Landing;
