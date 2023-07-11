import React from "react";
import {observer} from "mobx-react";
import {BlockchainIcon, PlayCircleIcon, WalletIcon} from "../../static/icons/Icons";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";

import FeatureImage1 from "../../static/images/main/media_wallet/01_device_mackup_tv.png";
import FeatureImage2 from "../../static/images/main/media_wallet/07_device_mackup_pc_mobile.png";
import BackgroundImage from "../../static/images/main/media_wallet/08_background_image.jpg";

const FeatureBlock1 = observer(() => {
  const {header, subheader, tagline} = mainStore.l10n.media_wallet.heading;

  return (
    <div className="main-page-header">
      <div className="main-page-header__content">
        <ImageIcon icon={FeatureImage1} label="Example content" className="main-page-header__image"/>
        <div className="main-page-header__copy-container">
          <h4 className="main-page-header__copy main-page-header__copy--tagline main-page-header__copy--shadow">
            {tagline}
          </h4>
          <h1 className="main-page-header__copy main-page-header__copy--feature main-page-header__copy--shadow">
            {header}
          </h1>
          <h2 className="main-page-header__copy main-page-header__copy--text main-page-header__copy--shadow">
            {subheader}
          </h2>
        </div>
      </div>
    </div>
  );
});

const FeatureBlock2 = observer(() => {
  const {header, subheader, tagline} = mainStore.l10n.media_wallet.features;

  return (
    <div className="main-page-header">
      <div className="main-page-header__content">
        <div className="main-page-header__copy-container">
          <h4 className="main-page-header__copy main-page-header__copy--tagline main-page-header__copy--shadow">
            {tagline}
          </h4>
          <h1 className="main-page-header__copy main-page-header__copy--feature main-page-header__copy--shadow">
            {header}
          </h1>
          <h2 className="main-page-header__copy main-page-header__copy--text main-page-header__copy--shadow">
            {subheader}
          </h2>
        </div>
        <ImageIcon icon={FeatureImage2} label="Example content" className="main-page-header__image"/>
      </div>
    </div>
  );
});


const TextBoxesBlock = observer(() => {
  const icons = [BlockchainIcon, PlayCircleIcon, WalletIcon];

  return (
    <div className="main-page-block__text-boxes">
      {(mainStore.l10n.media_wallet.text_boxes || []).map((item, index) => (
        <div key={item} className="main-page-block__text-box">
          <div className="main-page-block__text-box-content">
            <ImageIcon icon={icons[index]} className="main-page-block__text-box-content__icon" />
            <div className="main-page-block__text-box-content__text">
              {item}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});


const MediaWallet = () => {
  return (
    <div className="page dark no-padding page--image-background" style={{backgroundImage: `url('${BackgroundImage}')`}}>
      <FeatureBlock1 />
      <FeatureBlock2 />
      <div className="main-page__blocks">
        <div className="padded-block">
          <div className="main-page-block__text main-page-block__text--shadow">
            { mainStore.l10n.media_wallet.blurb }
          </div>
        </div>
        <div className="padded-block">
          <TextBoxesBlock />
        </div>
      </div>
    </div>
  );
};

export default MediaWallet;
