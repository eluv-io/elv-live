import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import UrlJoin from "url-join";

import {NavLink} from "react-router-dom";
import {ToggleZendesk} from "Utils/Misc";
import Countdown from "Common/Countdown";
import Footer from "Layout/Footer";
import AddToCalendar from "react-add-to-calendar";
import {Loader} from "Common/Loaders";
import {Redirect, useLocation, useRouteMatch} from "react-router";
import {rootStore, siteStore} from "Stores";

const LandingHeader = observer(({drop}) => {
  const landingInfo = drop.landing_page_info || siteStore.currentSiteInfo.event_landing_page || {};

  if(landingInfo.header_image) {
    return (
      <img
        className="landing-page__event-logo"
        src={landingInfo.header_image.url}
        alt={landingInfo.header_text || siteStore.eventInfo.event_header}
      />
    );
  }

  if(landingInfo.header_text) {
    return <h2 className="landing-page__event-header">{ landingInfo.header_text }</h2>;
  }

  return (
    siteStore.SiteHasImage("header_light") ?
      <img className="landing-page__event-logo" src={siteStore.SiteImageUrl("header_light")} alt={siteStore.eventInfo.event_header} /> :
      <h2 className="landing-page__event-header">{ siteStore.eventInfo.event_header }</h2>
  );
});

const LandingCountdown = observer(({drop, diff, countdown, reloading}) => {
  const location = useLocation();

  if(diff <= 0) {
    if(!rootStore.walletLoaded) { return null; }

    if(drop.type === "marketplace_drop") {
      return (
        <div className="landing-page__text-container">
          <div className="landing-page__text landing-page__text-begins">{ drop.header }</div>
          {
            reloading ?
              <Loader/> :
              <button
                className="landing-page__enter-marketplace"
                onClick={async () => {
                  await rootStore.SetWalletPanelVisibility(
                    {
                      visibility: "full",
                      location: {
                        page: drop.store_page === "Listings" ? "marketplaceListings" : "marketplace",
                        params: {
                          tenantSlug: siteStore.currentSiteInfo.marketplace_info.tenant_slug,
                          marketplaceSlug: siteStore.currentSiteInfo.marketplace_info.marketplace_slug
                        }
                      }
                    }
                  );

                  await rootStore.SetMarketplaceFilters({filters: drop.marketplace_filters});
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
          rootStore.walletLoggedIn || !drop.requires_login ?
            <NavLink className="landing-page__enter-event" to={UrlJoin(location.pathname, "event")}>
              Enter Event
            </NavLink> :
            <button
              className="landing-page__enter-event"
              onClick={() => rootStore.ShowLogin()}
            >
              Log In
            </button>
        }
      </div>
    );
  }

  const landingInfo = drop.landing_page_info || siteStore.currentSiteInfo.event_landing_page || {};
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
});

const Landing = observer(() => {
  const match = useRouteMatch();
  const drop = siteStore.dropEvents.find(drop => drop.uuid === match.params.dropId);

  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    ToggleZendesk(false);

    return () => ToggleZendesk(true);
  }, []);

  useEffect(() => {
    if(rootStore.walletLoaded && !rootStore.walletLoggedIn && drop.requires_login) {
      rootStore.ShowLogin();
    }
  }, [rootStore.walletLoaded, rootStore.walletLoggedIn]);

  if(!drop) {
    return <Redirect to={siteStore.SitePath("")} />;
  }

  if(drop.requires_ticket && !siteStore.currentSiteTicketSku) {
    return <Redirect to={siteStore.SitePath("code")} />;
  }

  const landingInfo = drop.landing_page_info || siteStore.currentSiteInfo.event_landing_page || {};

  let background;
  if(landingInfo.background_image || landingInfo.background_image_mobile) {
    let backgroundUrl = landingInfo.background_image ? landingInfo.background_image.url : "";
    let mobileBackgroundUrl = landingInfo.background_image_mobile ? landingInfo.background_image_mobile.url : "";

    if(rootStore.pageWidth > 900) {
      background = <div className="landing-page__background" style={{ backgroundImage: `url("${backgroundUrl || mobileBackgroundUrl}")` }} />;
    } else {
      background = <div className="landing-page__background" style={{ backgroundImage: `url("${mobileBackgroundUrl || backgroundUrl}")` }} />;
    }
  }

  return (
    <div className={`page-container landing-page ${background ? "landing-page-custom-background" : ""}`}>
      { background }
      <div className="landing-page__content">
        <LandingHeader drop={drop} />
        <Countdown
          time={drop.start_date}
          Render={({diff, countdown}) => <LandingCountdown drop={drop} diff={diff} countdown={countdown} reloading={reloading} />}
          OnEnded={async () => {
            if(drop.type === "marketplace_drop") {
              setReloading(true);

              try {
                await siteStore.ReloadMarketplace();
              } finally {
                setReloading(false);
              }
            }
          }}
        />
        {
          drop.requires_ticket ?
            <div className="landing-page__new-code-link-container">
              <NavLink className="landing-page__new-code-link" to={siteStore.SitePath("code")}>Want to use a different ticket?</NavLink>
            </div> : null
        }
      </div>
      <Footer />
    </div>
  );
});

export default Landing;
