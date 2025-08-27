import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import {autorun} from "mobx";

import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Tabs} from "../../components/Misc";
import {Link} from "react-router-dom";import {useNavigate} from "react-router";

import {Button} from "../../components/Actions";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, FreeMode} from "swiper";
import {PlusIcon, ArrowCubeIcon, BlockchainMenuIcon, BoltIcon, CodeSandboxIcon, CubeIcon, PlaySimpleIcon} from "../../static/icons/Icons";
import {SocialIcons} from "../../static/icons/Icons";

import AwardImage1 from "../../static/images/main/awards/nab-product-of-the-year-2024.webp";
import AwardImage2 from "../../static/images/main/awards/nab-product-of-the-year-2022.webp";
import AwardImage3 from "../../static/images/main/awards/csi-award-2024.webp";
import AwardImage4 from "../../static/images/main/awards/seicon-dc-cs.webp";
import AwardImage5 from "../../static/images/main/awards/seicon-grand-prize.webp";
import AwardImage6 from "../../static/images/main/awards/hpa-award-2020.webp";

const awardsImages = [
  {img: AwardImage1, alt: "NAB Product of the Year Award 2024"},
  {img: AwardImage2, alt: "NAB Product of the Year Award 2022"},
  {img: AwardImage3, alt: "CSI Awards Winner 2024"},
  {img: AwardImage4, alt: "SEICon Innovation Hub - Best in Show Award"},
  {img: AwardImage5, alt: "SEICon Innovation Hub - Best in Show Grand Prize Award"},
  {img: AwardImage6, alt: "HPA Award 2020"}
];

import AppIcon1 from "../../static/icons/apps_new/1_Fabric_Browser";
import AppIcon2 from "../../static/icons/apps_new/2_Media_Ingest";
import AppIcon3 from "../../static/icons/apps_new/3_Livestream_Manager";
import AppIcon4 from "../../static/icons/apps_new/4_Creator_Studio";
import AppIcon5 from "../../static/icons/apps_new/5_Evie";
import AppIcon6 from "../../static/icons/apps_new/6_AI_Search";
import AppIcon7 from "../../static/icons/apps_new/7_Analytics";

import HeaderBackgroundImage from "../../static/images/main/dot-header-bg.webp";
import AnalyticsApp from "../../static/images/main/apps/analytics-app";
import AiSearchApp from "../../static/images/main/apps/ai-search-app";
import EvieApp from "../../static/images/main/apps/evie-app";
import CreatorStudioApp from "../../static/images/main/apps/creator-studio-app";

import VideoStackQuality from "../../static/images/main/video-stack/01-Hyper Efficient.jpg";
import VideoStackULL from "../../static/images/main/video-stack/02-ULL.mp4";
import VideoStackSecurity from "../../static/images/main/video-stack/03-Secure-and-Verifiable.jpg";
import VideoStackAiNative from "../../static/images/main/video-stack/04-AI-Native.jpg";
import VideoStackMonetization from "../../static/images/main/video-stack/05-Monetization.mp4";

import UefaLogo1 from "../../static/images/main/use-cases/UEFA_Euro_2024_Logo-1";
import UefaLogo2 from "../../static/images/main/use-cases/UEFA_Euro_2024_Logo-2";

import UseCaseDevicesImage from "../../static/images/main/use-cases/use-case-devices";
import UseCaseAiImage from "../../static/images/main/use-cases/use-cases-ai";
import UseCaseEpcrImage from "../../static/images/main/use-cases/use-cases-epcr";
import UseCaseMediaImage from "../../static/images/main/use-cases/use-cases-media";
import UseCaseNftsImage from "../../static/images/main/use-cases/use-cases-nfts";
import UseCaseStreamingImage from "../../static/images/main/use-cases/use-cases-streaming";

import EluvioGroupImage from "../../static/images/main/eluvio-group-photo-2025.png";
import Carousel from "Common/Carousel";

import CricketImage from "../../static/images/main/partners/cricket";
import EpcrImage from "../../static/images/main/partners/epcr";
import EpcrTVImage from "../../static/images/main/partners/epcr-tv";
import FandangoImage from "../../static/images/main/partners/fandango";
import FlashImage from "../../static/images/main/partners/flash";
import SupermanImage from "../../static/images/main/partners/superman.jpg";
import UefaImage from "../../static/images/main/partners/uefa";
import Uefa2Image from "../../static/images/main/partners/uefa-2";
import YellowstoneImage from "../../static/images/main/partners/yellowstone";

