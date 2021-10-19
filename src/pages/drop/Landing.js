import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import {NavLink, withRouter} from "react-router-dom";
import {ToggleZendesk} from "Utils/Misc";
import Countdown from "Common/Countdown";
import Footer from "Layout/Footer";
import AddToCalendar from "react-add-to-calendar";

@inject("rootStore")
@inject("siteStore")
@withRouter
@observer
class Landing extends React.Component {
  componentDidMount() {
    ToggleZendesk(false);

    if(!this.props.rootStore.walletLoggedIn && this.Drop().requires_login) {
      this.props.rootStore.SetWalletPanelVisibility({
        visibility: "modal",
        location: {
          page: "wallet"
        }
      });
    }
  }

  componentWillUnmount() {
    ToggleZendesk(true);
  }

  Drop() {
    return this.props.siteStore.upcomingDropEvents.find(drop => drop.uuid === this.props.match.params.dropId);
  }

  Countdown({diff, countdown}) {
    const drop = this.Drop();

    if(diff <= 0) {
      if(drop.type === "marketplace_drop") {
        return (
          <div className="landing-page__text-container">
            <div className="landing-page__text landing-page__text-begins">{ drop.header }</div>
            <button
              className="landing-page__enter-marketplace"
              onClick={() => {
                this.props.rootStore.SetWalletPanelVisibility(
                  {
                    visibility: "full",
                    location: {
                      page: "marketplace",
                      params: {
                        marketplaceHash: this.props.siteStore.currentSiteInfo.marketplaceHash
                      }
                    }
                  }
                );
                this.props.rootStore.SetMarketplaceFilters({filters: drop.store_filters});
              }}
            >
              Go to the Marketplace
            </button>
          </div>
        );
      }

      return (
        <div className="landing-page__text-container">
          <div className="landing-page__text landing-page__text-begins">Event Happening Now!</div>
          {
            this.props.rootStore.walletLoggedIn || !this.Drop().requires_login ?
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

    const calendarInfo = drop.calendar || {};
    const calendarEvent = {
      title: calendarInfo.title || drop.header,
      description: calendarInfo.description || drop.header,
      location: calendarInfo.location || window.location.href,
      startTime: drop.start_date,
      endTime: drop.end_date
    };

    return (
      <div className="landing-page__text-container">
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

        <AddToCalendar
          event={calendarEvent}
          buttonLabel="Add to Calendar"
          rootClass="calendar-button-container"
          buttonWrapperClass="calendar-button"
          buttonClassOpen="open"
          dropdownClass="calendar-button-dropdown"
          listItems={[ { outlook: "Outlook" }, { outlookcom: "Outlook.com" }, { apple: "Apple Calendar" }, { google: "Google" }, { yahoo: "Yahoo" } ]}
        />
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
        </div>
        <Footer />
      </div>
    );
  }
}

export default Landing;
