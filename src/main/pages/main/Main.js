import React, {useState} from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Tabs} from "../../components/Misc";
import {Button} from "../../components/Actions";

import GlobalStreamingImage from "../../static/images/main/global-streaming-map.png";
import MultiViewImage from "../../static/images/main/player-multi-view.png";

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
import {Link} from "react-router-dom";

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

  return (
    <div className="main-page-block main-page-block--video-stack">
      <div className="main-page-block__copy-container main-page-block__copy-container--center">
        <div className="main-page-header__main-header__header">
          { header }
        </div>
        <Tabs
          tabs={features.map(feature => ({title: feature.title, content: feature.description}))}
        />
      </div>
    </div>
  );
});

const GlobalStreaming = observer(() => {
  const { header } = mainStore.l10n.main.global_streaming;

  return (
    <div className="main-page-block main-page-block--global-streaming">
      <div className="main-page-block__copy-container main-page-block__copy-container--center">
        <h3 className="main-page-block__copy-header center-align">
          { header }
        </h3>
        <ImageIcon icon={GlobalStreamingImage} width="80%" />
      </div>
    </div>
  );
});

const MultiViewBlock = observer(() => {
  const { header } = mainStore.l10n.main.multi_view;

  return (
    <div className="main-page-block main-page-block">
      <div className="main-page-block__copy-container main-page-block__copy-container--center">
        <h3 className="main-page-block__copy-header center-align">
          {header}
        </h3>
        <ImageIcon icon={MultiViewImage} width="80%"/>
      </div>
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
  const [activeTabIndex, setActiveTabIndex] = useState(6);

  const appIcons = [
    {icon: AppIcon1, index: 0},
    {icon: AppIcon2, index: 1},
    {icon: AppIcon3, index: 2},
    {icon: AppIcon4, index: 3},
    {icon: AppIcon5, index: 4},
    {icon: AppIcon6, index: 5},
    {icon: AppIcon7, index: 6}
  ];

  const appContent = [
    {image: "", title: "Fabric Browser", description: "", link: "", index: 0},
    {image: "", title: "Media Ingest", description: "", link: "", index: 1},
    {image: "", title: "Livestream Manager", description: "", link: "", index: 2},
    {image: "", title: "Creator Studio", description: "", link: "", index: 3},
    {image: "", title: "Evie", description: "", link: "", index: 4},
    {image: "", title: "AI Content Search", description: "", link: "", index: 5},
    {image: "", title: "Content Analytics & Reporting", description: "View and track comprehensive metrics for streaming content and delivery quality of service (QoS).", link: "/apps/analytics", index: 6}
  ];

  return (
    <div className="main-page-block main-page-block--light padded-block">
      <div className="main-page-block__copy-container main-page-block__copy-container--center">
        <h3 className="main-page-block__copy-header center-align">Content Fabric Apps & Tools</h3>
      </div>
      <div className="main-page-block main-page-block__app-tabs">
        <div className="main-page-block main-page-block__app-tabs-list">
          {
            appIcons.map(appData => (
              <div
                key={`button-${appData.icon}`}
                className={`app-list-item${activeTabIndex === appData.index ? " app-list-item--active" : ""}`}
              >
                <button
                  type="button"
                  className="app-list-item-button"
                  onClick={() => setActiveTabIndex(appData.index)}
                >
                  <ImageIcon icon={appData.icon} height="100%" width="100%" />
                </button>
              </div>
            ))
          }
        </div>
        <div className="main-page-block main-page-block__app-tabs-panel">
          <div className="main-page-block__app-tabs-panel-content">
            <div></div>
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
          <GlobalStreaming/>
          <MultiViewBlock/>
        </div>
      </div>
      <div className="page light no-padding">
        <BenefitsBlock/>
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
          <div className="padded-block">
            <VideoStack />
            <GlobalStreaming />
            <MultiViewBlock />
          </div>
        </div>
      </div>
      <div className="page light no-padding">
        <BenefitsBlock />
        <AppsBlock />
      </div>
    </div>
  );
};

const MainPage = observer(() => {
  return uiStore.pageWidth < 1000 ? <MainPageMobile /> : <MainPageDesktop />;
});

export default MainPage;
