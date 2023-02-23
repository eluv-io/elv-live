import React from "react";
import {observer} from "mobx-react";
import {uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Video} from "../../components/Misc";
import {Action, Button} from "../../components/Actions";
import SiteCarousel from "./SiteCarousel";

import EluvioLogo from "../../static/images/logos/eluvio-logo-color.png";
import FeaturesImage from "../../static/images/main/Advanced-full-feature-platform.png";
import ExperiencesImage1 from "../../static/images/main/Creators-&-Content-Businesses.jpg";
import ExperiencesImage2 from "../../static/images/main/Developers-and-Node-Providers.jpg";

import {BlockchainIcon, DiscoverIcon, FilmIcon, MoneyIcon, PlayIcon, PowerIcon} from "../../static/icons/Icons";

const Header = () => {
  return (
    <MainHeader>
      <h1 className="main-page-header__logo-container">
        <ImageIcon icon={EluvioLogo} label="Eluvio" className="main-page-header__logo" />
        <div className="main-page-header__logo-header">
          Own your Destiny
        </div>
        <div className="main-page-header__logo-subheader">
          The Content Blockchain
        </div>
      </h1>
      <div className="main-page-header__copy-container no-tablet">
        <h2 className="main-page-header__copy">
          We believe in creative IP and the future of individual ownership
        </h2>
      </div>
    </MainHeader>
  );
};

const FeatureBanner = () => {
  return (
    <div className="main-page-feature-banner no-tablet">
      <div className="main-page-feature-banner__items">
        <div className="main-page-feature-banner__item">
          Creators own the fruits of their work
        </div>
        <div className="main-page-feature-banner__item">
          Content distribution is efficient & sustainable
        </div>
        <div className="main-page-feature-banner__item">
          Users own their data
        </div>
        <div className="main-page-feature-banner__item">
          Clear market opportunity for publishers & sponsors
        </div>
        <div className="main-page-feature-banner__item">
          Transparency for all
        </div>
      </div>
    </div>
  );
};

