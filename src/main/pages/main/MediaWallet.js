import React from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {Action, Button} from "../../components/Actions";
import {Swiper, SwiperSlide} from "swiper/react";

import {BlockchainIcon, PlayCircleIcon, PlaySimpleIcon, WalletIcon, FullDeviceListIcon} from "../../static/icons/Icons";
import FeatureImage1 from "../../static/images/main/media_wallet/device_mockup_tv.png";
import FeatureImage2 from "../../static/images/main/media_wallet/07_device_mackup_pc_mobile.png";
import BackgroundImage from "../../static/images/main/media_wallet/08_background_image.jpg";
import AppleTVButton from "../../static/images/main/media_wallet/apple_store.png";
import AmazonAppstoreButton from "../../static/images/main/media_wallet/amazon_appstore.png";
import GooglePlayButton from "../../static/images/main/media_wallet/android_store.png";
import XboxButton from "../../static/images/main/media_wallet/xbox.png";

import CarouselImage1 from "../../static/images/main/media_wallet/carousel/01_media_wallet.png";
import CarouselImage2 from "../../static/images/main/media_wallet/carousel/02_media_wallet_sign_in.png";
import CarouselImage3 from "../../static/images/main/media_wallet/carousel/03_my_items.png";
import CarouselImage4 from "../../static/images/main/media_wallet/carousel/04_my_media.png";
import CarouselImage5 from "../../static/images/main/media_wallet/carousel/05_property_page.png";
import CarouselImage6 from "../../static/images/main/media_wallet/carousel/06_LOTR _drill_down.png";

const FeatureBlock1Mobile = observer(() => {
  const {header, subheader, subheader_2, tagline, apple_button_text, google_button_text, amazon_button_text, apple_tv_url, getting_started_url, amazon_appstore_url, google_play_url, feature_image_subheader, xbox_store_url, xbox_button_text} = mainStore.l10n.media_wallet.feature_1;

  return (
    <div className="main-page-header main-page-header__media-wallet">
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
          <a className="main-page-header__get-started-link" href={getting_started_url} target="_blank" rel="noreferrer">
            <ImageIcon className="main-page-header__get-started-icon" icon={PlaySimpleIcon} />
            {subheader_2}
          </a>
          <ImageIcon icon={FeatureImage1} label="Example content" className="main-page-header__image-mobile"/>
          <Action to="compatible-devices" className="main-page-header__device-list">
            <ImageIcon icon={FullDeviceListIcon} />
            {feature_image_subheader}
          </Action>
          <div className="main-page-header__info-links">
          </div>
          <div className="main-page-header__actions">
            <a href={apple_tv_url} target="_blank" className="main-page-header__apple-tv-button" rel="noreferrer">
              <ImageIcon icon={AppleTVButton} label={apple_button_text}/>
            </a>
            <a href={google_play_url} target="_blank" className="main-page-header__google-play-button" rel="noreferrer">
              <ImageIcon icon={GooglePlayButton} label={google_button_text}/>
            </a>
            <a href={amazon_appstore_url} target="_blank" className="main-page-header__amazon-appstore-button" rel="noreferrer">
              <ImageIcon icon={AmazonAppstoreButton} label={amazon_button_text}/>
            </a>
            <a href={xbox_store_url} target="_blank" className="main-page-header__xbox-button" rel="noreferrer">
              <ImageIcon icon={XboxButton} label={xbox_button_text}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

const FeatureBlock1 = observer(() => {
  const {
    header,
    subheader,
    subheader_2,
    tagline,
    apple_button_text,
    google_button_text, amazon_button_text, apple_tv_url, getting_started_url, amazon_appstore_url, google_play_url, feature_image_subheader, xbox_button_text, xbox_store_url} = mainStore.l10n.media_wallet.feature_1;

  return (
    <div className="main-page-header">
      <div className="main-page-header__content">
        <div className="main-page-header__image-container">
          <ImageIcon icon={FeatureImage1} label="Example content" className="main-page-header__top-image"/>
          <Action to="compatible-devices" className="main-page-header__device-list">
            <ImageIcon icon={FullDeviceListIcon} />
            {feature_image_subheader}
          </Action>
        </div>
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
          <div className="main-page-header__info-links">
            <a className="main-page-header__get-started-link" href={getting_started_url} target="_blank" rel="noreferrer">
              <ImageIcon className="main-page-header__get-started-icon" icon={PlaySimpleIcon} />
              {subheader_2}
            </a>
          </div>
          <div className="main-page-header__actions">
            <a href={apple_tv_url} target="_blank" className="main-page-header__apple-tv-button" rel="noreferrer">
              <ImageIcon icon={AppleTVButton} label={apple_button_text} />
            </a>
            <a href={google_play_url} target="_blank" className="main-page-header__google-play-button" rel="noreferrer">
              <ImageIcon icon={GooglePlayButton} label={google_button_text} />
            </a>
            <a href={amazon_appstore_url} target="_blank" className="main-page-header__amazon-appstore-button" rel="noreferrer">
              <ImageIcon icon={AmazonAppstoreButton} label={amazon_button_text} />
            </a>
            <a href={xbox_store_url} target="_blank" className="main-page-header__xbox-button" rel="noreferrer">
              <ImageIcon icon={XboxButton} label={xbox_button_text} />
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
    <div className="main-page-header main-page-header__media-wallet">
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
          <div className="main-page-header__actions">
            <Button href={mainStore.walletAppUrl} target="_blank" className="main-page-header__button">
              {button_text}
            </Button>
          </div>
        </div>
        <ImageIcon icon={FeatureImage2} label="Example content" className="main-page-header__image"/>
      </div>
    </div>
  );
});

const FeatureCarousel = observer(({mobile}) => {
  const images = [CarouselImage1, CarouselImage2, CarouselImage3, CarouselImage4, CarouselImage5, CarouselImage6];

  return (
    <Swiper
      className="media-wallet-feature-carousel"
      spaceBetween={0}
      slidesPerView={mobile ? 1.5 : 3.5}
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


const MediaWallet = observer(() => {
  const mobile = uiStore.pageWidth < 1000;

  return (
    <div className="page dark no-padding page--image-background" style={{backgroundImage: `url('${BackgroundImage}')`}}>
      {
        mobile ?
          <FeatureBlock1Mobile /> :
          <FeatureBlock1 />
      }
      <FeatureCarousel mobile={mobile} />
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
});

export default MediaWallet;
