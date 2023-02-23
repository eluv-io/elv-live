import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {RichText, Video} from "../../components/Misc";
import {Action, Button} from "../../components/Actions";
import SiteCarousel from "./SiteCarousel";

import EluvioLogo from "../../static/images/logos/eluvio-logo-color.png";
import FeaturesImage from "../../static/images/main/Advanced-full-feature-platform.png";
import ExperiencesImage1 from "../../static/images/main/Creators-&-Content-Businesses.jpg";
import ExperiencesImage2 from "../../static/images/main/Developers-and-Node-Providers.jpg";

import {BlockchainIcon, DiscoverIcon, FilmIcon, MoneyIcon, PlayIcon, PowerIcon} from "../../static/icons/Icons";

const Header = observer(() => {
  return (
    <MainHeader>
      <h1 className="main-page-header__logo-container">
        <ImageIcon icon={EluvioLogo} label="Eluvio" className="main-page-header__logo" />
        <div className="main-page-header__logo-header">
          { mainStore.l10n.main.heading.header }
        </div>
        <div className="main-page-header__logo-subheader">
          { mainStore.l10n.main.heading.subheader }
        </div>
      </h1>
      <div className="main-page-header__copy-container no-tablet">
        <h2 className="main-page-header__copy">
          { mainStore.l10n.main.heading.tagline }
        </h2>
      </div>
    </MainHeader>
  );
});

const FeatureBanner = observer(() => {
  return (
    <div className="main-page-feature-banner no-tablet">
      <div className="main-page-feature-banner__items">
        {mainStore.l10n.main.feature_banner.map(feature =>
          <div key={feature} className="main-page-feature-banner__item">
            {feature}
          </div>
        )}
      </div>
    </div>
  );
});

const VideoBlock = observer(({mobile}) => {
  const { header, subheader, features, features_mobile } = mainStore.l10n.main.video_block;

  const icons = [
    BlockchainIcon,
    PlayIcon,
    MoneyIcon,
    PowerIcon,
    FilmIcon
  ];

  if(mobile) {
    return (
      <div className="main-page-block main-page-block--video">
        <Video versionHash="hq__AxfX3M5EixtPpKzLnca4wzyveT3ZSXjsKNi3ZpwfdBEzUJB9tUqnvdx7JfXzrmofs1qKdAJ5rg" className="main-page-block__video" />
        <div className="main-page-block__copy-container">
          <h3 className="main-page-block__copy-header">
            { header }
          </h3>
          <div className="main-page-block__copy">
            {features_mobile.map((feature, index) =>
              <div key={feature} className="main-page-block__icon-copy">
                <ImageIcon icon={icons[index]} className="main-page-block__icon" />
                <p>{feature}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page-block main-page-block--video">
      <Video versionHash="hq__AxfX3M5EixtPpKzLnca4wzyveT3ZSXjsKNi3ZpwfdBEzUJB9tUqnvdx7JfXzrmofs1qKdAJ5rg" className="main-page-block__video" />
      <div className="main-page-block__copy-container">
        <h5 className="main-page-block__copy-subheader">
          { subheader }
        </h5>
        <h2 className="main-page-block__copy-header">
          { header }
        </h2>
        <div className="main-page-block__copy-with-icons">
          <div className="main-page-block__icon-column">
            <ImageIcon icon={BlockchainIcon} label="blockchain" className="main-page-block__icon" />
            <ImageIcon icon={PlayIcon} label="play" className="main-page-block__icon" />
            <ImageIcon icon={MoneyIcon} label="money" className="main-page-block__icon" />
            <ImageIcon icon={PowerIcon} label="power" className="main-page-block__icon" />
            <ImageIcon icon={FilmIcon} label="film" className="main-page-block__icon" />
          </div>
          <div className="main-page-block__copy">
            { features.map(feature => <p key={feature}>{feature}</p>)}
          </div>
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
        <div className="main-page-block__copy-container">
          <h2 className="main-page-block__copy-header main-page-block__copy-header--feature">
            { copy.header_mobile }
          </h2>
        </div>
        <ImageIcon icon={FeaturesImage} label="featured images" className="main-page-block__image" />
        <div className="main-page-block__copy-container">
          <RichText richText={copy.text_mobile} className="main-page-block__copy main-page-block__copy--faded" />
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
      <h3 className={`main-page-block__copy-header ${mobile ? "" : "center-align"}`}>
        { mainStore.l10n.main.experiences_block.header }
      </h3>
      <div className="main-page-block__separator" />
      <div className="main-page-block__experience-images">
        <Action to="/creators-and-publishers" className="main-page-block__experience-image">
          <ImageIcon icon={ExperiencesImage1} className="main-page-block__experience-image__image" />
          <h4 className="main-page-block__experience-image__text">
            { mainStore.l10n.main.experiences_block.creators }
          </h4>
        </Action>
        <Action to="/content-fabric" className="main-page-block__experience-image">
          <ImageIcon icon={ExperiencesImage2} className="main-page-block__experience-image__image" />
          <h4 className="main-page-block__experience-image__text">
            { mainStore.l10n.main.experiences_block.developers }
          </h4>
        </Action>
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
            { mainStore.l10n.misc.browse_all_projects }
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
          { mainStore.l10n.misc.browse_all_projects }
        </Button>
      </div>
    </div>
  );
});

const MainPageMobile = () => {
  return (
    <div className="page dark no-padding">
      <Header />
      <div className="main-page__blocks">
        <div className="padded-block">
          <FeaturesBlock mobile />
          <VideoBlock mobile />
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
      <Header />
      <FeatureBanner />
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
