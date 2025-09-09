import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";

import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {TabsList, TabsPanel, Video} from "../../components/Misc";

import useScrollToElement from "../../../hooks/useScrollToElement";
import {useNavigate} from "react-router";
import {Swiper, SwiperSlide} from "swiper/react";

import {NotificationBanner} from "../../components/Header";
import SiteCarousel from "./SiteCarousel";
import Modal from "../../components/Modal";
import {Button} from "../../components/Actions";
import {
  ArrowCubeIcon,
  BlockchainMenuIcon,
  BoltIcon,
  CodeSandboxIcon,
  CubeIcon,
  PlaySimpleIcon,
  XIcon
} from "../../static/icons/Icons";
import {SocialIcons} from "../../static/icons/Icons";

import EluvioColorLogo from "../../static/images/logos/eluvio-logo-hero";

import AwardImage1 from "../../static/images/main/awards/nab-product-of-the-year-2024.webp";
import AwardImage2 from "../../static/images/main/awards/nab-product-of-the-year-2022.webp";
import AwardImage3 from "../../static/images/main/awards/csi-award-2024.webp";
import AwardImage4 from "../../static/images/main/awards/seicon-dc-cs.webp";
import AwardImage5 from "../../static/images/main/awards/seicon-grand-prize.webp";
import AwardImage6 from "../../static/images/main/awards/hpa-award-2020.webp";
import AwardImage7 from "../../static/images/main/awards/nab-product-of-the-year-2023";
import AwardImage8 from "../../static/images/main/awards/nab-product-of-the-year-2025";

const awardsImages = [
  {img: AwardImage8, alt: "NAB Product of the Year Award 2025"},
  {img: AwardImage1, alt: "NAB Product of the Year Award 2024"},
  {img: AwardImage7, alt: "NAB Product of the Year Award 2023"},
  {img: AwardImage2, alt: "NAB Product of the Year Award 2022"},
  {img: AwardImage3, alt: "CSI Awards Winner 2024"},
  {img: AwardImage4, alt: "SEICon Innovation Hub - Best in Show Award"},
  {img: AwardImage5, alt: "SEICon Innovation Hub - Best in Show Grand Prize Award"},
  {img: AwardImage6, alt: "HPA Award 2020"}
];

import AppIconFB from "../../static/icons/apps_new/1_Fabric_Browser";
import AppIconIngest from "../../static/icons/apps_new/2_Media_Ingest";
import AppIconStream from "../../static/icons/apps_new/3_Livestream_Manager";
import AppIconCS from "../../static/icons/apps_new/4_Creator_Studio";
import AppIconEvie from "../../static/icons/apps_new/5_Evie";
import AppIconAI from "../../static/icons/apps_new/6_AI_Search";
import AppIconAnalytics from "../../static/icons/apps_new/7_Analytics";

import HeaderBackgroundImage from "../../static/images/main/dot-header-bg.webp";
import AnalyticsApp from "../../static/images/main/apps/03-content-analytics-and-reporting.webp";
import AiSearchApp from "../../static/images/main/apps/02-ai-content-search-and management.webp";
import EvieApp from "../../static/images/main/apps/01-eluvio-video-intelligence-editor.webp";
import CreatorStudioApp from "../../static/images/main/apps/04-creator-studio.webp";
import LiveStreamManagerApp from "../../static/images/main/apps/05-live-stream-manager.webp";
import MediaIngestApp from "../../static/images/main/apps/06-media-ingest.webp";
import FabricBrowserApp from "../../static/images/main/apps/07-fabric-browser.webp";

import VideoStackQuality from "../../static/images/main/video-stack/01-Hyper-Efficient.jpg";
import VideoStackULL from "../../static/images/main/video-stack/02-ULL.mp4";
import VideoStackSecurity from "../../static/images/main/video-stack/03-Secure-and-Verifiable.jpg";
import VideoStackAiNative from "../../static/images/main/video-stack/04-AI-Native.jpg";
import VideoStackMonetization from "../../static/images/main/video-stack/05-Monetization.mp4";

