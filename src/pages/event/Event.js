import React, {useEffect, lazy, Suspense} from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";

import EventTabs from "Event/tabs/EventTabs";
import Footer from "Layout/Footer";

import Modal from "Common/Modal";
import UpcomingEvents from "Common/UpcomingEvents";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import ImageIcon from "Common/ImageIcon";
import UrlJoin from "url-join";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import {Link} from "react-router-dom";
import Countdown from "Common/Countdown";
import SocialMediaBar from "Event/tabs/SocialMediaBar";

const PromoPlayer = lazy(() => import("Event/PromoPlayer"));

const GetStartedModal = inject("siteStore")(inject("rootStore")(observer(({rootStore, siteStore, Close}) => {
  const messageInfo = siteStore.eventInfo.modal_message_get_started;

  useEffect(() => {
    if(!messageInfo || !messageInfo.show) {
      // NOTE: Setting wallet panel visibility to modal when not logged in shows live's login modal
      Close();
      rootStore.SetWalletPanelVisibility({visibility: "modal", showPostLoginModal: true});
    }
  }, [messageInfo]);

  if(!messageInfo || !messageInfo.show) {
    return null;
  }

  return (
    <Modal
      className="event-message-container"
      Toggle={Close}
    >
      <div className="event-message">
        <div className={`event-message__content ${!messageInfo.message ? "no-padding" : ""}`}>
          {
            messageInfo.message ?
              <div
                className="event-message__content__message"
                ref={element => {
                  if(!element) { return; }

                  render(
                    <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                      {SanitizeHTML(messageInfo.message)}
                    </ReactMarkdown>,
                    element
                  );
                }}
              /> : null
          }
          {
            !messageInfo.image ? null :
              <ImageIcon
                className={`event-message__content__image ${!messageInfo.message ? "no-padding" : ""}`}
                icon={siteStore.SiteUrl(UrlJoin("info", "event_info", "modal_message_get_started", "image"))}
              />
          }
        </div>
        <div className="event-message__actions">
          {
            !siteStore.nextDrop || siteStore.nextDrop.requires_login ?
              <button
                onClick={() => {
                  Close();
                  localStorage.setItem("showPostLoginModal", "1");

                  rootStore.SetWalletPanelVisibility({visibility: "modal", showPostLoginModal: true});
                }}
                className="event-message__button"
              >
                { messageInfo.button_text || "Create Wallet" }
              </button> :
              <Link
                to={siteStore.nextDrop.link}
                className="event-message__button"
                onClick={Close}
              >
                { messageInfo.button_text || "Join the Drop" }
              </Link>
          }
        </div>
      </div>
    </Modal>
  );
})));

