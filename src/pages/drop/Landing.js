import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import Logo from "Assets/images/logo/whiteEluvioLogo.svg";
import {NavLink, withRouter} from "react-router-dom";
import {ToggleZendesk} from "Utils/Misc";
import Countdown from "Common/Countdown";
import ImageIcon from "Common/ImageIcon";

@inject("rootStore")
@inject("siteStore")
@withRouter
@observer
class Landing extends React.Component {
  componentDidMount() {
    ToggleZendesk(false);
  }

  componentWillUnmount() {
    ToggleZendesk(true);
  }

  Drop() {
    return this.props.siteStore.currentSiteInfo.drops.find(drop => drop.uuid === this.props.match.params.dropId);
  }

  Countdown({diff, countdown}) {
    if(diff <= 0) {
      return (
        <div className="landing-page__text">
          <div className="landing-page__text landing-page__text-begins">Event Happening Now!</div>
          {
            this.props.rootStore.walletLoggedIn ?
              <NavLink className="landing-page__enter-event" to={UrlJoin(this.props.location.pathname, "event")}>
                Enter Event
              </NavLink> :
              <button
                className="landing-page__enter-event"
                onClick={() => {
                  this.props.rootStore.SetWalletPanelVisibility(
                    {
                      visibility: "modal",
                      location: {
                        page: "wallet"
                      }
                    }
                  );
                }}
              >
                Log In
              </button>
          }
        </div>
      );
    }

    const landingInfo = this.props.siteStore.currentSiteInfo.event_landing_page || {};
    const noCountdown = landingInfo.hide_countdown;

    return (
      <div className="landing-page__text">
        <div className="landing-page__text-group">
          {
            // Message 1
            landingInfo.message_1 ?
              <div className="landing-page__text">
                { landingInfo.message_1 }
              </div> :
              noCountdown ? null : <div className="landing-page__text landing-page__text-begins">Event Begins In</div>
          }
        </div>

        {
          // Countdown
          noCountdown ? null :
            <div className="landing-page__text landing-page__text-countdown">{countdown}</div>
        }

        <div className="landing-page__text landing-page__text-return">
          {
            // Message 2
            landingInfo.message_2 || "Use the link in your email to return here at the time of the event"
          }
        </div>
      </div>
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
    const landingInfo = this.props.siteStore.currentSiteInfo.event_landing_page || {};

    let background;
    if(landingInfo.background_image || landingInfo.background_image_mobile) {
      let backgroundUrl = landingInfo.background_image ? this.props.siteStore.SiteUrl(UrlJoin("info", "event_landing_page", "background_image")) : "";
      let mobileBackgroundUrl = landingInfo.background_image_mobile ? this.props.siteStore.SiteUrl(UrlJoin("info", "event_landing_page", "background_image_mobile")) : "";

      if(this.props.rootStore.pageWidth > 900) {
        background = <div className="landing-page__background" style={{ backgroundImage: `url("${backgroundUrl || mobileBackgroundUrl}")` }} />;
      } else {
        background = <div className="landing-page__background" style={{ backgroundImage: `url("${mobileBackgroundUrl || backgroundUrl}")` }} />;
      }
    }

    return (
      <div className={`page-container landing-page ${background ? "landing-page-custom-background" : ""}`}>
        { background }
        <div className="landing-page__content">
          { this.Header() }
          <Countdown
            time={this.Drop().start_date}
            Render={({diff, countdown}) => this.Countdown({diff, countdown})}
          />
          <ImageIcon icon={Logo} className="landing-page__logo" title="Eluvio"/>
        </div>
      </div>
    );
  }
}

export default Landing;
