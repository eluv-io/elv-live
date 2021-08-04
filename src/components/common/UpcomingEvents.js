import React from "react";
import Carousel from "Common/Carousel";
import UrlJoin from "url-join";
import ImageIcon from "Common/ImageIcon";

const EventCard = ({event, link=false}) => {
  let date = new Date();
  try {
    date = new Date(event.drop.date);
  } catch(error) {
    console.error("Failed to parse date", error);
  }

  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).slice(0, 3);

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
      <a href={!link ? null : UrlJoin("/", event.site.tenantSlug || "", event.site.siteSlug || "")} className="upcoming-events__event-card__info">
        <div className="upcoming-events__event-card__square">
          <ImageIcon icon={event.dropImage} title={event.drop.event_header} className="upcoming-events__event-card__image" />
        </div>
      </a>
    </div>
  );
};

const UpcomingEvents = ({header, events, link=false, className=""}) => {
  if(!events || events.length === 0) { return null; }

  return (
    <div className={`upcoming-events ${className}`}>
      <h2 className="upcoming-events__header">{ header }</h2>
      <Carousel
        minVisible={1}
        maxVisible={4}
        className="upcoming-events__carousel"
        elements={
          events
            .sort((a, b) => a.drop.date < b.drop.date ? -1 : 1)
            .map((event, index) => <EventCard key={`event-card-${index}`} event={event} link={link} />)
        }
      />
    </div>
  );
};

export default UpcomingEvents;