const partnerImages = [
  EpcrImage,
  UefaImage,
  CricketImage,
  EpcrTVImage,
  Uefa2Image,
  FandangoImage,
  YellowstoneImage,
  FlashImage,
  SupermanImage
];

const AwardsBlock = observer(() => {
  return (
    <div className="main-page-block main-page-block--awards">
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
  );
});

const HeaderBlock = observer(() => {
  return (
    <MainHeader video={false} backgroundImage={HeaderBackgroundImage}>
      <div className="main-page-header__main-header">
        <div className="main-page-header__main-header__headers">
          <div className="main-page-header__main-header__header">{mainStore.l10n.main.heading.header}</div>
          <div className="main-page-header__main-header__subheader-container">
            <div className="main-page-header__main-header__subheader-container-text main-page-header__main-header__subheader-container-text--text-overlay">
              <span>
                <span className="main-page-header__main-header__subheader">{ mainStore.l10n.main.heading.subheader }</span>
              </span>
            </div>
          </div>
          <Button className="light header__button header__button--cta" to={mainStore.l10n.main.benefits_block.learn_more_link}>
            <ImageIcon icon={PlaySimpleIcon} width={18} height={15} />
            {mainStore.l10n.main.heading.cta_text}
          </Button>
        </div>
      </div>
    </MainHeader>
  );
});

const VideoStack = observer(() => {
  const { header, features } = mainStore.l10n.main.video_stack;
  const mediaMap = {
    "quality": VideoStackQuality,
    "ull": VideoStackULL,
    "security": VideoStackSecurity,
    "ai-native": VideoStackAiNative,
    "monetization": VideoStackMonetization
  };

  return (
    <div className="main-page-block main-page-block--light main-page-block--video-stack">
      <div className="main-page-block padded-block">
        <div className="main-page-block__copy-container main-page-block__copy-container--center">
          <div className="main-page-header__main-header__header">
            { header }
          </div>
          <Tabs
            tabs={features.map(feature => (
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
            ))}
          />
        </div>
      </div>
    </div>
  );
});

const StreamingCard = ({
  title,
  description,
  image,
  color,
  logos=[],
  buttonText,
  buttonLeftIcon,
  HandleClick
}) => {
  return (
    <div className="main-page-block__streaming-card">
      <div className="main-page-block__streaming-card__content">
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
        <ImageIcon icon={image} className="main-page-block__streaming-card__image" />
      </div>
      <div className="main-page-block__streaming-card__button-container">
        <Button className={`main-page-block__streaming-card__button main-page-block__streaming-card__button--${color}`} onClick={HandleClick}>
          {
            buttonLeftIcon &&
            <ImageIcon icon={buttonLeftIcon} height={16} width={18} />
          }
          { buttonText }
        </Button>
      </div>
    </div>
  );
};

