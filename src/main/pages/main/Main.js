import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import {autorun} from "mobx";

import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {TabsList, TabsPanel, Video} from "../../components/Misc";

import useScrollToElement from "../../../hooks/useScrollToElement";
import {useNavigate} from "react-router";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Mousewheel, Pagination} from "swiper/modules";

import {NotificationBanner} from "../../components/Header";
import SiteCarousel from "./SiteCarousel";
import Modal from "../../components/Modal";
import {Button} from "../../components/Actions";
import {
  ArrowCubeIcon,
  BlockchainMenuIcon,
  BoltIcon,
  CodeSandboxIcon,
  CubeIcon, IBCIcon,
  PlaySimpleIcon,
  XIcon
} from "../../static/icons/Icons";
import {SocialIcons} from "../../static/icons/Icons";

import EluvioColorLogo from "../../static/images/logos/eluvio-logo-hero";

import AppIconFB from "../../static/icons/apps_new/1_Fabric_Browser";
import AppIconIngest from "../../static/icons/apps_new/2_Media_Ingest";
import AppIconStream from "../../static/icons/apps_new/3_Livestream_Manager";
import AppIconCS from "../../static/icons/apps_new/04_Creator_Studio";
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

import EluvioGroupDesktopImage from "../../static/images/main/team-card.jpg";
import EluvioGroupMobileImage from "../../static/images/main/team-card-mobile.jpg";
import ClientGroupDesktopImage from "../../static/images/main/clients/client-group-desktop";
import ClientGroupMobileImage from "../../static/images/main/clients/client-group-mobile";
import {
  BackgroundImage,
  Box,
  Button as MantineButton,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import styles from "../../static/modules/Main.module.css";

const HeaderBlock = observer(({mobile}) => {
  const isTablet = mobile && uiStore.pageWidth > 390;

  return (
    <MainHeader video={false} backgroundImage={HeaderBackgroundImage}>
      <Box maw={1440}>
        <Flex direction={mobile ? "column" : "row"} gap={mobile ? 30 : 50} align={mobile ? "center" : "flex-start"}>
          <Box flex={1} pt={{base: 0, sm: 10, md: 30}} w={isTablet ? "80%" : "100%"}>
            <Image src={EluvioColorLogo} h="auto" flex={1} maw="100%" p={{base: "0 70px", sm: "0 30px", md: 0}} />
          </Box>
          <Flex direction="column" flex={2} gap={mobile ? 25 : 32} align={mobile ? "center" : "flex-start"} ta={mobile ? "center" : ""}>
            <Title
              order={2}
              fz={{base: "1.25rem", sm: "1.675rem", md: "1.75rem"}}
              fw={mobile ? 500 : 600}
              c="white.0"
            >
              { mainStore.l10n.main.heading.top_header }
            </Title>
            <Title fw={600} c="white.0" fz={{base: "1.75rem", sm: "2.5rem", md: "2.875rem"}} lh="137%" className={styles.headerMainTitle}>{ mainStore.l10n.main.heading.header }</Title>

            {
              mobile &&
              <Button
                className="light header__button header__button--cta"
                to="https://wallet.contentfabric.io/ibc"
              >
                <ImageIcon icon={IBCIcon} width={18} height={15} />
                IBC 2025 Recap - See it all here!
              </Button>
            }

            <Text c="white.0" fz={{base: "1.25rem", sm: "1.675rem", md: "1.75rem"}} fw={mobile ? 500 : 600} className={styles.headerSubduedText}>{ mainStore.l10n.main.heading.subheader }</Text>
            {
              !mobile &&
              <Button className="light header__button header__button--cta" to="https://wallet.contentfabric.io/ibc">
                <ImageIcon icon={IBCIcon} width={18} height={15} />
                IBC 2025 Recap - See it all here!
              </Button>
            }
          </Flex>
        </Flex>
      </Box>
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
        <TabsList
          tabs={tabsData}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          wrap={false}
          orientation="horizontal"
        />
        <TabsPanel
          tabs={tabsData}
          activeTabIndex={activeTabIndex}
          mobile
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
          <p className={`main-page-block__streaming-card__title main-page-block__streaming-card__card-title main-page-block__streaming-card__title--${color}`}>{ title }</p>
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
                to={action.link || (mobile ? action.mobile_link : undefined)}
                onClick={(action.videoHash && !mobile) ? (event) => {
                  event.preventDefault();
                  event.stopPropagation();
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
  const swiperRef = useRef(null);

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

  const originalSpeed = 1500;

  return (
    <div className="main-page-block--light main-page-block--use-cases" style={{background: "linear-gradient(180deg, rgba(255, 255, 255, 1.00) 0%, rgba(192, 192, 212, 1) 100%)"}}>
      <div className="main-page-block__copy-container">
        <h3 className="main-page-block__copy-header">
          <span className="main-page-block--subtle-title">Use Cases</span>&nbsp;
          <span className={`main-page-block__streaming-card__title main-page-block__streaming-card__title--${titleColor} main-page-block__streaming-card__title--header`}>{ title }</span>
        </h3>
      </div>
      <div
        className="main-page-block__streaming-cards-container"
        onMouseEnter={() => {
          swiperRef.current.autoplay.stop();
          if(swiperRef.current.wrapperEl) {
            swiperRef.current.wrapperEl.style.transitionDuration = "0s";
          }
        }}
        onMouseLeave={() => {
          if(swiperRef.current.wrapperEl) {
            swiperRef.current.wrapperEl.style.transitionDuration = `${originalSpeed}ms`;
          }

          swiperRef.current.autoplay.start();
        }}
      >
        <Swiper
          className="carousel"
          modules={mobile ? [Pagination] : [Pagination, Mousewheel, Autoplay]}
          speed={3000}
          pagination={{
            enabled: true,
            clickable: true
          }}
          mousewheel={{
            enabled: !mobile,
            direction: "horizontal"
          }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false
          }}
          autoHeight
          loop
          spaceBetween={12}
          slidesPerView="auto"
          style={{
            "--swiper-pagination-color": "#959595",
            "--swiper-navigation-color": "#959595",
          }}
          onSlideChange={HandleSlideChange}
          onSwiper={swiper => {
            window.swiper = swiper;
            swiperRef.current = swiper;
          }}
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
      <div className="padded">
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

        <Box w="100%" mt={35}>
          <SimpleGrid cols={{base: 1, sm: 2}}>
            {/* Card 1 */}
            <Box p={{base: "30px 90px", lg: "130px 90px"}} bg="black.2" bdrs={12} className={styles.benefitCard}>
              <Flex direction="column" gap={32} justify="center" h="100%">
                <Text fz={24} c="white.0" ta="center">
                  { cards.no_1.title }
                </Text>
                <Flex direction={{base: "column", sm: "row"}} gap={28}>
                  <Text c="white.5" fw={400} fz={16} ta={mobile ? "center" : ""}>
                    { mobile ? cards.no_1.text_left_mobile : cards.no_1.text_left }
                  </Text>
                  <Text c="white.5" fw={400} fz={16} ta={mobile ? "center" : ""}>
                    { mobile ? cards.no_1.text_right_mobile : cards.no_1.text_right }
                  </Text>
                </Flex>
              </Flex>
            </Box>
            {/* Card 2 */}
            <Box bdrs={12} className={styles.benefitCard} p={{base: "30px 90px", md: "30px 80px"}} bg="white.0">
              <Flex direction="column" gap={20} h="100%" justify="center">
                {
                  (mobile ? cards.no_2.text_mobile : cards.no_2.text).map((item, i) => (
                    <Text key={`card-2-item-${i}`} ta="center" fw={i === 1 ? 600 : 500} fz={i === 0 ? 16 : 24} fs={i === 2 ? "italic" : "normal"}>
                      { item }
                    </Text>
                  ))
                }
              </Flex>
            </Box>
            {/* Card 3 */}
            <Box bdrs={12} className={styles.benefitCard} p={{base: "30px 90px", md: "30px 45px 30px 65px"}} bg="white.0">
              <Flex direction="column" gap={28} justify="center" h="100%">
                <Text c="black.2" fw={500} fz={16}>
                  { cards.no_3.text_one }
                </Text>
                <Text c="black.2" fw={600} fz={{md: 36, lg: 44}} lts={"-1px"} lh={1.25}>
                  { mobile ? cards.no_3.text_two_mobile : cards.no_3.text_two }
                </Text>
                <Button className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple" onClick={() => navigate("/content-fabric/technology")}>
                  <Text fz={{base: 14, lg: 16}}>
                    { mobile ? cards.no_3.text_three_mobile : cards.no_3.text_three }
                  </Text>
                </Button>
              </Flex>
            </Box>
            {/* Card 4 */}
            <Box bdrs={12} className={styles.benefitCard} w="100%" h={"auto"}>
              <Flex direction="row">
                <Box bg="white.0" p={{base: "29px 25px", lg: "45px 40px"}} flex={3} justify="center" bdrs="12px 0 0 12px">
                  <Stack gap={24} className={styles.benefitCard4LeftCol}>
                    <Text fw={500} lh="147%" fz={{base: "12px", lg: "16px"}}>
                      {
                        mobile ? (cards.no_4.tabs[activeTabIndex].value_mobile || cards.no_4.tabs[activeTabIndex].value) : cards.no_4.tabs[activeTabIndex].value
                      }
                    </Text>
                    <SimpleGrid cols={5} spacing={2}>
                      {
                        [CubeIcon, BlockchainMenuIcon, BoltIcon, CodeSandboxIcon, ArrowCubeIcon].map((iconItem, i) => (
                          <ImageIcon
                            key={`benefit-icon-${i}`}
                            icon={iconItem}
                            className={styles.benefitCard4Icon}
                          />
                        ))
                      }
                    </SimpleGrid>
                  </Stack>
                </Box>
                <Box bg="black.2" p={{base: "29px 22px", lg: "29px 32px"}} bdrs="0 12px 12px 0" flex={2}>
                  <TabsList
                    tabs={(cards?.no_4?.tabs || []).map(tab => (
                      {title: tab.label}
                    ))}
                    activeTabIndex={activeTabIndex}
                    setActiveTabIndex={setActiveTabIndex}
                    orientation={mobile ? "horizontal" : "vertical"}
                    darkMode
                    wrap={false}
                    size={uiStore.pageWidth < 1440 ? "xs" : "sm"}
                  />
                </Box>
              </Flex>
            </Box>
            {/* Card 5 */}
            <Box p={{base: "30px 70px", lg: "130px 78px"}} bg="black.2" bdrs={12} className={styles.benefitCard} justify="center">
              <Stack gap={32}>
                <Text c="white.0" fw={500} fz={{base: 16, md: 13, lg: 16}}>
                  { cards.no_5.text_one }
                </Text>
                <Text c="white.0" fw={600} fz={{base: 24, md: 21, lg: 24}} lts="-0.5px">
                  { cards.no_5.text_two }
                </Text>
                <MantineButton
                  color="purple.0"
                  bdrs={20}
                  leftSection={<ImageIcon icon={SocialIcons.GithubIcon} color="var(--mantine-color-black-0)" />}
                  w="fit-content"
                  component="a"
                  href={cards.no_5.github_link}
                  target="_blank"
                >
                  <Text c="black.0" fz={{base: 16, md: 14, lg: 16}} fw={500}>
                    Eluvio GitHub
                  </Text>
                </MantineButton>
              </Stack>
            </Box>
            {/* Card 6 */}
            <Box bg="black.2" bdrs={12} className={styles.benefitCard} id="eluvio-team">
              <BackgroundImage
                src={mobile ? EluvioGroupMobileImage : EluvioGroupDesktopImage}
                h="100%"
                w="100%"
                bdrs={12}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </div>
    </div>
  );
});

const AppsBlock = observer(({mobile}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const blockRef = useRef(null);
  const {isInStickyZone} = useState(useScrollToElement(blockRef));
  const toolbarRef = useRef(null);
  const swiperRef = useRef(null);

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
        <div ref={toolbarRef} className="main-page-block main-page-block__app-tabs-list--mobile">
          <Swiper
            spaceBetween={0}
            loop
            centeredSlides
            pagination={{
              enabled: false
            }}
            slidesPerView={4}
            onSwiper={(swiper) => swiperRef.current = swiper}
            onSlideChange={(swiper) => {
              setActiveTabIndex(swiper.realIndex);
            }}
            onTouchStart={() => {
              setIsDragging(true);
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            {
              appIcons.map((appData, index) => (
                <SwiperSlide
                  key={`button-${index}`}
                  className="app-list-item-wrapper"
                >
                  <div
                    key={`button-${index}`}
                    className={`app-list-item${(activeTabIndex === index && !isDragging) ? " app-list-item--active" : " app-list-item--inactive"}`}
                  >
                    <button
                      type="button"
                      className="app-list-item-button"
                      tabIndex={index}
                    >
                      <ImageIcon icon={appData.icon} height="100%" width="100%" />
                    </button>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>

        {/* Tab panel */}
        <div className="main-page-block main-page-block__app-tabs-panel main-page-block main-page-block__app-tabs-panel--mobile">
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
      <HeaderBlock mobile />
      <NotificationBanner mobile className="mobile" />
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
