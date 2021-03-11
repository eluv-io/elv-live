import React from "react";
import {inject, observer} from "mobx-react";

import ImageIcon from "Common/ImageIcon";

import LeftArrow from "Icons/left-arrow.svg";
import RightArrow from "Icons/right-arrow.svg";
import {DownArrow} from "Pages/main/components/NavigationArrows";

@inject("mainStore")
@observer
class FeaturedEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      previous: undefined
    };

    this.Event = this.Event.bind(this);
  }

  ChangePage(page) {
    page = page < 0 ? this.props.mainStore.featuredSites.length - 1 : page;

    this.setState({
      selected: page % this.props.mainStore.featuredSites.length,
      previous: this.state.selected
    }, () => setTimeout(() => this.setState({previous: undefined}), 1500));
  }

  Event(site, index) {
    if(!site) { return; }

    const header = site.info.event_info.event_header;

    return (
      <div
        className={`featured-event ${index === this.state.selected ? "featured-event-selected" : ""} ${index === this.state.previous ? "featured-event-fading-out" : ""}`}
        key={`featured-event-${index}`}
      >
        <div className="featured-event__hero-image-container">
          <img
            src={this.props.mainStore.FeaturedSiteImageUrl(site.siteSlug, "hero_background")}
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
      <div className="featured-events scroll-block" id="scroll-block-featured-events">
        <button
          className="arrow-left"
          onClick={() => this.ChangePage(this.state.selected - 1)}
        >
          <ImageIcon icon={LeftArrow} label="Previous" />
        </button>

        <DownArrow />

        { this.props.mainStore.featuredSites.map(this.Event) }
        <button
          className="arrow-right"
          onClick={() => this.ChangePage(this.state.selected + 1)}
        >
          <ImageIcon icon={RightArrow} label="Next" />
        </button>
      </div>
    );
  }
}

export default FeaturedEvents;
