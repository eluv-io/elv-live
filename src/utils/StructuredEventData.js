import CloneDeep from "lodash/cloneDeep";
import UrlJoin from "url-join";

const CreateHeadTag = (type, options) => {
  const tag = document.createElement(type);

  Object.keys(options).forEach(key => tag[key] = options[key]);

  document.querySelector("head").appendChild(tag);
};

const InitializeEventData = siteStore => {
  if(window.eventDataInitialized) { return; }

  const searchInfo = siteStore.currentSiteInfo.search_data || {};
  const eventInfo = siteStore.currentSiteInfo.event_info || {};

  let images = (searchInfo.images || []).map((_, index) =>
    siteStore.SiteUrl(UrlJoin("info", "search_data", "images", index.toString(), "image"))
  );

  const showingOffers = {};
  let earliestDate, latestDate;
  (siteStore.currentSiteInfo.tickets || []).map(ticketClass => {
    ticketClass.skus.map(ticketSku => {
      const date = new Date(ticketSku.start_time).valueOf();

      if(!earliestDate || earliestDate > date) {
        earliestDate = date;
      }

      if(!latestDate || latestDate < date) {
        latestDate = date;
      }

      if(!showingOffers[date]) {
        showingOffers[date] = [];
      }

      Object.keys(ticketSku.price).map(currencyCode => {
        if(!ticketSku.price[currencyCode]) { return; }

        showingOffers[date].push({
          "@type": "Offer",
          name: ticketSku.label,
          price: ticketSku.price[currencyCode],
          priceCurrency: currencyCode,
          availability:  "https://schema.org/InStock",
          url: UrlJoin(window.location.origin, siteStore.baseSitePath),
          validFrom: new Date(ticketClass.release_date || Date.now()).toISOString()
        });
      });
    });
  });

  let baseEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: searchInfo.name || eventInfo.event_title,
    description: searchInfo.description || eventInfo.description,
    startDate: earliestDate ? new Date(earliestDate).toISOString() : "",
    eventAttendanceMode: searchInfo.type === "Online and In-Person" ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: [
      {
        "@type": "VirtualLocation",
        url: UrlJoin(window.location.origin, siteStore.baseSitePath)
      },
      {
        "@type": "Place",
        name: searchInfo.location || eventInfo.location,
        address: searchInfo.location || eventInfo.location
      }
    ],
    image: images,
    performer: (searchInfo.performers || []).map(({name, url, image}, index) => ({
      "@type": "PerformingGroup",
      name,
      url,
      image: !image ? undefined : siteStore.SiteUrl(UrlJoin("info", "search_data", "performers", index.toString(), "image"))
    })),
    organizer: (searchInfo.organizers || []).map(({name, url, image}, index) => ({
      "@type": "Organization",
      name,
      url,
      image: !image ? undefined : siteStore.SiteUrl(UrlJoin("info", "search_data", "organizers", index.toString(), "image"))
    })),
    sponsor: (siteStore.currentSiteInfo.sponsors || []).map(({name, link, image}, index) => ({
      "@type": "Organization",
      name,
      url: link,
      image: !image ? undefined : siteStore.SiteUrl(UrlJoin("info", "sponsors", index.toString(), "image"))
    }))
  };

  if(!searchInfo.showings || searchInfo.showings.length === 0) {
    baseEvent.offers = Object.values(showingOffers);
  } else {
    baseEvent.subEvent = searchInfo.showings.map(showing => {
      let event = CloneDeep(baseEvent);
      event.startDate = new Date(showing.start_time).toISOString();
      event.endDate = showing.end_time ? new Date(showing.start_time).toISOString() : undefined;
      event.offers = showingOffers[new Date(showing.start_time).valueOf()];

      return event;
    });
  }


  CreateHeadTag("script", { type: "application/ld+json", text: JSON.stringify(baseEvent)});

  document
    .getElementsByTagName("meta")
    .namedItem("description")
    .setAttribute("content", searchInfo.description || eventInfo.description);

  document
    .getElementsByTagName("meta")
    .namedItem("robots")
    .setAttribute("content", "");

  if(images.length > 0) {
    CreateHeadTag("meta", { name: "image", property: "og:image", content: images[0] });
  }

  window.eventDataInitialized = true;

  return baseEvent;
};

export default InitializeEventData;