const VideoBlock = observer(({mobile}) => {
  if(mobile) {
    return (
      <div className="main-page-block main-page-block--video">
        <Video versionHash="hq__AxfX3M5EixtPpKzLnca4wzyveT3ZSXjsKNi3ZpwfdBEzUJB9tUqnvdx7JfXzrmofs1qKdAJ5rg" className="main-page-block__video" />
        <div className="main-page-block__copy-container">
          <h3 className="main-page-block__copy-header">The Content Fabric Technology</h3>
          <div className="main-page-block__copy">
            <div>
              <div className="main-page-block__icon-copy">
                <ImageIcon icon={BlockchainIcon} label="blockchain" className="main-page-block__icon" />
                <p>An Eco-Friendly Content Blockchain</p>
              </div>
              <div className="main-page-block__icon-copy">
                <ImageIcon icon={PlayIcon} label="blockchain" className="main-page-block__icon" />
                <p>A Hyper Efficient Video Distribution Platform</p>
              </div>
              <div className="main-page-block__icon-copy">
                <ImageIcon icon={MoneyIcon} label="blockchain" className="main-page-block__icon" />
                <p>A Crypto friendly Commerce Platform</p>
              </div>
              <div className="main-page-block__icon-copy">
                <ImageIcon icon={PowerIcon} label="blockchain" className="main-page-block__icon" />
                <p>An API that powers all content needs</p>
              </div>
              <div className="main-page-block__icon-copy">
                <ImageIcon icon={FilmIcon} label="blockchain" className="main-page-block__icon" />
                <p>An all-in-one media API</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page-block main-page-block--video">
      <Video versionHash="hq__AxfX3M5EixtPpKzLnca4wzyveT3ZSXjsKNi3ZpwfdBEzUJB9tUqnvdx7JfXzrmofs1qKdAJ5rg" className="main-page-block__video" />
      <div className="main-page-block__copy-container">
        <h5 className="main-page-block__copy-subheader">Enabled By</h5>
        <h2 className="main-page-block__copy-header">The Content Fabric Technology</h2>
        <div className="main-page-block__copy">
          <div className="main-page-block__icon-column">
            <ImageIcon icon={BlockchainIcon} label="blockchain" className="main-page-block__icon" />
            <ImageIcon icon={PlayIcon} label="play" className="main-page-block__icon" />
            <ImageIcon icon={MoneyIcon} label="money" className="main-page-block__icon" />
            <ImageIcon icon={PowerIcon} label="power" className="main-page-block__icon" />
            <ImageIcon icon={FilmIcon} label="film" className="main-page-block__icon" />
          </div>
          <div>
            <p>A novel utility blockchain network built for content</p>
            <p>Programmable, Hyper Efficient, and Sustainable (50X today's CDNs)</p>
            <p>Storage, Distribution, Streaming and more</p>
            <p>On Chain Ownership, Versioning and Access Control</p>
          </div>
        </div>
      </div>
    </div>
  );
});

const FeaturesBlock = ({mobile}) => {
  if(mobile) {
    return (
      <div className="main-page-block main-page-block--features">
        <div className="main-page-block__copy-container">
          <h2 className="main-page-block__copy-header main-page-block__copy-header--feature">Advanced Full-Feature Media Platform</h2>
        </div>
        <ImageIcon icon={FeaturesImage} label="featured images" className="main-page-block__image" />
        <div className="main-page-block__copy-container">
          <div className="main-page-block__copy main-page-block__copy--faded">
            <div>
              <p>
                Hyper-efficient, decentralized platform provides dramatically faster and lower-cost distribution. Adaptive bandwidth, 4K/HDR, and multiplatform support.
              </p>
              <p>
                Replaces traditional CDNs.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page-block main-page-block--features">
      <div className="main-page-block__copy-container">
        <h5 className="main-page-block__copy-subheader">Resulting In</h5>
        <h2 className="main-page-block__copy-header">Advanced Full-Feature Platform For All Web3 Media</h2>
        <div className="main-page-block__copy">
          <div>
            <p>
              All-in-one Content Management & Distribution from source asset to audience. Replaces CDNs, Clouds & Aggregators for Video, App & Static Content.
            </p>
            <p>
              Low Latency 4K Streaming with Beautiful Quality & Advanced Video Features. Built in Monetization through Blockchain - tickets, tokens, & payments.
            </p>
            <p>
              <Action to="/features/details" className="dark highlight">
                See Feature Details
              </Action>
            </p>
          </div>
        </div>
      </div>
      <ImageIcon icon={FeaturesImage} label="featured images" className="main-page-block__image" />
    </div>
  );
};

const ExperiencesBlock = ({mobile}) => {
  return (
    <div className="main-page-block main-page-block--experiences">
      <h3 className={`main-page-block__copy-header ${mobile ? "" : "center-align"}`}>
        Create, Distribute & Own Stunning Web3 Experiences
      </h3>
      <div className="main-page-block__separator" />
      <div className="main-page-block__experience-images">
        <Action to="/creators-and-publishers" className="main-page-block__experience-image">
          <ImageIcon icon={ExperiencesImage1} className="main-page-block__experience-image__image" />
          <h4 className="main-page-block__experience-image__text">Creators & Content Businesses</h4>
        </Action>
        <Action to="/content-fabric" className="main-page-block__experience-image">
          <ImageIcon icon={ExperiencesImage2} className="main-page-block__experience-image__image" />
          <h4 className="main-page-block__experience-image__text">Developers & Node Providers</h4>
        </Action>
      </div>
    </div>
  );
};

const BrowseProjectsBlock = ({mobile}) => {
  if(mobile) {
    return (
      <div className="main-page-block main-page-block--browse">
        <h3 className="main-page-block__browse__text">
          Discover Web3 Media Projects
        </h3>
        <div className="main-page-block__browse__actions">
          <Button
            icon={DiscoverIcon}
            includeArrow
            to="/wallet"
            className="dark secondary main-page-block__browse__action"
          >
            Browse All Projects
          </Button>
        </div>
        <div className="main-page-block__copy-container main-page-block__browse__copy">
          <div className="main-page-block__copy main-page-block__copy--faded">
            <p>
              All built on the Content Blockchain
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
          Discover Web3 Media Projects.
        </div>
        <div>
          All build on the Content Blockchain.
        </div>
      </h2>
      <div className="main-page-block__browse__actions">
        <Button
          icon={DiscoverIcon}
          includeArrow
          to="/wallet"
          className="dark secondary main-page-block__browse__action"
        >
          Browse All Projects
        </Button>
      </div>
    </div>
  );
};

const MainPageMobile = observer(() => {
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
});

const MainPageDesktop = observer(() => {
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
});

const MainPage = observer(() => {
  return uiStore.pageWidth < 1000 ? <MainPageMobile /> : <MainPageDesktop />;
});

export default MainPage;
