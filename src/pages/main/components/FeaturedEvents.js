import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import ImageIcon from "Common/ImageIcon";

import LeftArrow from "Icons/left-arrow.svg";
import RightArrow from "Icons/right-arrow.svg";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

@inject("rootStore")
@inject("mainStore")
@inject("siteStore")
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

    if(this.state.player) {
      this.state.player.Destroy();
    }

    this.setState({
      selected: page % this.props.mainStore.featuredSites.length,
      previous: this.state.selected,
      player: undefined
    }, () => setTimeout(() => this.setState({previous: undefined}), 1500));
  }

  HeroVideo(site) {
    const heroVideo = site.info.event_images.hero_video;
    const heroVideoMobile = site.info.event_images.hero_video_mobile;
    const mobile = this.props.rootStore.pageWidth < this.mobileCutoff;

    if(!heroVideo || !heroVideo["."]) { return; }

    return (
      (
        <div className="featured-event__hero-video-container">
          <div
            className="featured-event__hero-video"
            ref={element => {
              if(!element || this.state.player) { return; }

              this.setState({
                player: (
                  new EluvioPlayer(
                    element,
                    {
                      clientOptions: {
                        client: this.props.mainStore.rootStore.client
                      },
                      sourceOptions: {
                        playoutParameters: {
                          versionHash: mobile && heroVideoMobile ? heroVideoMobile["."].source || heroVideo["."].source : heroVideo["."].source
                        }
                      },
                      playerOptions: {
                        watermark: EluvioPlayerParameters.watermark.OFF,
                        muted: EluvioPlayerParameters.muted.ON,
                        autoplay: EluvioPlayerParameters.autoplay.ON,
                        controls: EluvioPlayerParameters.controls.OFF,
                      }
                    }
                  )
                )
              });
            }}
          />
        </div>
      )
    );
  }

  Event(site, index) {
    if(!site) { return; }

    const accessible = typeof site.info.state === "undefined"
      ? site.info.accessible :
      !["Inaccessible", "Ended", "Live Ended"].includes(site.info.state);

    const header = site.info.event_info.feature_header || site.info.event_info.event_header;
    const subheader = site.info.event_info.date_subheader || site.info.event_info.date;

    let buttonStyle = {};
    const buttonOptions = (site.info.event_info || {}).feature_button;
    if(buttonOptions) {
      buttonStyle.color = buttonOptions.text_color.color;
      buttonStyle.backgroundColor = buttonOptions.background_color.color;
    }

    const openMarketplace = (site.info.event_info || {}).feature_location === "Marketplace";
    const { tenant_slug, marketplace_slug, default_store_page } = (site.info.marketplace_info || {});

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
        { index === this.state.selected ? this.HeroVideo(site) : null }
        <div className="featured-event__details">
          <h2 className="featured-event__header">{ header }</h2>

          {
            site.info.event_info.hero_info && subheader ? null :
              <h3 className="featured-event__subheader">
                { subheader }
              </h3>
          }
          {
            site.info.state !== "Inaccessible" && openMarketplace ?
              <button
                onClick={() => this.props.rootStore.SetWalletPanelVisibility({
                  visibility: "full",
                  location: {
                    page: default_store_page === "Listings" ? "marketplaceListings" : "marketplace",
                    params: { tenantSlug: tenant_slug, marketplaceSlug: marketplace_slug }
                  }
                })}
                className="featured-event__event-link" style={buttonStyle}
              >
                { buttonOptions ? buttonOptions.text : (site.info.type === "drop_event" ? "Join the Drop" : "Buy Tickets") }
              </button> : null
          }

          {
            accessible && !openMarketplace ?
              <a href={UrlJoin("/", site.tenantSlug || "", site.siteSlug)} className="featured-event__event-link" style={buttonStyle}>
                { buttonOptions ? buttonOptions.text : (site.info.type === "drop_event" ? "Join the Drop" : "Buy Tickets") }
              </a> : null
          }
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

        { this.props.siteStore.featuredSitesLoaded ? this.props.mainStore.featuredSites.map(this.Event) : null }
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
