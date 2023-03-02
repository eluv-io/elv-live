import React, {useEffect, lazy, Suspense, useState} from "react";
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
import {rootStore, siteStore} from "Stores";
import Player from "Common/Player";

const PromoPlayer = lazy(() => import("Event/PromoPlayer"));

const ButtonContent = (info={}, defaultText) =>
  info.button_image ?
    <img className="btn__image" src={info.button_image.url} alt={info.button_text || info.text || defaultText}/> :
    info.button_text || info.text || defaultText;

const GetStartedModal = inject("siteStore")(inject("rootStore")(observer(({rootStore, siteStore, Close}) => {
  const messageInfo = siteStore.eventInfo.modal_message_get_started;

  useEffect(() => {
    if(!messageInfo || !messageInfo.show) {
      Close();

      rootStore.LogIn();
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
            messageInfo.button_link ?
              <a
                href={messageInfo.button_link}
                target="_blank"
                rel="noopener"
                className={`event-message__button ${messageInfo.button_image ? "event-message__button--image" : ""}`}
              >
                { ButtonContent(messageInfo, "Link") }
              </a> :
              !siteStore.nextDrop || siteStore.nextDrop.requires_login || siteStore.nextDrop.skip_countdown_page ?
                <button
                  onClick={() => {
                    Close();
                    localStorage.setItem("showPostLoginModal", "1");

                    rootStore.LogIn();
                  }}
                  className={`event-message__button ${messageInfo.button_image ? "event-message__button--image" : ""}`}
                >
                  { ButtonContent(messageInfo, "Create Wallet") }
                </button> :
                <Link
                  to={siteStore.nextDrop.link}
                  className={`event-message__button ${messageInfo.button_image ? "event-message__button--image" : ""}`}
                  onClick={Close}
                >
                  { ButtonContent(messageInfo, "Join the Drop") }
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
      rootStore.SetWalletPanelVisibility({visibility: "full"});
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
            messageInfo.button_link ?
              <a
                href={messageInfo.button_link}
                target="_blank"
                rel="noopener"
                className="event-message__button"
              >
                { messageInfo.button_text || "Link" }
              </a> :
              messageInfo.show_marketplace ?
                <button
                  onClick={async () => {
                    Close();
                    await rootStore.SetWalletPanelVisibility({
                      visibility: "full",
                      location: {
                        page: "marketplace",
                        params: {
                          tenantSlug: siteStore.currentSiteInfo.marketplace_info.tenant_slug,
                          marketplaceSlug: siteStore.currentSiteInfo.marketplace_info.marketplace_slug
                        }
                      }
                    });

                    await rootStore.SetMarketplaceFilters({filters: messageInfo.marketplace_filters});
                  }}
                  className={`event-message__button ${messageInfo.button_image ? "event-message__button--image" : ""} event-message__button-marketplace`}
                >
                  { ButtonContent(messageInfo, "Go to the Marketplace") }
                </button> :
                <button
                  className={`event-message__button ${messageInfo.button_image ? "event-message__button--image" : ""}`}
                  onClick={Close}
                >
                  { ButtonContent(messageInfo, "Close") }
                </button>
          }
        </div>
      </div>
    </Modal>
  );
})));

const HeroBanner = ({link, imageUrl}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const SetScroll = () => setScrolled(window.scrollY > 0);

    document.addEventListener("scroll", SetScroll);

    return () => document.removeEventListener("scroll", SetScroll);
  }, []);

  if(link) {
    return (
      <a href={link} rel="noopener" target="_blank" className={`event-page__hero-banner ${scrolled ? "event-page__hero-banner--hidden" : ""}`}>
        <img className="event-page__hero-banner__image" src={imageUrl} alt="Banner" />
      </a>
    );
  }

  return (
    <div className={`event-page__hero-banner ${scrolled ? "event-page__hero-banner--hidden" : ""}`}>
      <img className="event-page__hero-banner__image" src={imageUrl} alt="Banner" />
    </div>
  );
};

