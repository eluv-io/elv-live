import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import {NavLink, withRouter} from "react-router-dom";
import {ToggleZendesk} from "Utils/Misc";
import Countdown from "Common/Countdown";
import Footer from "Layout/Footer";
import AddToCalendar from "react-add-to-calendar";
import {Loader} from "Common/Loaders";
import {Redirect} from "react-router";

@inject("rootStore")
@inject("siteStore")
@withRouter
@observer
class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reloading: false
    };
  }

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
    return this.props.siteStore.dropEvents.find(drop => drop.uuid === this.props.match.params.dropId);
  }

  Countdown({diff, countdown}) {
    const drop = this.Drop();

    if(diff <= 0) {
      if(drop.type === "marketplace_drop") {
        return (
          <div className="landing-page__text-container">
            <div className="landing-page__text landing-page__text-begins">{ drop.header }</div>
            {
              this.state.reloading ?
                <Loader/> :
                <button
                  className="landing-page__enter-marketplace"
                  onClick={async () => {
                    await this.props.rootStore.SetWalletPanelVisibility(
                      {
                        visibility: "full",
                        location: {
                          page: "marketplace",
                          params: {
                            tenantSlug: this.props.siteStore.currentSiteInfo.marketplace_info.tenant_slug,
                            marketplaceSlug: this.props.siteStore.currentSiteInfo.marketplace_info.marketplace_slug
                          }
                        }
                      }
                    );

                    await this.props.rootStore.SetMarketplaceFilters({filters: drop.marketplace_filters});
                  }}
                >
                  Go to the Marketplace
                </button>
            }
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

    const landingInfo = drop.landing_page_info || this.props.siteStore.currentSiteInfo.event_landing_page || {};
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
    const landingInfo = this.Drop().landing_page_info || this.props.siteStore.currentSiteInfo.event_landing_page || {};

    if(landingInfo.header_image) {
      return (
        <img
          className="landing-page__event-logo"
          src={landingInfo.header_image.url}
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
    const drop = this.Drop();

    if(!drop) {
      return <Redirect to={this.props.siteStore.SitePath("")} />;
    }

    if(drop.requires_ticket && !this.props.siteStore.currentSiteTicketSku) {
      return <Redirect to={this.props.siteStore.SitePath("code")} />;
    }

    const landingInfo = drop.landing_page_info || this.props.siteStore.currentSiteInfo.event_landing_page || {};

    let background;
    if(landingInfo.background_image || landingInfo.background_image_mobile) {
      let backgroundUrl = landingInfo.background_image ? landingInfo.background_image.url : "";
      let mobileBackgroundUrl = landingInfo.background_image_mobile ? landingInfo.background_image_mobile.url : "";

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
            time={drop.start_date}
            Render={({diff, countdown}) => this.Countdown({diff, countdown})}
            OnEnded={async () => {
              if(drop.type === "marketplace_drop") {
                this.setState({reloading: true});

                try {
                  await this.props.siteStore.ReloadMarketplace();
                } finally {
                  this.setState({reloading: false});
                }
              }
            }}
          />
        </div>
        {
          drop.requires_ticket ?
            <NavLink className="landing-page__new-code-link" to={this.props.siteStore.SitePath("code")}>Want to use a different ticket?</NavLink> : null
        }
        <Footer />
      </div>
    );
  }
}

export default Landing;
