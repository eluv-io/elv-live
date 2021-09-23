import React from "react";
import Carousel from "Common/Carousel";
import ImageIcon from "Common/ImageIcon";
import {Link} from "react-router-dom";

const EventCard = ({event, hardLink=false}) => {
  let date = new Date();
  let month;
  try {
    date = new Date(event.date);
    month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).slice(0, 3);
  } catch(error) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse event date", event, error);
    return null;
  }

  if(!date || !month) { return null; }

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

  events = events.sort((a, b) => a.date < b.date ? -1 : 1);

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toISOString().split("T")[0];

  return (
    <div className={`upcoming-events ${className}`}>
      <h2 className="upcoming-events__header">{ header }</h2>
      <Carousel
        startIndex={Math.max(0, events.findIndex(event => event.date >= yesterday))}
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
