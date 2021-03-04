// Boilerplate for new class

import React from "react";
import {inject, observer} from "mobx-react";

@inject("mainStore")
@observer
class FeaturedEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0
    };

    this.Event = this.Event.bind(this);
  }

  Event(siteSlug, index) {
    const site = this.props.mainStore.featuredSites[siteSlug];

    if(!site) { return; }

    const header = site.info.event_info.event_header;

    return (
      <div
        className={`featured-event ${index === this.state.selected ? "featured-event-selected" : ""}`}
        key={`featured-event-${index}`}
      >
        <div className="featured-event__hero-image-container">
          <img
            src={this.props.mainStore.FeaturedSiteImageUrl(siteSlug, "hero_background")}
            alt={header}
            className="featured-event__hero-image"
          />
        </div>
        <div className="featured-event__details">
          <h2 className="featured-event__header">{ header }</h2>
          <h3 className="featured-event__subheader">Premiere Event Streaming Soon</h3>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="featured-events">
        { Object.keys(this.props.mainStore.featuredSites).map(this.Event) }
      </div>
    );
  }
}

export default FeaturedEvents;
