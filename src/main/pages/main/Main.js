import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Tabs} from "../../components/Misc";
import {Action, Button} from "../../components/Actions";
import SiteCarousel from "./SiteCarousel";

import GlobalStreamingImage from "../../static/images/main/global-streaming-map.png";
import MultiViewImage from "../../static/images/main/player-multi-view.png";

import ExperiencesImage1 from "../../static/images/main/Creators-&-Content-Businesses.jpg";
import ExperiencesImage2 from "../../static/images/main/developers-and-node-providers.png";
import ExperiencesImage3 from "../../static/images/main/consumers_&_users_card_v2.jpg";

const experienceImages = [
  ExperiencesImage1,
  ExperiencesImage2,
  ExperiencesImage3
];

import AwardImage1 from "../../static/images/main/awards/nab-product-of-the-year-2024.webp";
import AwardImage2 from "../../static/images/main/awards/nab-product-of-the-year-2022.webp";
import AwardImage3 from "../../static/images/main/awards/csi-award-2024.webp";
import AwardImage4 from "../../static/images/main/awards/seicon-dc-cs.webp";
import AwardImage5 from "../../static/images/main/awards/seicon-grand-prize.webp";
import AwardImage6 from "../../static/images/main/awards/hpa-award-2020.webp";

const awardsImages = [
  AwardImage1,
  AwardImage2,
  AwardImage3,
  AwardImage4,
  AwardImage5,
  AwardImage6
];

import HeaderBackgroundImage from "../../static/images/main/dot-header-bg.webp";

import {DiscoverIcon} from "../../static/icons/Icons";

const AwardsBlock = observer(() => {
  return (
    <div className="main-page-block main-page-block--awards">
      {
        awardsImages.map(image => (
          <div
            key={`award-${image}`}
            className="main-page-block main-page-block--award"
            style={{"--award-image-url": `url(${image})`}}
          >
            <ImageIcon icon={image} />
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
            <div className="main-page-header__main-header__subheader-container-text">
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

const ExperiencesBlock = observer(({mobile}) => {
  return (
    <div className="main-page-block main-page-block--experiences">
      <div>
        <h3 className={`main-page-block__copy-header ${mobile ? "" : "center-align"}`} style={{marginBottom: "10px"}}>
          {mainStore.l10n.main.experiences_block.header}
        </h3>
        <h3 className={`main-page-block__copy-header ${mobile ? "" : "center-align"}`}>
          { mainStore.l10n.main.experiences_block.subheader }
        </h3>
      </div>
      <div className="main-page-block__separator" />
      <div className="main-page-block__experience-cards">
        {
          mainStore.l10n.main.experiences_block.cards.map(({header, description, link}, index) =>
            <Action to={link} className="main-page-block__experience-card" key={`experience-card-${index}`}>
              <ImageIcon icon={experienceImages[index]} className="main-page-block__experience-card__image" />
              <h4 className="main-page-block__experience-card__header">
                { header }
              </h4>
              <div className="main-page-block__experience-card__description">
                { description.map(text => <div key={text}>{text}</div>) }
              </div>
              <div className="main-page-block__experience-card__actions">
                <Action className="main-page-block__experience-card__action">{ mainStore.l10n.actions.learn_more }</Action>
              </div>
            </Action>
          )
        }
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
        <div className="main-page__block main-page__block--experiences">
          <div className="padded-block">
            <ExperiencesBlock mobile />
          </div>
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
        <div className="main-page__block main-page__block--experiences">
          <div className="padded-block">
            <ExperiencesBlock />
          </div>
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
