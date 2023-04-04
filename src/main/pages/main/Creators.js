import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {MainHeader} from "./Shared";
import {RichText, Video} from "../../components/Misc";
import {Button} from "../../components/Actions";
import KeyFeatures from "./KeyFeatures";
import FAQs from "../features/FAQs";
import Marketplaces from "./Marketplaces";

import HeaderImage from "../../static/images/main/2_built-for-new-creator-economy-(no-gradient).png";
import {MoneyIcon, TrendingUpIcon, DiscoverIcon} from "../../static/icons/Icons";

const Header = observer(({mobile}) => {
  const { header, subheader } = mainStore.l10n.creators.heading;

  if(mobile) {
    return (
      <MainHeader video={false}>
        <div className="main-page-header__copy-container">
          <h1 className="main-page-header__copy main-page-header__copy--feature">
            { header }
          </h1>
          <h2 className="main-page-header__copy main-page-header__copy--faded">
            { subheader }
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
          { header }
        </h2>
        <h2 className="main-page-header__copy main-page-header__copy--faded">
          { subheader }
        </h2>
      </div>
      <ImageIcon icon={HeaderImage} label="Example content" className="main-page-header__image" />
    </MainHeader>
  );
});

const VideoBlock = observer(() => {
  return (
    <div className="main-page-block main-page-block--video">
      <Video videoMetadata={mainStore.mainSite?.videos?.creators_page_video} className="main-page-block__video" />
      <div className="main-page-block__copy-container">
        <h2 className="main-page-block__copy-header">
          { mainStore.l10n.creators.video_block.header }
        </h2>

        <RichText richText={mainStore.l10n.creators.video_block.text} className="main-page-block__copy" />
      </div>
    </div>
  );
});

const CustomizeBlock = observer(() => {
  return (
    <div className="main-page-block main-page-block--customize">
      <div className="main-page-block__customize">
        <ImageIcon icon={TrendingUpIcon} className="main-page-block__customize__icon" />
        <div className="main-page-block__customize__text">
          { mainStore.l10n.creators.customize }
        </div>
      </div>
      <div className="main-page-block__customize">
        <ImageIcon icon={MoneyIcon} className="main-page-block__customize__icon" />
        <div className="main-page-block__customize__text">
          { mainStore.l10n.creators.monetize }
        </div>
      </div>
    </div>
  );
});

const GetStartedBlock = observer(() => {
  return (
    <div className="main-page-block main-page-block--get-started">
      <div className="main-page-block__copy-container main-page-block__copy-container center-align">
        <h2 className="main-page-block__copy-header">
          { mainStore.l10n.creators.get_started_block.header }
        </h2>
        <RichText richText={mainStore.l10n.creators.get_started_block.text} className="main-page-block__copy main-page-block__copy--faded" />
        <div className="main-page-block__copy-actions">
          <Button
            icon={DiscoverIcon}
            includeArrow
            to="/about/contact"
            className="dark secondary main-page-block__copy-action"
          >
            { mainStore.l10n.creators.get_started_block.cta }
          </Button>
        </div>
      </div>
    </div>
  );
});

const CreatorsMobile = () => {
  return (
    <div className="page dark no-padding">
      <Header mobile />
      <div className="main-page__blocks">
        <div className="padded-block">
          <VideoBlock />
        </div>
        <div className="main-page-block--marketplace">
          <Marketplaces mobile />
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
};

const CreatorsDesktop = () => {
  return (
    <div className="page dark no-padding">
      <Header />
      <div className="main-page__blocks">
        <div className="padded-block">
          <VideoBlock />
          <CustomizeBlock />
        </div>
        <div className="main-page-block--marketplace">
          <Marketplaces />
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
};

const Creators = observer(() => {
  return uiStore.pageWidth < 1000 ? <CreatorsMobile /> : <CreatorsDesktop />;
});

export default Creators;