const Banner = observer(({bannerInfo, index, mobile, className="event-page__banner", imageClassName="event-page__banner__image"}) => {
  const [showVideo, setShowVideo] = useState(false);

  const bannerImage = (
    <ImageIcon
      key={`banner-${index}`}
      className={imageClassName}
      icon={(((mobile && bannerInfo.image_mobile || bannerInfo.image) || bannerInfo.image) || {}).url}
      label="Banner"
    />
  );

  if(bannerInfo.type === "video" && bannerInfo.video && bannerInfo.video["."]) {
    return (
      <div className={className} key={`banner-${index}`}>
        <button className="event-page__banner__image-container" onClick={() => setShowVideo(true)}>
          { bannerImage }
        </button>
        {
          !showVideo ? null :
            <Player
              className="event-page__banner__video"
              params={
                {
                  clientOptions: {
                    client: rootStore.client
                  },
                  sourceOptions: {
                    playoutParameters: {
                      versionHash: bannerInfo.video["."].source
                    }
                  },
                  playerOptions: {
                    watermark: EluvioPlayerParameters.watermark.OFF,
                    muted: EluvioPlayerParameters.muted.OFF,
                    autoplay: EluvioPlayerParameters.autoplay.ON,
                    controls: EluvioPlayerParameters.controls.AUTO_HIDE,
                    playerCallback: ({videoElement}) => {
                      videoElement.addEventListener("ended", () => setShowVideo(false));
                    }
                  }
                }
              }
            />
        }
      </div>
    );
  }

  if(bannerInfo.type === "marketplace") {
    const marketplace = bannerInfo.marketplace ?
      siteStore.additionalMarketplaces.find(({marketplace_slug}) => marketplace_slug === bannerInfo.marketplace) :
      siteStore.marketplaceInfo;

    return (
      <div className={className} key={`banner-${index}`}>
        <button
          className="event-page__banner__image-container"
          onClick={() => {
            rootStore.SetWalletPanelVisibility(
              {
                visibility: "full",
                location: {
                  page: bannerInfo.sku ? "marketplaceItem" : "marketplace",
                  params: {
                    page: "marketplaceItem",
                    tenantSlug: marketplace.tenant_slug,
                    marketplaceSlug: marketplace.marketplace_slug,
                    sku: bannerInfo.sku
                  }
                }
              }
            );
            rootStore.SetMarketplaceFilters({filters: bannerInfo.marketplace_filters});
          }}
        >
          { bannerImage }
        </button>
      </div>
    );
  }

  if(bannerInfo.type === "drop") {
    const dropId = bannerInfo.drop_uuid || (siteStore.nextDrop || {}).uuid;

    if(!dropId) { return null; }

    return (
      <div className={className} key={`banner-${index}`}>
        <Link className="event-page__banner__image-container" to={siteStore.SitePath(UrlJoin("drop", dropId))}>
          { bannerImage }
        </Link>
      </div>
    );
  }

  if(bannerInfo.type === "link") {
    return (
      <div className={className} key={`banner-${index}`}>
        <a
          className="event-page__banner__image-container"
          href={bannerInfo.link || undefined}
          rel="noopener"
          target={bannerInfo.link ? "_blank" : ""}
        >
          {bannerImage}
        </a>
      </div>
    );
  }

  return (
    <div className={className} key={`banner-${index}`}>
      { bannerImage }
    </div>
  );
});

