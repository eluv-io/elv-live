import React from "react";
import {rootStore, siteStore} from "Stores";
import Carousel from "Common/Carousel";
import ImageIcon from "Common/ImageIcon";
import {Link} from "react-router-dom";
import {DateStatus} from "Utils/Misc";


const EventCard = ({event, hardLink=false}) => {
  let date = new Date();
  let month;
  try {
    date = new Date(event.start_date);
    month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).slice(0, 3);
  } catch(error) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse event date", event, error);
    return null;
  }

  if(!date || !month) { return null; }

  const openMarketplace = event.ongoing && event.type === "marketplace_drop" && rootStore.app === "site";
  return (
    <div className="upcoming-events__event-card">
      <div className="upcoming-events__event-card__date">
        <div className="upcoming-events__event-card__day">
          { date.getDate() }
        </div>
        <div className="upcoming-events__event-card__month">
          { month }
        </div>
      </div>
      {
        openMarketplace ?
          <button
            onClick={async () => {
              await rootStore.SetWalletPanelVisibility(
                {
                  visibility: "full",
                  location: {
                    page: event.store_page === "Listings" ? "marketplaceListings" : "marketplace",
                    params: {
                      tenantSlug: siteStore.currentSiteInfo.marketplace_info.tenant_slug,
                      marketplaceSlug: siteStore.currentSiteInfo.marketplace_info.marketplace_slug
                    }
                  }
                }
              );

              await rootStore.SetMarketplaceFilters({filters: event.marketplace_filters});
            }}
            className="upcoming-events__event-card__info"
          >
            <div className="upcoming-events__event-card__square">
              <ImageIcon icon={event.image} title={event.header} className="upcoming-events__event-card__image" />
            </div>
          </button> :
          hardLink ?
            <a href={event.link} className="upcoming-events__event-card__info">
              <div className="upcoming-events__event-card__square">
                <ImageIcon icon={event.image} title={event.header} className="upcoming-events__event-card__image" />
              </div>
            </a> :
            <Link to={event.link} className="upcoming-events__event-card__info">
              <div className="upcoming-events__event-card__square">
                <ImageIcon icon={event.image} title={event.header} className="upcoming-events__event-card__image" />
              </div>
            </Link>
      }
    </div>
  );
};

const UpcomingEvents = ({header, events, hardLink=false, className=""}) => {
  if(!events || events.length === 0) { return null; }

  // Sort events by start date, but put ongoing events before events that have passed, even if they started later.
  events = events
    .map(event =>  {
      const { ongoing, past } = DateStatus(event.start_date, event.end_date);
      return {
        ...event,
        past,
        ongoing
      };
    })
    .sort((a, b) => {
      if(a.past && b.ongoing) {
        return -1;
      } else if(b.past && a.ongoing) {
        return 1;
      }

      return a.start_date < b.start_date ? -1 : 1;
    });

  const nextEventIndex = events.findIndex(event => !event.past);
  return (
    <div className={`upcoming-events ${className}`}>
      { header ? <h2 className="upcoming-events__header">{ header }</h2> : null }
      <Carousel
        startIndex={Math.max(0, nextEventIndex >= 0 ? nextEventIndex : events.length - 1)}
        minVisible={1}
        maxVisible={4}
        className="upcoming-events__carousel"
        elements={events.map((event, index) => <EventCard key={`event-card-${index}`} event={event} hardLink={hardLink} />)}
        placeholderClassname="upcoming-events__event-card upcoming-events__event-card-placeholder"
      />
    </div>
  );
};

export default UpcomingEvents;