const StreamingUseCases = observer(() => {
  const [title, setTitle] = useState("Streaming");
  const [titleColor, setTitleColor] = useState("purple");
  const { features } = mainStore.l10n.main.streaming_use_cases;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const imageMap = {
    "streaming-1": UseCaseEpcrImage,
    "streaming-2": UseCaseNftsImage,
    "broadcast": UseCaseStreamingImage,
    "video-ai": UseCaseAiImage,
    "publishing-1": UseCaseDevicesImage,
    "publishing-2": UseCaseMediaImage
  };

  const logoMap = {
    "uefa-1": UefaLogo1,
    "uefa-2": UefaLogo2
  };

  const iconMap = {
    "play-arrow": PlaySimpleIcon
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
    <div className="main-page-block main-page-block--light main-page-block--global-streaming">
      <div className="main-page-block__copy-container">
        <h3 className="main-page-block__copy-header">
          <span className="main-page-block--subtle-title">Use Cases</span>&nbsp;
          <span className={`main-page-block__streaming-card__title main-page-block__streaming-card__title--${titleColor}`}>{ title }</span>
        </h3>
      </div>
      <Swiper
        className="carousel"
        modules={[Autoplay, FreeMode]}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop
        freeMode
        spaceBetween={12}
        speed={6000}
        slidesPerView={3.5}
        effect="slide"
        onSlideChange={HandleSlideChange}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 5
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 7
          },
          1000: {
            slidesPerView: 3.5,
            spaceBetween: 12
          },
          1500: {
            slidesPerView: 4,
            spaceBetween: 12
          }
        }}
      >
        {
          features.map(feature => (
            <SwiperSlide key={`streaming-card-${feature.title}`}>
              <StreamingCard
                title={feature.title}
                description={feature.description}
                image={imageMap[feature.image]}
                color={feature.use_case_color}
                logos={(feature.logos || []).map(logo => logoMap[logo])}
                buttonText={feature.action_text || "Case Study"}
                buttonLeftIcon={feature.action_text_icon ? iconMap[feature.action_text_icon] : null}
              />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
});

const BenefitsBlock = observer(() => {
  const {cards, learn_more_link} = mainStore.l10n.main.benefits_block;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const navigate = useNavigate();

  const isActive = (index) => {
    if(activeTabIndex === index) { return true; }
  };

  return (
    <div className="main-page-block main-page-block--light main-page-block--benefits">
      <div className="main-page-block main-page-block--benefits padded">
        <div className="main-page-block__copy-container main-page-block__copy-container--center">
          <h3 className="main-page-header__main-header__header main-page-header__main-header__header--no-margin">Why Now & Why Us?</h3>
          <Button className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple" to={learn_more_link}>
            <ImageIcon icon={PlaySimpleIcon} width={18} height={15} />
            Learn More
          </Button>
        </div>
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
              <Button className="main-page-block__streaming-card__button main-page-block__streaming-card__button--purple" onClick={() => navigate("/content-fabric/technology")}>{ cards.no_3.text_three }</Button>
            </div>
          </div>
          <div className="main-page-block__benefit-card main-page-block__benefit-card-4">
            <div className="main-page-block__benefit-card-4__row">
              <div className="main-page-block__benefit-card-4__text-panel">
                {
                  cards.no_4.tabs[activeTabIndex].value
                }
                <div className="main-page-block__benefit-card-4__icons">
                  {
                    [CubeIcon, BlockchainMenuIcon, BoltIcon, CodeSandboxIcon, ArrowCubeIcon].map((iconItem, i) => (
                      <ImageIcon key={`benefit-icon-${i}`} icon={iconItem} />
                    ))
                  }
                </div>
              </div>
              <div className="main-page-block__benefit-card-4__button-panel">
                {
                  (cards?.no_4?.tabs || []).map((tab, i) => (
                    <Button
                      key={tab.label}
                      className={`"tabs__button tabs__button--dark ${isActive(i) ? "active" : "inactive"}`}
                      onClick={() => setActiveTabIndex(i)}
                    >
                      { tab.label }
                      <ImageIcon icon={PlusIcon} height={10} width={10} />
                    </Button>
                  ))
                }
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
          <div className="main-page-block__benefit-card main-page-block__benefit-card-6" id="eluvio-team">
            <div className="main-page-block__benefit-card-6__team-image" style={{backgroundImage: `url(${EluvioGroupImage})`}}></div>
            <div className="main-page-block__benefit-card-6__text-content">
              <div className="main-page-block__benefit-card-6__left-column">{ cards.no_6.text_left }</div>
              <div className="main-page-block__benefit-card-6__right-column">
                { cards.no_6.text_right }
                {/*<Link to={""}>Meet the Team →</Link>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const AppsBlock = observer(() => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isInStickyZone, setIsInStickyZone] = useState(false);
  const blockRef = useRef(null);
  const lastScrollY = useRef(0);
  const hasSnapped = useRef(false);
  const {apps} = mainStore.l10n.main.apps_block;

  const appIcons = [
    {icon: AppIcon1, alt: "Fabric Browser app icon"},
    {icon: AppIcon2, alt: "Media Ingest app icon"},
    {icon: AppIcon3, alt: "Livestream Manager app icon"},
    {icon: AppIcon4, alt: "Creator Studio app icon"},
    {icon: AppIcon5, alt: "Evie app icon"},
    {icon: AppIcon6, alt: "AI Content Search app icon"},
    {icon: AppIcon7, alt: "Content Analytics & Reporting app icon"}
  ];

  const appImageMap = {
    "creator-studio": CreatorStudioApp,
    "evie": EvieApp,
    "ai-search": AiSearchApp,
    "analytics": AnalyticsApp,
    "media-ingest": "",
    "fabric-browser": "",
    "live-stream": ""
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;
          const isInView = entry.isIntersecting && entry.intersectionRatio > 0.1;

          setIsInStickyZone(isInView);

          if(
            entry.isIntersecting &&
            isScrollingDown
          ) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            const middle = viewportHeight / 2;

            const topMagnetZone = {
              start: middle - 100,  // 100px above middle
              end: middle + 100     // 100px below middle
            };

            let shouldSnap = false;
            let scrollTarget = "start";

            // Check if SECTION TOP is in the magnetic zone
            if (rect.top >= topMagnetZone.start && rect.top <= topMagnetZone.end) {
              shouldSnap = true;
              scrollTarget = "start"; // Snap section top to viewport top
            }

            if(shouldSnap) {
              hasSnapped.current = true;
              setTimeout(() => {
                entry.target.scrollIntoView({
                  behavior: "smooth",
                  block: scrollTarget
                });
              }, 100);
            }
          }

          if(!entry.isIntersecting || entry.intersectionRatio < 0.05) {
            hasSnapped.current = false;
          }

          lastScrollY.current = currentScrollY;
        });
      },
      {
        threshold: [0.05, 0.1, 0.3, 0.7],
        rootMargin: "0px"
      }
    );

    if(blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      if(blockRef.current) {
        observer.unobserve(blockRef.current);
      }
    };
  }, []);

  const HandleButtonClick = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <div ref={blockRef} className={`main-page-block main-page-block--light main-page-block--apps-block ${isInStickyZone ? "main-page-block--sticky-zone" : ""}`} style={{transition: isInStickyZone ? "transform 0.1s ease-out" : "none", scrollSnapAlign: "start"}}>
      <div className="main-page-block padded-block">
        <div className="main-page-block__copy-container main-page-block__copy-container--center">
          <h3 className="main-page-block__copy-header center-align">Content Fabric Apps & Tools</h3>
        </div>

        <div className="main-page-block__app-tabs-container">
          {/* Tab toolbar */}
          <div className="main-page-block main-page-block__app-tabs">
            <div className="main-page-block main-page-block__app-tabs-list">
              {
                appIcons.map((appData, index) => (
                  <div
                    key={`button-${index}`}
                    className={`app-list-item${activeTabIndex === index ? " app-list-item--active" : ""}`}
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
                  <Link to={apps[activeTabIndex].link} className="app-panel-link">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const PartnersBlock = () => {
  return (
    <div className="main-page-block main-page-block--light main-page-block--partners">
      <div className="main-page-block main-page-block__partners__header">
        <div className="main-page-block__copy-container">
          <h3 className="main-page-block__copy-header">Used by the Most Innovative Sports, Entertainment & Creative Brands</h3>
          <div className="main-page-block__partners__button-container">
            <Button className="main-page-block__partners__button--explore">Explore Projects</Button>
            <Button className="main-page-block__partners__button--contact">Get in Touch</Button>
          </div>
        </div>
      </div>
      <div className="main-page-block">
        {/*<Swiper*/}
        {/*  // onSlideChange={swiper => {*/}
        {/*  //   setActiveSlide(swiper.realIndex + 1);*/}
        {/*  // }}*/}
        {/*  // onSwiper={swiper => swiperRef.current = swiper}*/}
        {/*  spaceBetween={2}*/}
        {/*  slidesPerView="auto"*/}
        {/*  // loop*/}
        {/*>*/}
        {/*  { partnerImages.map((img, i) =>*/}
        {/*    <SwiperSlide key={`partner-${i}`}>*/}
        {/*      <ImageIcon*/}
        {/*        // className="key-feature-card__banner"*/}
        {/*        icon={img}*/}
        {/*        width={169}*/}
        {/*        style={{aspectRatio: "2/3"}}*/}
        {/*      />*/}
        {/*    </SwiperSlide>*/}
        {/*  )}*/}
        {/*</Swiper>*/}
        <Carousel
          minVisible={3}
          maxVisible={9}
          elements={partnerImages.map((img, i) => <ImageIcon key={`partner-${i}`} icon={img} style={{aspectRatio: "2/3"}} width={169} />)}
        />
      </div>
    </div>
  );
};

const MainPageMobile = () => {
  return (
    <div className="page dark no-padding">
      <HeaderBlock/>
      <div className="main-page__blocks">
        <AwardsBlock/>
        <div className="padded-block">
          <VideoStack/>
          <StreamingUseCases/>
        </div>
      </div>
      <div className="page light no-padding">
        <BenefitsBlock/>
        <AppsBlock />
        <PartnersBlock />
      </div>
    </div>
  );
};

const MainPageDesktop = () => {
  return (
    <div>
      <div className="page dark no-padding">
        <HeaderBlock />
        <div className="main-page__blocks">
          <AwardsBlock />
        </div>
      </div>
      <div className="main-page__blocks--light">
        <VideoStack />
        <StreamingUseCases />
        <div className="page light no-padding">
          <BenefitsBlock />
          <AppsBlock />
          <PartnersBlock />
        </div>
      </div>
    </div>
  );
};

const MainPage = observer(() => {
  return uiStore.pageWidth < 1000 ? <MainPageMobile /> : <MainPageDesktop />;
});

export default MainPage;