@inject("rootStore")
@inject("siteStore")
@inject("cartStore")
@observer
class Event extends React.Component {
  constructor(props) {
    super(props);

    this.mobileCutoff = this.props.siteStore.eventInfo.hero_info ? 700 : 900;

    this.state = {
      showPromo: false,
      showGetStartedModal: false,
      showPostLoginModal: localStorage.getItem("showPostLoginModal")
    };

    props.siteStore.AddAnalyticsEvent({
      analytics: props.siteStore.currentSiteInfo.landing_page_view_analytics,
      eventName: "Landing Page View"
    });
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
        button_image: branding[key].button_image,
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

    const eventButtonOpensMarketplace = this.props.siteStore.currentSiteInfo.event_info.event_button_opens_marketplace;
    const marketplaceDisabled = this.props.siteStore.marketplaceInfo?.disable_marketplace;

    let OpenMarketplaceButton;
    if(eventButtonOpensMarketplace) {
      OpenMarketplaceButton = () => (
        <button
          style={(branding.get_started || {}).styles}
          className={`btn ${branding.get_started?.button_image ? "btn--image" : ""}`}
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
          }}
        >
          {ButtonContent(branding.get_started, "Get Started")}
        </button>
      );
    }

    const GetStartedButton = () => (
      <button
        style={(branding.get_started || {}).styles}
        className={`btn ${branding.get_started?.button_image ? "btn--image" : ""}`}
        onClick={() => this.setState({showGetStartedModal: true})}
      >
        { ButtonContent(branding.get_started, "Get Started") }
      </button>
    );

    const JoinDropButton = () => (
      this.props.siteStore.nextDrop && this.props.siteStore.nextDrop.ongoing && this.props.siteStore.nextDrop.type === "marketplace_drop" ?
        <button
          style={(branding.join_drop || {}).styles}
          className={`btn ${branding.join_drop?.button_image ? "btn--image" : ""}`}
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
          { ButtonContent(branding.join_drop, "Join the Drop") }
        </button> :
        <Link
          style={(branding.join_drop || {}).styles}
          to={this.props.siteStore.nextDrop.link}
          className={`btn ${branding.join_drop?.button_image ? "btn--image" : ""}`}
        >
          { ButtonContent(branding.join_drop, "Join the Drop") }
        </Link>
    );

    const WatchPromoButton = () => (
      <button
        style={(branding.watch_promo || {}).styles}
        onClick={() => this.setState({showPromo: true})}
        className={`btn ${branding.watch_promo?.button_image ? "btn--image" : ""}`}
      >
        { ButtonContent(branding.watch_promo, "Watch Promo") }
      </button>
    );

    const BuyTicketsButton = () => (
      <button
        style={(branding.buy_tickets || {}).styles}
        className={`btn ${branding.buy_tickets?.button_image ? "btn--image" : ""}}`}
        onClick={() => this.ScrollToTickets()}
      >
        { ButtonContent(branding.buy_tickets, "Buy Tickets") }
      </button>
    );

    return (
      <div className="event-page__buttons">
        { eventButtonOpensMarketplace && !marketplaceDisabled ? <OpenMarketplaceButton /> : null }
        { !eventButtonOpensMarketplace && !marketplaceDisabled && hasDrops && !hasLoggedIn ? <GetStartedButton /> : null }
        { !eventButtonOpensMarketplace && !marketplaceDisabled && hasDrops && hasLoggedIn && this.props.siteStore.nextDrop ? <JoinDropButton /> : null }
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

  BottomBannerCards(mobile) {
    let { header, background_image, background_image_mobile, cards } = this.props.siteStore.currentSiteInfo.main_page_banner_cards || {};

    if((cards || []).length === 0) {
      return null;
    }

    return (
      <div className="event-page__banner-cards">
        {
          background_image ?
            <ImageIcon
              className="event-page__banner-cards__background"
              icon={(((mobile && background_image_mobile) || background_image) || {}).url}
              label="Banner"
            /> : null
        }
        { header ? <h3 className="event-page__banner-cards__header">{header}</h3> : null }
        <div className="event-page__banner-cards__cards">
          {cards.map((bannerInfo, index) =>
            <Banner bannerInfo={bannerInfo} index={index} className="event-page__banner event-page__banner-card" imageClassName="event-page__banner-card__image" />
          )}
        </div>
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

    return banners.map((bannerInfo, index) =>
      <Banner bannerInfo={bannerInfo} index={index} mobile={mobile} />
    );
  }

  Hero() {
    const mobile = this.props.rootStore.pageWidth < this.mobileCutoff;
    const heroKey = mobile && this.props.siteStore.SiteHasImage("hero_background_mobile") ? "hero_background_mobile" : "hero_background";
    const heroBannerKey = mobile && this.props.siteStore.SiteHasImage("hero_banner_mobile") ?
      "hero_banner_mobile" :
      this.props.siteStore.SiteHasImage("hero_banner") ?
        "hero_banner" : "";
    const headerKey = this.props.siteStore.darkMode ? "header_light" : "header_dark";
    const hasHeaderImage = this.props.siteStore.SiteHasImage(headerKey);

    return (
      <>
        { heroBannerKey ? <HeroBanner link={this.props.siteStore.currentSiteInfo?.event_images?.hero_banner_link} imageUrl={this.props.siteStore.SiteImageUrl(heroBannerKey)} /> : null }
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
      </>
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
            <UpcomingEvents events={this.props.siteStore.dropEvents}/>
        }

        { this.BottomBannerCards(mobile) }
        { this.BottomBanners(mobile) }

        { this.state.showPromo ? this.Promos() : null}
        { this.state.showGetStartedModal ? <GetStartedModal Close={() => this.setState({showGetStartedModal: false})} /> : null }
        { this.state.showPostLoginModal && this.props.rootStore.walletLoggedIn ? <PostLoginModal Close={() => this.setState({showPostLoginModal: false})} /> : null }
        <Footer />
      </div>
    );
  }
}

export default Event;
