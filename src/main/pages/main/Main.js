import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Carousel, RichText, Video} from "../../components/Misc";
import {Action, Button} from "../../components/Actions";
import SiteCarousel from "./SiteCarousel";

import FeaturesImage from "../../static/images/main/advance_full_feature_platform_v3.png";
import ExperiencesImage1 from "../../static/images/main/Creators-&-Content-Businesses.jpg";
import ExperiencesImage2 from "../../static/images/main/developers-and-node-providers.png";
import ExperiencesImage3 from "../../static/images/main/consumers_and_users_v2.png";

const experienceImages = [
  ExperiencesImage1,
  ExperiencesImage2,
  ExperiencesImage3
];

import {BlockchainIcon, DiscoverIcon, FilmIcon, MoneyIcon, PlayIcon, PowerIcon} from "../../static/icons/Icons";

const FeaturesCarousel = observer(() => {
  return (
    <Carousel pagination={false} lazy={false} className="main-page-header__features-carousel">
      {
        mainStore.l10n.main.features_carousel.map((content, index) =>
          <div className="main-page-header__features-carousel__card" key={`card-${index}`}>
            { content }
          </div>
        )
      }
    </Carousel>
  );
});

const HeaderBlock = observer(() => {
  return (
    <MainHeader>
      <div className="main-page-header__main-header">
        <div className="main-page-header__main-header__headers">
          <h1 className="main-page-header__main-header__header">
            { mainStore.l10n.main.heading.header }
          </h1>
          <h3 className="main-page-header__main-header__subheader">
            { mainStore.l10n.main.heading.subheader }
          </h3>
        </div>
        <div className="main-page-header__tagline">
          <h3 className="main-page-header__main-header__tagline">{ mainStore.l10n.main.heading.tagline }</h3>
        </div>
        <FeaturesCarousel />
      </div>
    </MainHeader>
  );
});

const VideoBlock = observer(({mobile}) => {
  const { header, subheader, features } = mainStore.l10n.main.video_block;

  const icons = [
    BlockchainIcon,
    PlayIcon,
    MoneyIcon,
    PowerIcon,
    FilmIcon
  ];

  return (
    <div className="main-page-block main-page-block--video">
      <Video videoMetadata={mainStore.mainSite?.videos?.main_page_video} className="main-page-block__video" />
      <div className="main-page-block__copy-container">
        <h5 className="main-page-block__copy-subheader">
          { subheader }
        </h5>
        {
          mobile &&
          <h3 className="main-page-block__copy-header">
            { header }
          </h3>
        }
        {
          !mobile &&
          <h2 className="main-page-block__copy-header">
            { header }
          </h2>
        }
        <div className="main-page-block__copy">
          {features.map((feature, index) => (
            <div key={feature} className="main-page-block__icon-copy">
              <ImageIcon icon={icons[index]} className="main-page-block__icon" />
              <p>{feature}</p>
            </div>
          ))}
          <Action to="/content-fabric">{ mainStore.l10n.actions.learn_more }</Action>
        </div>
      </div>
    </div>
  );
});

const FeaturesBlock = observer(({mobile}) => {
  const copy = mainStore.l10n.main.features_block;

  if(mobile) {
    return (
      <div className="main-page-block main-page-block--features">
        <ImageIcon icon={FeaturesImage} label="featured images" className="main-page-block__image" />
        <div className="main-page-block__copy-container">
          <h5 className="main-page-block__copy-subheader">
            { copy.subheader }
          </h5>
          <h3 className="main-page-block__copy-header">
            { copy.header }
          </h3>
        </div>
        <div className="main-page-block__copy-container">
          <RichText richText={copy.text} className="main-page-block__copy" />
        </div>
      </div>
    );
  }

  return (
    <div className="main-page-block main-page-block--features">
      <div className="main-page-block__copy-container">
        <h5 className="main-page-block__copy-subheader">
          { copy.subheader }
        </h5>
        <h2 className="main-page-block__copy-header">
          { copy.header }
        </h2>
        <RichText richText={copy.text} className="main-page-block__copy" />
      </div>
      <ImageIcon icon={FeaturesImage} label="featured images" className="main-page-block__image" />
    </div>
  );
});

const ExperiencesBlock = observer(({mobile}) => {
  return (
    <div className="main-page-block main-page-block--experiences">
      <div>
        <h3 className={`main-page-block__copy-header ${mobile ? "" : "center-align"}`} style={{marginBottom: "10px"}}>
          { mainStore.l10n.main.experiences_block.header }
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
            to="/wallet"
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
          to="/wallet"
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
        <div className="padded-block">
          <VideoBlock mobile />
          <FeaturesBlock mobile />
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
        <div className="padded-block">
          <VideoBlock />
          <FeaturesBlock />
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
