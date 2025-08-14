import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Tabs} from "../../components/Misc";
import {Button} from "../../components/Actions";
import SiteCarousel from "./SiteCarousel";

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

import HeaderBackgroundImage from "../../static/images/main/dot-header-bg.webp";

import {DiscoverIcon} from "../../static/icons/Icons";

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

const BrowseProjectsBlock = observer(({mobile}) => {
  const { header, subheader } = mainStore.l10n.main.projects_block;

  if(mobile) {
    return (
      <div className="main-page-block main-page-block--browse">
        <h3 className="main-page-block__browse__text">
          { header }
        </h3>
        <div className="main-page-block__browse__actions">
          <Button
            icon={DiscoverIcon}
            includeArrow
            href={mainStore.walletAppUrl}
            target="_blank"
            className="dark secondary main-page-block__browse__action"
          >
            { mainStore.l10n.actions.browse_all_projects }
          </Button>
        </div>
        <div className="main-page-block__copy-container main-page-block__browse__copy">
          <div className="main-page-block__copy main-page-block__copy--faded">
            <p>
              { subheader }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page-block main-page-block--browse">
      <h2 className="main-page-block__browse__text">
        <div>
          { header }
        </div>
        <div>
          { subheader }
        </div>
      </h2>
      <div className="main-page-block__browse__actions">
        <Button
          icon={DiscoverIcon}
          includeArrow
          href={mainStore.walletAppUrl}
          target="_blank"
          className="dark secondary main-page-block__browse__action"
        >
          { mainStore.l10n.actions.browse_all_projects }
        </Button>
      </div>
    </div>
  );
});

const MainPageMobile = () => {
  return (
    <div className="page dark no-padding">
      <HeaderBlock />
      <div className="main-page__blocks">
        <AwardsBlock />
        <div className="padded-block">
          <VideoStack />
          <GlobalStreaming />
          <MultiViewBlock />
        </div>
        <div className="padded-block">
          <BrowseProjectsBlock mobile />
        </div>
        <SiteCarousel mobile />
      </div>
    </div>
  );
};

const MainPageDesktop = () => {
  return (
    <div className="page dark no-padding">
      <HeaderBlock />
      <div className="main-page__blocks">
        <AwardsBlock />
        <div className="padded-block">
          <VideoStack />
          <GlobalStreaming />
          <MultiViewBlock />
        </div>
        <div className="padded-block">
          <BrowseProjectsBlock />
        </div>
        <SiteCarousel />
      </div>
    </div>
  );
};

const MainPage = observer(() => {
  return uiStore.pageWidth < 1000 ? <MainPageMobile /> : <MainPageDesktop />;
});

export default MainPage;
