import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {Button} from "../../components/Actions";
import {Swiper, SwiperSlide} from "swiper/react";

import {BlockchainIcon, PlayCircleIcon, WalletIcon} from "../../static/icons/Icons";
import FeatureImage1 from "../../static/images/main/media_wallet/01_device_mackup_tv.png";
import FeatureImage2 from "../../static/images/main/media_wallet/07_device_mackup_pc_mobile.png";
import BackgroundImage from "../../static/images/main/media_wallet/08_background_image.jpg";
import AppleTVButton from "../../static/images/main/media_wallet/02_download_on_AppleTV_badge_v2.png";
import CarouselImage1 from "../../static/images/main/media_wallet/03_media_wallet.png";
import CarouselImage2 from "../../static/images/main/media_wallet/04_media_wallet_sign_in.png";
import CarouselImage3 from "../../static/images/main/media_wallet/05_my_items.png";
import CarouselImage4 from "../../static/images/main/media_wallet/06_my_media.png";


const FeatureBlock1 = observer(() => {
  const {header, subheader, tagline, button_text, apple_tv_url} = mainStore.l10n.media_wallet.feature_1;

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
          <div className="main-page-header__copy">
            <a href={apple_tv_url} target="_blank" className="main-page-header__apple-tv-button">
              <ImageIcon icon={AppleTVButton} label={button_text} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

const FeatureBlock2 = observer(() => {
  const {header, subheader, tagline, button_text} = mainStore.l10n.media_wallet.feature_2;

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
          <div className="main-page-header__copy">
            <Button to="/wallet#/wallet/users/me" className="main-page-header__button">
              {button_text}
            </Button>
          </div>
        </div>
        <ImageIcon icon={FeatureImage2} label="Example content" className="main-page-header__image"/>
      </div>
    </div>
  );
});

const FeatureCarousel = observer(() => {
  const images = [CarouselImage1, CarouselImage2, CarouselImage3, CarouselImage4];

  return (
    <Swiper
      className="media-wallet-feature-carousel"
      spaceBetween={0}
      slidesPerView={3.5}
    >
      {images.map((image, index) =>
        <SwiperSlide key={`image-${index}`} className="media-wallet-feature-carousel__slide">
          <ImageIcon icon={image} />
        </SwiperSlide>
      )}
    </Swiper>
  );
});


const TextBoxesBlock = observer(() => {
  const icons = [BlockchainIcon, PlayCircleIcon, WalletIcon];

  return (
    <div className="main-page-block__text-boxes">
      {(mainStore.l10n.media_wallet.text_boxes || []).map((item, index) => (
        <div key={item} className="main-page-block__text-box main-page-block__text-box--translucent">
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
      <FeatureCarousel />
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
