import React from "react";
import {inject, observer} from "mobx-react";

import {NavLink} from "react-router-dom";
import {ToggleZendesk} from "Utils/Misc";
import Countdown from "Common/Countdown";
import ImageIcon from "Common/ImageIcon";
import EluvioLogo from "Images/logo/eluvio-logo";
import Footer from "Layout/Footer";
import {Redirect} from "react-router";

@inject("siteStore")
@observer
class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      couponMode: props.location.pathname.endsWith("coupon-redeemed"),
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
    ToggleZendesk(true);
  }

  Countdown({diff, countdown}) {
    if(diff <= 0) {
      return (
        <NavLink className="landing-page__enter-event" to={this.props.siteStore.SitePath("stream")}>
          Enter Event
        </NavLink>
      );
    }

    const landingInfo = this.props.siteStore.currentSiteInfo.event_landing_page || {};
    const hasCountdown = true || this.props.siteStore.currentSiteTicketSku.start_time && !landingInfo.hide_countdown;

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
                <div className="landing-page__text landing-page__text-redeemed">Your Code is Redeemed</div>
                { !hasCountdown ? null : <div className="landing-page__text landing-page__text-begins">Event Begins In</div> }
              </>
          }
        </div>

        {
          // Countdown
          !hasCountdown ? <br /> :
            <div className="landing-page__text landing-page__text-countdown">{countdown}</div>
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

    const couponInfo = (this.props.siteStore.currentSiteInfo.coupon_redemption || {});

    return (
      <div className="page-container landing-page">
        <div className="landing-page__content">
          { this.Header() }
          {
            this.state.couponMode && couponInfo.coupon_mode ?
              <>
                <div className="landing-page__text">{ couponInfo.event_page_message_1 || "Your Coupon is Redeemed" }</div>
                <br />
                <div className="landing-page__text landing-page__text-return">
                  { couponInfo.event_page_message_2 || "Please check your email for further event details." }
                </div>
                <br />
                <br />
                <div className="landing-page__text">Confirmation ID:</div>
                <div className="landing-page__text landing-page__text-confirmation">{ "asd" || this.props.siteStore.currentSiteTicket.couponConfirmationId }</div>
              </> :
              <Countdown
                time={this.props.siteStore.currentSiteTicketSku.start_time}
                Render={({diff, countdown}) => this.Countdown({diff, countdown})}
              />
          }
          <div className="landing-page__powered-by">
            <a href="https://live.eluv.io" target="_blank" className="landing-page__powered-by__tagline">
              Powered by <ImageIcon icon={EluvioLogo} className="landing-page__powered-by__logo" title="Eluv.io" />
            </a>
          </div>
          <NavLink className="landing-page__new-code-link" to={this.props.siteStore.SitePath("code")}>Want to use a different ticket?</NavLink>
        </div>
        <Footer noSponsors />
      </div>
    );
  }
}

export default Landing;
