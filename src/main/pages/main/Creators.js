import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {Video} from "../../components/Misc";
import {Action, Button} from "../../components/Actions";

import HeaderImage from "../../static/images/main/2_built-for-new-creator-economy-(no-gradient).png";
import {MoneyIcon, TrendingUpIcon, DiscoverIcon} from "../../static/icons/Icons";
import KeyFeatures from "./KeyFeatures";
import FAQs from "../features/FAQs";

const Header = ({mobile}) => {
  if(mobile) {
    return (
      <MainHeader video={false}>
        <div className="main-page-header__copy-container">
          <h1 className="main-page-header__copy main-page-header__copy--feature">
            Built for the New Creator Economy
          </h1>
          <h2 className="main-page-header__copy main-page-header__copy--faded">
            Create, Distribute & Let Your Community Own
          </h2>
        </div>
        <ImageIcon icon={HeaderImage} label="Example content" className="main-page-header__image" />
      </MainHeader>
    );
  }

  return (
    <MainHeader>
      <div className="main-page-header__copy-container">
        <h2 className="main-page-header__copy main-page-header__copy--feature">
          Built for the New Creator Economy
        </h2>
        <h2 className="main-page-header__copy main-page-header__copy--faded">
          Create, Distribute & Sell Your Content
        </h2>
      </div>
      <ImageIcon icon={HeaderImage} label="Example content" className="main-page-header__image" />
    </MainHeader>
  );
};

const VideoBlock = () => {
  return (
    <div className="main-page-block main-page-block--video">
      <Video versionHash="hq__AxfX3M5EixtPpKzLnca4wzyveT3ZSXjsKNi3ZpwfdBEzUJB9tUqnvdx7JfXzrmofs1qKdAJ5rg" className="main-page-block__video" />
      <div className="main-page-block__copy-container">
        <h2 className="main-page-block__copy-header">
          Full-feature media platform eliminates the need for CDNs and transcoding services
        </h2>
        <div className="main-page-block__copy">
          <div>
            <p>
              Publish and instantly distribute your content. Beautiful Quality & Advanced Video Features.
            </p>
            <p>
              Built in Monetization through Blockchain: turn-key sites, tickets, tokens, payments & brand-able marketplaces
            </p>
            <p>
              <Action to="/features/details" className="dark highlight">See Feature Details</Action>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomizeBlock = () => {
  return (
    <div className="main-page-block main-page-block--customize">
      <div className="main-page-block__customize">
        <ImageIcon icon={TrendingUpIcon} className="main-page-block__customize__icon" />
        <div className="main-page-block__customize__text">
          Customize Your Experience & Build your Community
        </div>
      </div>
      <div className="main-page-block__customize">
        <ImageIcon icon={MoneyIcon} className="main-page-block__customize__icon" />
        <div className="main-page-block__customize__text">
          Create & Monetize as your Brand Grows
        </div>
      </div>
    </div>
  );
};

const GetStartedBlock = () => {
  return (
    <div className="main-page-block main-page-block--get-started">
      <div className="main-page-block__copy-container main-page-block__copy-container center-align">
        <h2 className="main-page-block__copy-header">
          Create & Own Your Web3 Brand
        </h2>
        <div className="main-page-block__copy main-page-block__copy--faded">
          <div>
            <p>
              Take control of your content and get started creating your first digital offering. Custom sites, stores & resale marketplaces for any media type content release.
            </p>
          </div>
        </div>
        <div className="main-page-block__copy-actions">
          <Button
            icon={DiscoverIcon}
            includeArrow
            to="/about/contact"
            className="dark secondary main-page-block__copy-action"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreatorsMobile = observer(() => {
  return (
    <div className="page dark no-padding">
      <Header mobile />
      <div className="main-page__blocks">
        <div className="padded-block">
          <VideoBlock />
          <CustomizeBlock />
        </div>
        <div className="padded-block">
          <GetStartedBlock />
        </div>
        <div className="main-page__block main-page__block--key-features">
          <KeyFeatures mobile />
        </div>
      </div>
      <FAQs />
    </div>
  );
});

const CreatorsDesktop = observer(() => {
  return (
    <div className="page dark no-padding">
      <Header />
      <div className="main-page__blocks">
        <div className="padded-block">
          <VideoBlock />
          <CustomizeBlock />
        </div>
        <div className="padded-block">
          <GetStartedBlock />
        </div>
        <div className="main-page__block main-page__block--key-features">
          <div className="padded-block">
            <KeyFeatures />
          </div>
        </div>
      </div>
      <FAQs />
    </div>
  );
});

const Creators = observer(() => {
  return uiStore.pageWidth < 1000 ? <CreatorsMobile /> : <CreatorsDesktop />;
});

export default Creators;