import LiveFeedImage from "../../static/images/main/use-cases/live-feed";

import UseCaseAiGeneratedImage from "../../static/images/main/use-cases/ai-generated-personalized-highlights-clips-compositions.webp";
import UseCaseArchiveLibraryImage from "../../static/images/main/use-cases/archive-library-ai-search-hosting-monetization";
import UseCaseCompleteAPIsImage from "../../static/images/main/use-cases/complete-apis-developing-ott-media-rich-applications.webp";
import UseCaseD2CB2BImage from "../../static/images/main/use-cases/d2c-b2b-live-vod-fast-linear-streaming-scale.webp";
import UseCaseLinearStreamingAtScaleImage from "../../static/images/main/use-cases/linear-streaming-at-scale.webp";
import UseCaseLiveEventStreamingImage from "../../static/images/main/use-cases/live-event-streaming-vips-commentary-remote-monitoring.webp";
import UseCaseUltraLowLatencyImage from "../../static/images/main/use-cases/ultra-low-latency-live-feed-distribution-broadcast.webp";

import EluvioGroupDesktopImage from "../../static/images/main/team-card";
import EluvioGroupMobileImage from "../../static/images/main/team-card-mobile";
import ClientGroupDesktopImage from "../../static/images/main/clients/client-group-desktop";
import ClientGroupMobileImage from "../../static/images/main/clients/client-group-mobile";
import {Pagination} from "swiper";
import {autorun} from "mobx";