const PostLoginModal = inject("siteStore")(inject("rootStore")(observer(({rootStore, siteStore, Close}) => {
  const messageInfo = (siteStore.eventInfo.modal_message_get_started || {}).post_login;

  useEffect(() => {
    localStorage.removeItem("showPostLoginModal");

    if(!messageInfo || !messageInfo.show) {
      Close();
      rootStore.SetWalletPanelVisibility({
        visibility: "modal",
        hideNavigation: messageInfo.hide_navigation
      });
    }
  }, [messageInfo]);

  if(!messageInfo || !messageInfo.show) {
    return null;
  }

  return (
    <Modal
      className="event-message-container"
      Toggle={Close}
    >
      <div className="event-message">
        <div className={`event-message__content ${!messageInfo.message ? "no-padding" : ""}`}>
          {
            messageInfo.message ?
              <div
                className="event-message__content__message"
                ref={element => {
                  if(!element) { return; }

                  render(
                    <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                      {SanitizeHTML(messageInfo.message)}
                    </ReactMarkdown>,
                    element
                  );
                }}
              /> : null
          }
          {
            !messageInfo.image ? null :
              <ImageIcon
                className={`event-message__content__image ${!messageInfo.message ? "no-padding" : ""}`}
                icon={siteStore.SiteUrl(UrlJoin("info", "event_info", "modal_message_get_started", "post_login", "image"))}
              />
          }
        </div>
        <div className="event-message__actions">
          {
            messageInfo.show_marketplace ?
              <button
                onClick={async () => {
                  Close();
                  await rootStore.SetWalletPanelVisibility({
                    visibility: "modal",
                    location: {
                      page: "marketplace",
                      params: {
                        tenantSlug: siteStore.currentSiteInfo.marketplace_info.tenant_slug,
                        marketplaceSlug: siteStore.currentSiteInfo.marketplace_info.marketplace_slug
                      }
                    },
                    hideNavigation: messageInfo.hide_navigation
                  });

                  await rootStore.SetMarketplaceFilters({filters: messageInfo.marketplace_filters});
                }}
                className="event-message__button event-message__button-marketplace"
              >
                { messageInfo.button_text || "Go to the Marketplace" }
              </button> :
              <button
                className="event-message__button"
                onClick={Close}
              >
                { messageInfo.button_text || "Close" }
              </button>
          }
        </div>
      </div>
    </Modal>
  );
})));

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.mobileCutoff = this.props.siteStore.eventInfo.hero_info ? 600 : 900;

    this.state = {
      showPromo: false,
      showGetStartedModal: false,
      showPostLoginModal: localStorage.getItem("showPostLoginModal")
    };
  }

  Branding() {
    const branding = this.props.siteStore.currentSiteInfo.branding || {};

    let info = {};
    Object.keys(branding).forEach(key => {
      let styles = {};
      Object.keys(branding[key] || {}).forEach(style => {
        if(style === "background_color") {
          styles.backgroundColor = branding[key].background_color.color;
        } else if(style === "text_color") {
          styles.color = branding[key].text_color.color;
        }
      });

      info[key] = {
        text: branding[key].text,
        styles
      };
    });

    return info;
  }

  Promos() {
    if(!this.state.showPromo) { return; }

    return (
      <Modal
        Toggle={show => this.setState({showPromo: show})}
        className="modal--promo-modal"
        content={
          <Suspense fallback={<div/>}>
            {this.props.siteStore.promos.length > 0 ? <PromoPlayer/>
              : <div className="error-message error-message-modal"> No Promos Available</div>
            }
          </Suspense>
        }
      />
    );
  }

  ScrollToTickets() {
    this.setState({
      tab: 0,
    }, () => {
      const target = document.querySelector(".ticket-group") || document.querySelector("event-page__overview");
      window.scrollTo({top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth"});
    });
  }

  Actions() {
    const branding = this.Branding();
    const hasLoggedIn = this.props.rootStore.walletLoggedIn;
    const hasDrops =
      (this.props.siteStore.currentSiteInfo.drops || []).length > 0 ||
      (this.props.siteStore.currentSiteInfo.marketplace_drops || []).length > 0;

    const GetStartedButton = () => (
      <button
        style={(branding.get_started || {}).styles}
        className="btn"
        onClick={() => this.setState({showGetStartedModal: true})}
      >
        { (branding.get_started || {}).text || "Get Started" }
      </button>
    );

    const JoinDropButton = () => (
      this.props.siteStore.nextDrop && this.props.siteStore.nextDrop.ongoing && this.props.siteStore.nextDrop.type === "marketplace_drop" ?
        <button
          style={(branding.join_drop || {}).styles}
          className="btn"
          onClick={async () => {
            await this.props.rootStore.SetWalletPanelVisibility(
              {
                visibility: "full",
                location: {
                  page: this.props.siteStore.nextDrop.store_page === "Listings" ? "marketplaceListings" : "marketplace",
                  params: {
                    tenantSlug: this.props.siteStore.currentSiteInfo.marketplace_info.tenant_slug,
                    marketplaceSlug: this.props.siteStore.currentSiteInfo.marketplace_info.marketplace_slug
                  }
                }
              }
            );

            await this.props.rootStore.SetMarketplaceFilters({filters: this.props.siteStore.nextDrop.marketplace_filters});
          }}
        >
          { (branding.join_drop || {}).text || "Join the Drop" }
        </button> :
        <Link
          style={(branding.join_drop || {}).styles}
          to={this.props.siteStore.nextDrop.link}
          className="btn"
        >
          { (branding.join_drop || {}).text || "Join the Drop" }
        </Link>
    );

    const WatchPromoButton = () => (
      <button
        style={(branding.watch_promo || {}).styles}
        onClick={() => this.setState({showPromo: true})}
        className="btn"
      >
        { (branding.watch_promo || {}).text || "Watch Promo" }
      </button>
    );

    const BuyTicketsButton = () => (
      <button
        style={(branding.buy_tickets || {}).styles}
        className="btn"
        onClick={() => this.ScrollToTickets()}
      >
        { (branding.buy_tickets || {}).text || "Buy Tickets" }
      </button>
    );

    return (
      <div className="event-page__buttons">
        { this.props.rootStore.showWalletLinks && hasDrops && !hasLoggedIn ? <GetStartedButton /> : null }
        { this.props.rootStore.showWalletLinks && hasDrops && hasLoggedIn && this.props.siteStore.nextDrop ? <JoinDropButton /> : null }
        {
          // Ended
          ["Ended", "Live Ended"].includes(this.props.siteStore.currentSiteInfo.state) ||
          // Any tickets available for purchase
          !this.props.siteStore.ticketClasses.find(ticketClass => !ticketClass.hidden && (!ticketClass.release_date || ticketClass.release_date < new Date())) ?
            null : <BuyTicketsButton />
        }
        { this.props.siteStore.promos.length > 0 ? <WatchPromoButton /> : null }
      </div>
    );
  }

  HeroVideo(mobile) {
    const heroVideo = this.props.siteStore.currentSiteInfo.event_images.hero_video;
    const heroVideoMobile = this.props.siteStore.currentSiteInfo.event_images.hero_video_mobile;

    if(!heroVideo || !heroVideo["."]) { return; }

    return (
      (
        <div className="event-page__hero-video-container">
          <div
            className="event-page__hero-video"
            ref={element => {
              if(!element || this.state.player) { return; }

              this.setState({
                player: (
                  new EluvioPlayer(
                    element,
                    {
                      clientOptions: {
                        client: this.props.rootStore.client
                      },
                      sourceOptions: {
                        playoutParameters: {
                          versionHash: mobile && heroVideoMobile ? heroVideoMobile["."].source || heroVideo["."].source : heroVideo["."].source
                        }
                      },
                      playerOptions: {
                        watermark: EluvioPlayerParameters.watermark.OFF,
                        muted: EluvioPlayerParameters.muted.ON,
                        autoplay: EluvioPlayerParameters.autoplay.WHEN_VISIBLE,
                        controls: EluvioPlayerParameters.controls.OFF,
                        loop: EluvioPlayerParameters.loop.ON,
                        playerCallback: ({videoElement}) => this.setState({video: videoElement})
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

  Banner(bannerInfo, index, mobile) {
    const bannerImage = (
      <ImageIcon
        key={`banner-${index}`}
        className="event-page__banner__image"
        icon={(((mobile && bannerInfo.image_mobile || bannerInfo.image) || bannerInfo.image) || {}).url}
        title="Banner"
      />
    );

    if(bannerInfo.type === "marketplace") {
      return (
        <div className="event-page__banner" key={`banner-${index}`}>
          <button
            onClick={() => {
              this.props.rootStore.SetWalletPanelVisibility(
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
              this.props.rootStore.SetMarketplaceFilters({filters: bannerInfo.marketplace_filters});
            }}
          >
            { bannerImage }
          </button>
        </div>
      );
    }

    if(bannerInfo.type === "drop") {
      const dropId = bannerInfo.drop_uuid || (this.props.siteStore.nextDrop || {}).uuid;

      if(!dropId) { return null; }

      return (
        <div className="event-page__banner" key={`banner-${index}`}>
          <Link to={this.props.siteStore.SitePath(UrlJoin("drop", dropId))}>
            { bannerImage }
          </Link>
        </div>
      );
    }

    return (
      <div className="event-page__banner" key={`banner-${index}`}>
        <a
          href={bannerInfo.link || undefined}
          rel="noopener"
          target={bannerInfo.link ? "_blank" : ""}
        >
          { bannerImage }
        </a>
      </div>
    );
  }

  BottomBanners(mobile) {
    let banners = this.props.siteStore.currentSiteInfo.main_page_banners || [];

    if(banners.length === 0) {
      const oldBanner = this.props.siteStore.currentSiteInfo.event_images.main_page_banner || {};

      if(oldBanner && oldBanner.show){
        banners = [ oldBanner ];
      } else {
        return null;
      }
    }

    return banners.map((bannerInfo, index) => this.Banner(bannerInfo, index, mobile));
  }

  Hero() {
    const mobile = this.props.rootStore.pageWidth < this.mobileCutoff;
    const heroKey = mobile && this.props.siteStore.SiteHasImage("hero_background_mobile") ? "hero_background_mobile" : "hero_background";
    const headerKey = this.props.siteStore.darkMode ? "header_light" : "header_dark";
    const hasHeaderImage = this.props.siteStore.SiteHasImage(headerKey);

    return (
      <div className="event-page__hero-container">
        <div className="event-page__hero" style={{backgroundImage: `url(${this.props.siteStore.SiteImageUrl(heroKey)})`}} />
        { this.HeroVideo(mobile) }
        <div className="event-page__heading">
          {
            hasHeaderImage ?
              <div className="event-page__header-logo">
                <img className="event-page_header-logo-image" src={this.props.siteStore.SiteImageUrl(headerKey)} alt={this.props.siteStore.eventInfo.event_header} />
              </div>
              : null
          }

          <h1 className={`event-page__header-name ${hasHeaderImage ? "hidden" : ""}`}>
            { this.props.siteStore.eventInfo.event_header }
          </h1>

          {
            this.props.siteStore.eventInfo.event_subheader ?
              <h2 className="event-page__subheader">{this.props.siteStore.eventInfo.event_subheader}</h2> : null
          }
          {
            this.props.siteStore.eventInfo.date_subheader ?
              <h2 className="event-page__date-header">{this.props.siteStore.eventInfo.date_subheader}</h2> : null
          }
        </div>

        {
          this.props.siteStore.eventInfo.show_countdown && this.props.siteStore.nextDrop ?
            <Countdown
              time={this.props.siteStore.nextDrop.start_date}
              Render={({diff, countdown}) =>
                diff > 0 ? <div className="event-page__countdown">Next drop in {countdown}</div> : null
              }
            /> : null
        }

        { this.Actions() }
      </div>
    );
  }

  render() {
    const mobile = this.props.rootStore.pageWidth < this.mobileCutoff;

    return (
      <div className={`page-container event-page ${this.props.siteStore.eventInfo.hero_info ? "event-page-no-header-info" : ""} ${mobile ? "event-page-mobile" : ""}`}>
        { this.Hero() }

        <div className="event-page__overview">
          <SocialMediaBar />
          <EventTabs />
        </div>

        {
          this.props.siteStore.currentSiteInfo.hide_upcoming_events ? null :
            <UpcomingEvents header="Upcoming Events" events={this.props.siteStore.dropEvents}/>
        }

        { this.BottomBanners(mobile) }

        { this.state.showPromo ? this.Promos() : null}
        { this.state.showGetStartedModal ? <GetStartedModal Close={() => this.setState({showGetStartedModal: false})} /> : null }
        { this.state.showPostLoginModal ? <PostLoginModal Close={() => this.setState({showPostLoginModal: false})} /> : null }
        <Footer />
      </div>
    );
  }
}

export default Event;
