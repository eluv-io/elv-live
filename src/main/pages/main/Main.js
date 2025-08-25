import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";

import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Tabs} from "../../components/Misc";
import {Link} from "react-router-dom";
import {Button} from "../../components/Actions";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, FreeMode} from "swiper";

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

import VideoStackQuality from "../../static/images/main/video-stack/01-Hyper Efficient.jpg";
import VideoStackULL from "../../static/images/main/video-stack/02-ULL.mp4";
import VideoStackSecurity from "../../static/images/main/video-stack/03-Secure-and-Verifiable.jpg";
import VideoStackMonetization from "../../static/images/main/video-stack/05-Monetization.mp4";

import UefaLogo1 from "../../static/images/main/use-cases/UEFA_Euro_2024_Logo-1";
import UefaLogo2 from "../../static/images/main/use-cases/UEFA_Euro_2024_Logo-2";

import UseCaseDevicesImage from "../../static/images/main/use-cases/use-case-devices";
import UseCaseAiImage from "../../static/images/main/use-cases/use-cases-ai";
import UseCaseEpcrImage from "../../static/images/main/use-cases/use-cases-epcr";
import UseCaseMediaImage from "../../static/images/main/use-cases/use-cases-media";
import UseCaseNftsImage from "../../static/images/main/use-cases/use-cases-nfts";
import UseCaseStreamingImage from "../../static/images/main/use-cases/use-cases-streaming";

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
          <Button className="light header__button header__button--cta">{mainStore.l10n.main.heading.cta_text}</Button>
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
  HandleClick
}) => {
  return (
    <div className="main-page-block__streaming-card">
      <div className="main-page-block__streaming-card--padded">
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
      <ImageIcon icon={image} className="main-page-block__streaming-card__image" />
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

  useEffect(() => {
    const feature = features[currentSlideIndex];
    if (feature?.use_case) {
      setTitle(feature.use_case);
      setTitleColor(feature.use_case_color || "purple");
    }
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
          delay: 1,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop
        freeMode
        spaceBetween={12}
        speed={3000}
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
              />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
});

const BenefitsBlock = observer(() => {
  return (
    <div className="main-page-block main-page-block--light padded-block">
      <div className="main-page-block__copy-container main-page-block__copy-container--center">
        <h3 className="main-page-block__copy-header center-align">Why now & why us?</h3>
      </div>
      <div className="main-page-block__benefit-cards">
        <div className="main-page-block__benefit-card main-page-block__benefit-card-1">
          <div className="main-page-block__benefit-card-1__column-text">
            <div className="main-page-block__benefit-card-1__title">
              Over 80% of the Internet is video. $500B/yr $1.5T by 2030.
            </div>
            <div className="main-page-block__benefit-card-1__row-text">
              <div className="main-page-block__benefit-card-1__description-text">Yet The Internet is not designed for content.</div>
              <div className="main-page-block__benefit-card-1__description-text">Addresses, streams, manages files & bytes ... but not content.</div>
            </div>
          </div>
        </div>
        <div className="main-page-block__benefit-card main-page-block__benefit-card-2">
          <div className="main-page-block__benefit-card-2__column">
            <div>Media applications are Trapped by Complexity. Multi-tier, Multi-vendor.</div>
            <div>CDNs & Media Clouds are costly, complex, slow and limit capability.</div>
            <div>Especially with regard to multi versioned media & AI data.</div>
          </div>
        </div>
        <div className="main-page-block__benefit-card main-page-block__benefit-card-3">
          <div className="main-page-block__benefit-card-3__column">
            <div>The Fabric's Content Native Protocol</div>
            <div>Eliminates complexity, maximizes efficiency, & is AI native.</div>
            <div>Content Fabric Technology Deep Dive →</div>
          </div>
        </div>
        <div className="main-page-block__benefit-card main-page-block__benefit-card-4">
          <div className="main-page-block__benefit-card-4__row">
            <div>An open network of nodes running the Content Fabric protocol.</div>
            <div className="main-page-block__benefit-card-4__button-panel">
              <Button className="tabs__button" disabled>Content Native</Button>
              <Button className="tabs__button" disabled>Just-In-Time</Button>
              <Button className="tabs__button" disabled>Tamper Proof</Button>
              <Button className="tabs__button" disabled>Open</Button>
              <Button className="tabs__button" disabled>Inherently Fast</Button>
              <Button className="tabs__button" disabled>So Much Simpler</Button>
              <Button className="tabs__button" disabled>Hyper Efficient</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const AppsBlock = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const sectionRef = useRef(null);

  const appIcons = [
    {icon: AppIcon1, alt: "Fabric Browser app icon"},
    {icon: AppIcon2, alt: "Media Ingest app icon"},
    {icon: AppIcon3, alt: "Livestream Manager app icon"},
    {icon: AppIcon4, alt: "Creator Studio app icon"},
    {icon: AppIcon5, alt: "Evie app icon"},
    {icon: AppIcon6, alt: "AI Content Search app icon"},
    {icon: AppIcon7, alt: "Content Analytics & Reporting app icon"}
  ];

  const appContent = [
    {image: "", title: "Fabric Browser", description: "", link: ""},
    {image: "", title: "Media Ingest", description: "", link: ""},
    {image: "", title: "Livestream Manager", description: "", link: ""},
    {image: "", title: "Creator Studio", description: "", link: ""},
    {image: "", title: "Evie", description: "", link: ""},
    {image: "", title: "AI Content Search", description: "", link: ""},
    {image: AnalyticsApp, title: "Content Analytics & Reporting", description: "View and track comprehensive metrics for streaming content and delivery quality of service (QoS).", link: "/apps/analytics"}
  ];

  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const HandleScroll = () => {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if(!sectionRef.current) { return; }

        const section = sectionRef.current;
        const sectionRect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const numberOfTabs = appContent.length;

        const scrollPosition = windowHeight - sectionRect.top;

        // Only update if the section is within the viewport
        if(scrollPosition > 0 && scrollPosition < (windowHeight + sectionHeight)) {
          // Calculate a scrollable height for the tabs within the section
          const tabScrollHeight = sectionHeight / numberOfTabs;

          // Determine the current tab index based on the scroll position
          const newTabIndex = Math.floor((scrollPosition - (windowHeight / 2)) / tabScrollHeight);

          // Index must be within a valid range (within the tab count)
          const clampedIndex = Math.max(0, Math.min(numberOfTabs - 1, newTabIndex));

          setActiveTabIndex(clampedIndex);
        }
      }, 100);
    };

    window.addEventListener("scroll", HandleScroll);
    HandleScroll();

    return () => {
      window.removeEventListener("scroll", HandleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [appContent.length]);

  const HandleButtonClick = (index) => {
    setActiveTabIndex(index);

    if(sectionRef.current) {
      const section = sectionRef.current;
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const numberOfTabs = appContent.length;
      const tabScrollHeight = sectionHeight / numberOfTabs;

      const targetScrollOffset = (index * tabScrollHeight) + (tabScrollHeight / 2);
      const targetScrollPosition = sectionTop + targetScrollOffset - (windowHeight / 2);

      window.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="main-page-block main-page-block--light padded-block">
      <div className="main-page-block__copy-container main-page-block__copy-container--center">
        <h3 className="main-page-block__copy-header center-align">Content Fabric Apps & Tools</h3>
      </div>

      <div ref={sectionRef} className="main-page-block__app-tabs-container">
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
              <ImageIcon icon={appContent[activeTabIndex].image} />
              <div className="main-page-block__app-tabs-panel-content__text-column">
                <div className="app-panel-title">{ appContent[activeTabIndex].title }</div>
                <div className="app-panel-description">{ appContent[activeTabIndex].description }</div>
                <Link to={appContent[activeTabIndex].link} className="app-panel-link">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
};

const MainPage = observer(() => {
  return uiStore.pageWidth < 1000 ? <MainPageMobile /> : <MainPageDesktop />;
});

export default MainPage;