const AwardsBlock = observer(({mobile}) => {
  if(mobile) {
    return (
      <div className="main-page-block--awards">
        <Swiper
          className="main-page-block--awards__carousel"
          spaceBetween={0}
          slidesPerView={3}
          centeredSlides
          loop
          initialSlide={0}
          pagination={{
            enabled: false
          }}
          onSwiper={swiper => window.swiper = swiper}
        >
          {
            awardsImages.map(({img, alt}) => (
              <SwiperSlide key={`carousel-${img}`} className="site-carousel__slide">
                <div className="main-page-block main-page-block--award" style={{"--award-image-url": `url(${img})`}}>
                  <ImageIcon icon={img} alt={alt} />
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    );
  }

  return (
    <div className="main-page-block--awards">
      <div className="main-page-block--award-container">
        {
          awardsImages.map(({img, alt}) => (
            <div
              key={`award-${img}`}
              className="main-page-block main-page-block--award"
              style={{"--award-image-url": `url(${img})`}}
            >
              <ImageIcon icon={img} alt={alt} />
            </div>
          ))
        }
      </div>
    </div>
  );
});

const HeaderBlock = observer(({mobile}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <MainHeader video={false} backgroundImage={HeaderBackgroundImage}>
      <div className="main-page-header__main-header">
        <div className="main-page-header__main-header__row-container">
          <ImageIcon icon={EluvioColorLogo} className="main-page-header__main-header__logo-image" width={mobile ? 275 : 350} />
          <div className="main-page-header__main-header__headers">
            <div className="main-page-header__main-header__top-header">{mainStore.l10n.main.heading.top_header}</div>
            <div className="main-page-header__main-header__header">{mainStore.l10n.main.heading.header}</div>

            {
              mobile &&
              <Button
                className="light header__button header__button--cta"
                onClick={mobile ? undefined : () => setShowModal(true)}
                to={mobile ? mainStore.l10n.main.benefits_block.learn_more_link : undefined}
              >
                <ImageIcon icon={PlaySimpleIcon} width={18} height={15} />
                {mainStore.l10n.main.heading.cta_text}
              </Button>
            }

            <div className="main-page-header__main-header__subheader-container">
              <div className="main-page-header__main-header__subheader-container-text main-page-header__main-header__subheader-container-text--text-overlay">
                <span>
                  <span className="main-page-header__main-header__subheader">{ mainStore.l10n.main.heading.subheader }</span>
                </span>
              </div>
            </div>
            <Modal
              active={showModal}
              className="modal--modal-box header-modal"
              Close={() => setShowModal(false)}
              hideCloseButton
            >
              <div className="main-page-header__modal-video modal-box">
                <Video versionHash={mainStore.l10n.main.benefits_block.video_version_hash} className="main-page-block__video main-page-block__core-video" />
                <button onClick={() => setShowModal(false)} className="modal__close-button light modal-box__close-button">
                  <ImageIcon icon={XIcon} title="Close" className="modal-box__close-button-icon" />
                </button>
              </div>
            </Modal>
            {
              !mobile &&
              <Button className="light header__button header__button--cta" onClick={() => setShowModal(true)}>
                <ImageIcon icon={PlaySimpleIcon} width={18} height={15} />
                {mainStore.l10n.main.heading.cta_text}
              </Button>
            }
          </div>
        </div>
      </div>
    </MainHeader>
  );
});

const VideoStack = observer(({mobile}) => {
  const { header, features } = mainStore.l10n.main.video_stack;

  const blockRef = useRef(null);
  const {isInStickyZone} = useState(useScrollToElement(blockRef));
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const mediaMap = {
    "quality": VideoStackQuality,
    "ull": VideoStackULL,
    "security": VideoStackSecurity,
    "ai-native": VideoStackAiNative,
    "monetization": VideoStackMonetization
  };

  const tabsData = features.map(feature => (
    {
      title: feature.feature_title,
      content: {
        subtitle: feature.subtitle,
        title: feature.title,
        description: feature.description,
        image: (feature.media && feature.media_type === "image") ? mediaMap[feature.media] : null,
        video: (feature.media && feature.media_type === "video") ? mediaMap[feature.media] : null
      }
    }
  ));

  let content;

  if(mobile) {
    content = (
      <div className="main-page-block--video-stack__tabs-container">
        <TabsPanel
          tabs={tabsData}
          activeTabIndex={activeTabIndex}
          mobile
        />
        <TabsList
          tabs={tabsData}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          wrap={false}
          orientation="horizontal"
        />
      </div>
    );
  } else {
    content = (
      <>
        <TabsList
          tabs={tabsData}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          wrap
        />
        <TabsPanel
          tabs={tabsData}
          activeTabIndex={activeTabIndex}
        />
      </>
    );
  }

  return (
    <div
      ref={blockRef}
      className={`main-page-block main-page-block--light main-page-block--video-stack ${isInStickyZone ? "main-page-block--sticky-zone" : ""}`}
      style={{
        transition: isInStickyZone ? "transform 0.1s ease-out" : "none",
        scrollSnapAlign: "start"
      }}
    >
      <div className="main-page-block padded-block">
        <div className="main-page-block__copy-container main-page-block__copy-container--center">
          <div className="main-page-header__main-header__header">
            { header }
          </div>
          { content }
        </div>
      </div>
    </div>
  );
});

const StreamingCard = observer(({
  title,
  description,
  image,
  color,
  logos=[],
  actions=[],
  mobile
}) => {
  const [showModal, setShowModal] = useState(false);
  const [videoVersionHash, setVideoVersionHash] = useState(null);

  const iconMap = {
    "play-arrow": PlaySimpleIcon
  };

  return (
    <div className="main-page-block__streaming-card">
      <div className="main-page-block__streaming-card__content" style={{backgroundImage: `url(${image})`, backgroundSize: "cover"}}>
        <div className="main-page-block__streaming-card__text-content">
          <div className={`main-page-block__streaming-card__title main-page-block__streaming-card__title--${color}`}>{ title }</div>
          <div className="main-page-block__streaming-card__description">{ description}</div>
          {
            logos.length > 0 &&
            <div className="main-page-block__streaming-card__logos">
              {
                logos.map((logo, i) => (
                  <ImageIcon key={`logo-${i}`} icon={logo} className="main-page-block__streaming-card__logo" />
                ))
              }
            </div>
          }
        </div>
      </div>
      <div className="main-page-block__streaming-card__button-container">
        <div className="main-page-block__streaming-card__button-flexbox">
          {
            actions.map(action => (
              <Button
                key={`use-case-button-${action.label}`}
                className={`main-page-block__streaming-card__button main-page-block__streaming-card__button--${color} ${action.type === "outline" ? "outline" : ""}`}
                to={action.link || mobile ? action.mobile_link : undefined}
                onClick={(action.videoHash && !mobile) ? () => {
                  setVideoVersionHash(action.videoHash);
                  setShowModal(true);
                } : null}
              >
                {
                  action.icon &&
                  <ImageIcon icon={iconMap[action.icon]} height={16} width={18} />
                }
                { action.label }
              </Button>
            ))
          }
        </div>
      </div>
      <Modal
        active={showModal}
        className="modal--modal-box header-modal"
        Close={() => setShowModal(false)}
        hideCloseButton
      >
        <div className="main-page-header__modal-video modal-box">
          <Video versionHash={videoVersionHash} className="main-page-block__video main-page-block__core-video" />
          <button onClick={() => setShowModal(false)} className="modal__close-button light modal-box__close-button">
            <ImageIcon icon={XIcon} title="Close" className="modal-box__close-button-icon" />
          </button>
        </div>
      </Modal>
    </div>
  );
});

const StreamingUseCases = observer(({mobile}) => {
  const [title, setTitle] = useState("Streaming");
  const [titleColor, setTitleColor] = useState("purple");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { features } = mainStore.l10n.main.streaming_use_cases;

  const imageMap = {
    "streaming-1": UseCaseD2CB2BImage,
    "streaming-2": UseCaseLinearStreamingAtScaleImage,
    "broadcast": UseCaseUltraLowLatencyImage,
    "live-streaming": UseCaseLiveEventStreamingImage,
    "video-ai": UseCaseAiGeneratedImage,
    "publishing-1": UseCaseCompleteAPIsImage,
    "publishing-2": UseCaseArchiveLibraryImage
  };

  const logoMap = {
    "live-feed": LiveFeedImage
  };

  useEffect(() => {
    const disposer = autorun(() => {
      const feature = features[currentSlideIndex];
      if (feature?.use_case) {
        setTitle(feature.use_case);
        setTitleColor(feature.use_case_color || "purple");
      }
    });
    return () => disposer();
  }, [currentSlideIndex, features]);

  const HandleSlideChange = (swiper) => {
    setCurrentSlideIndex(swiper.realIndex);
  };

  return (
    <div className="main-page-block--light main-page-block--use-cases" style={{background: mobile ? "" : "linear-gradient(180deg, rgba(255, 255, 255, 1.00) 0%, rgba(192, 192, 212, 1) 100%)"}}>
      <div className="main-page-block__copy-container">
        <h3 className="main-page-block__copy-header">
          <span className="main-page-block--subtle-title">Use Cases</span>&nbsp;
          <span className={`main-page-block__streaming-card__title main-page-block__streaming-card__title--${titleColor}`}>{ title }</span>
        </h3>
      </div>
      <div className="main-page-block__streaming-cards-container">
        <Swiper
          className="carousel"
          modules={[Pagination]}
          pagination={{
            enabled: true,
            clickable: true
          }}
          autoHeight
          loop
          freeMode
          spaceBetween={12}
          slidesPerView="auto"
          onSlideChange={HandleSlideChange}
        >
          {
            features.map(feature => {
              const {title, description, image, use_case_color, logos, actions} = feature;

              return (
                <SwiperSlide key={`streaming-card-${feature.title}`}>
                  <StreamingCard
                    title={title}
                    description={description}
                    image={imageMap[image]}
                    color={use_case_color}
                    logos={(logos || []).map(logo => logoMap[logo])}
                    actions={actions}
                    mobile={mobile}
                  />
                </SwiperSlide>
              );
            })
          }
        </Swiper>
      </div>
    </div>
  );
});

const BenefitsBlock = observer(({mobile}) => {
  const {cards} = mainStore.l10n.main.benefits_block;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="main-page-block main-page-block--light main-page-block--benefits">
      <div className="main-page-block padded">
        <div className="main-page-block__copy-container main-page-block__copy-container--center">
          <h3 className="main-page-header__main-header__header main-page-header__main-header__header--no-margin">Why Now & Why Us?</h3>
          <Modal
            active={showModal}
            className="modal--modal-box header-modal"
            Close={() => setShowModal(false)}
            hideCloseButton
          >
            <div className="main-page-header__modal-video modal-box">
              <Video versionHash={mainStore.l10n.main.benefits_block.video_version_hash} className="main-page-block__video main-page-block__core-video" />
              <button onClick={() => setShowModal(false)} className="modal__close-button light modal-box__close-button">
                <ImageIcon icon={XIcon} title="Close" className="modal-box__close-button-icon" />
              </button>
            </div>
          </Modal>
          <Button
            className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple"
            onClick={mobile ? undefined : () => setShowModal(true)}
            to={mobile ? mainStore.l10n.main.benefits_block.learn_more_link : undefined}
          >
            <ImageIcon icon={PlaySimpleIcon} width={18} height={15} />
            Learn More
          </Button>
        </div>
        <div className="main-page-block__benefit-cards-container">
          <div className="main-page-block__benefit-cards">
            <div className="main-page-block__benefit-card main-page-block__benefit-card-1">
              <div className="main-page-block__benefit-card-1__column-text">
                <div className="main-page-block__benefit-card-1__title">
                  { cards.no_1.title }
                </div>
                <div className="main-page-block__benefit-card-1__row-text">
                  <div className="main-page-block__benefit-card-1__description-text">
                    { cards.no_1.text_left }
                  </div>
                  <div className="main-page-block__benefit-card-1__description-text">
                    { cards.no_1.text_right }
                  </div>
                </div>
              </div>
            </div>
            <div className="main-page-block__benefit-card main-page-block__benefit-card-2">
              <div className="main-page-block__benefit-card-2__column">
                {
                  cards.no_2.text.map((item, i) => (
                    <div key={`card-2-item-${i}`}>{ item }</div>
                  ))
                }
              </div>
            </div>
            <div className="main-page-block__benefit-card main-page-block__benefit-card-3">
              <div className="main-page-block__benefit-card-3__column">
                <div>{ cards.no_3.text_one }</div>
                <div>{ cards.no_3.text_two }</div>
                <Button className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple" onClick={() => navigate("/content-fabric/technology")}>{ mobile ? cards.no_3.text_three_mobile : cards.no_3.text_three }</Button>
              </div>
            </div>
            <div className="main-page-block__benefit-card main-page-block__benefit-card-4">
                <div className="main-page-block__benefit-card-4__row">
                  <div className="main-page-block__benefit-card-4__text-panel">
                    {
                      cards.no_4.tabs[activeTabIndex].value
                    }
                    {
                      mobile ? null :
                        (
                          <div className="main-page-block__benefit-card-4__icons">
                            {
                              [CubeIcon, BlockchainMenuIcon, BoltIcon, CodeSandboxIcon, ArrowCubeIcon].map((iconItem, i) => (
                                <ImageIcon key={`benefit-icon-${i}`} icon={iconItem} />
                              ))
                            }
                          </div>
                        )
                    }
                  </div>
                  <div className="main-page-block__benefit-card-4__button-panel">
                    <TabsList
                      tabs={(cards?.no_4?.tabs || []).map(tab => (
                        {title: tab.label}
                      ))}
                      activeTabIndex={activeTabIndex}
                      setActiveTabIndex={setActiveTabIndex}
                      orientation={mobile ? "horizontal" : "vertical"}
                      darkMode
                      wrap={false}
                    />
                  </div>
                </div>
              </div>
            <div className="main-page-block__benefit-card main-page-block__benefit-card-5">
              <div>{ cards.no_5.text_one }</div>
              <div>{ cards.no_5.text_two }</div>
              <a
                className="main-page-block__benefit-card-5__github-button"
                href={cards.no_5.github_link}
                target="_blank"
                rel="noreferrer"
              >
                <ImageIcon icon={SocialIcons.GithubIcon} />
                Eluvio GitHub
              </a>
            </div>
            <div className="main-page-block__benefit-card main-page-block__benefit-card-6" id="eluvio-team" style={{backgroundImage: `url(${mobile ? EluvioGroupMobileImage : EluvioGroupDesktopImage})`}}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const AppsBlock = observer(({mobile}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const blockRef = useRef(null);
  const {isInStickyZone} = useState(useScrollToElement(blockRef));

  const {apps} = mainStore.l10n.main.apps_block;

  const appIcons = [
    {icon: AppIconEvie, alt: "Evie app icon"},
    {icon: AppIconAI, alt: "AI Content Search app icon"},
    {icon: AppIconAnalytics, alt: "Content Analytics & Reporting app icon"},
    {icon: AppIconCS, alt: "Creator Studio app icon"},
    {icon: AppIconStream, alt: "Livestream Manager app icon"},
    {icon: AppIconIngest, alt: "Media Ingest app icon"},
    {icon: AppIconFB, alt: "Fabric Browser app icon"}
  ];

  const appImageMap = {
    "creator-studio": CreatorStudioApp,
    "evie": EvieApp,
    "ai-search": AiSearchApp,
    "analytics": AnalyticsApp,
    "media-ingest": MediaIngestApp,
    "fabric-browser": FabricBrowserApp,
    "live-stream": LiveStreamManagerApp
  };

  const HandleButtonClick = (index) => {
    setActiveTabIndex(index);
  };

  let content;

  if(mobile) {
    content = (
      <>
        {/* Tab panel */}
        <div className="main-page-block main-page-block__app-tabs-panel">
          <div className="main-page-block__app-tabs-panel-content">
            <ImageIcon icon={apps[activeTabIndex].image ? appImageMap[apps[activeTabIndex].image] : null} />
            <div className="main-page-block__app-tabs-panel-content__text-column">
              <div className="app-panel-title">{ apps[activeTabIndex].title }</div>
              <div className="app-panel-description">{ apps[activeTabIndex].description }</div>
              <Button to={apps[activeTabIndex].link} className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Tab toolbar */}
        <div className="main-page-block main-page-block__app-tabs-list">
          {
            appIcons.map((appData, index) => (
              <div
                key={`button-${index}`}
                className={`app-list-item${activeTabIndex === index ? " app-list-item--active" : " app-list-item--inactive"}`}
              >
                <button
                  type="button"
                  className="app-list-item-button"
                  onClick={() => HandleButtonClick(index)}
                >
                  <ImageIcon icon={appData.icon} height="100%" width="100%" />
                </button>
              </div>
            ))
          }
        </div>
      </>
    );
  } else {
    content = (
      <div className="main-page-block__app-tabs-container">
        {/* Tab toolbar */}
        <div className="main-page-block main-page-block__app-tabs">
          <div className="main-page-block main-page-block__app-tabs-list">
            {
              appIcons.map((appData, index) => (
                <div
                  key={`button-${index}`}
                  className={`app-list-item${activeTabIndex === index ? " app-list-item--active" : " app-list-item--inactive"}`}
                >
                  <button
                    type="button"
                    className="app-list-item-button"
                    onClick={() => HandleButtonClick(index)}
                  >
                    <ImageIcon icon={appData.icon} height="100%" width="100%" />
                  </button>
                </div>
              ))
            }
          </div>

          {/* Panel content */}
          <div className="main-page-block main-page-block__app-tabs-panel">
            <div className="main-page-block__app-tabs-panel-content">
              <ImageIcon icon={apps[activeTabIndex].image ? appImageMap[apps[activeTabIndex].image] : null} />
              <div className="main-page-block__app-tabs-panel-content__text-column">
                <div className="app-panel-title">{ apps[activeTabIndex].title }</div>
                <div className="app-panel-description">{ apps[activeTabIndex].description }</div>
                <Button to={apps[activeTabIndex].link} className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={blockRef}
      className={`main-page-block main-page-block--light main-page-block--apps-block ${isInStickyZone ? "main-page-block--sticky-zone" : ""}`}
      style={{
        transition: isInStickyZone ? "transform 0.1s ease-out" : "none",
        scrollSnapAlign: "start"
      }}
    >
      <div className="main-page-block padded-block">
        <div className="main-page-block__copy-container main-page-block__copy-container--center">
          <h3 className="main-page-header__main-header__header">Content Fabric Apps & Tools</h3>
        </div>
        { content }
      </div>
    </div>
  );
});

const ClientBlock = ({mobile}) => {
  let buttons;

  if(mobile) {
    buttons = (
      <>
        <Button className="main-page-block__client-section__dark-button" to="/about/contact">Contact Us</Button>
        <Button className="main-page-block__client-section__light-button" to="https://wallet.contentfabric.io/">Projects</Button>
      </>
    );
  } else {
    buttons = (
      <>
        <Button className="main-page-block__client-section__light-button" to="https://wallet.contentfabric.io/">Explore Projects</Button>
        <Button className="main-page-block__client-section__dark-button" to="/about/contact">Get in Touch</Button>
      </>
    );
  }

  return (
    <>
      <div className="main-page-block main-page-block--light main-page-block__client-section">
        <div className="main-page-block__copy-container">
          <h3 className="main-page-header__main-header__header">Used by the Most Innovative Sports, Entertainment & Creative Brands</h3>
        </div>
        <div className="main-page-block__client-section__row-container">
          <div className="main-page-block__client-section__buttons-container">
            { buttons }
          </div>
          {
            !mobile &&
            <div className="main-page-block__client-section__image-container">
              <ImageIcon icon={ClientGroupDesktopImage} />
            </div>
          }
        </div>
      </div>
      <div className="main-page-block main-page-block--light main-page-block__site-carousel">
        <SiteCarousel mobile={mobile} />
        {
          mobile &&
          <ImageIcon icon={ClientGroupMobileImage} />
        }
      </div>
    </>
  );
};

const MainPageMobile = () => {
  return (
    <div className="page dark no-padding">
      <HeaderBlock mobile/>
      <NotificationBanner className="mobile" />
      {/*<div className="main-page__blocks">*/}
      {/*  <AwardsBlock mobile />*/}
      {/*</div>*/}
      <div className="page light no-padding">
        <VideoStack mobile />
        <StreamingUseCases mobile />
        <BenefitsBlock mobile />
        <AppsBlock mobile />
        <ClientBlock mobile />
      </div>
    </div>
  );
};

const MainPageDesktop = () => {
  return (
    <div>
      <div className="page dark no-padding">
        <HeaderBlock />
        <NotificationBanner className="desktop" />
        {/*<div className="main-page__blocks">*/}
        {/*  <AwardsBlock />*/}
        {/*</div>*/}
      </div>
      <div className="main-page__blocks--light">
        <VideoStack />
        <StreamingUseCases />
        <div className="page light no-padding">
          <BenefitsBlock />
          <AppsBlock />
          <ClientBlock />
        </div>
      </div>
    </div>
  );
};

const MainPage = observer(() => {
  return uiStore.pageWidth < 1000 ? <MainPageMobile /> : <MainPageDesktop />;
});

export default MainPage;
