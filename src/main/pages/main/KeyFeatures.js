import React, {useState} from "react";
import {Action} from "../../components/Actions";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";

import {
  PlayCircleIcon,
  DiscoverIcon,
  DollarIcon,
  SmileIcon,
  AppIcon,
  PulseIcon,
  BarsIcon
} from "../../static/icons/Icons";

import FeatureCardFront from "../../static/images/main/features/key-features-front.png";
import FeatureCardBack from "../../static/images/main/features/key-features-back.png";
import ImageIcon from "../../components/ImageIcon";

let icons = {
  play: PlayCircleIcon,
  discover: DiscoverIcon,
  money: DollarIcon,
  app: AppIcon,
  smile: SmileIcon,
  pulse: PulseIcon,
  bars: BarsIcon
};

const KeyFeatureCard = observer(({mobile, feature, flipped, setFlipped}) => {
  return (
    <button
      className={`key-feature-card ${flipped ? "key-feature-card--flipped" : ""}`}
      onClick={event => {
        if(mobile || flipped) { return; }

        event.preventDefault();
        event.stopPropagation();

        setFlipped(true);
      }}
    >
      <div className="key-feature-card__wrapper">
        <div className="key-feature-card__banner-container key-feature-card__banner-container--front">
          <img
            alt={feature.front}
            className="key-feature-card__banner"
            src={FeatureCardFront}
          />
          <div className="key-feature-card__content key-feature-card__content--front">
            <ImageIcon icon={icons[feature.icon]} className="key-feature-card__icon" />
            <div className="key-feature-card__title">{ feature.front }</div>
            <div className="key-feature-card__learn-more">{ mainStore.l10n.creators.key_features.learn_more }</div>
          </div>
        </div>
        <div className="key-feature-card__banner-container key-feature-card__banner-container--back">
          <img
            alt={feature.back}
            className="key-feature-card__banner"
            src={FeatureCardBack}
          />
          <div className="key-feature-card__content key-feature-card__content--back">
            <div className="key-feature-card__text">{ feature.back }</div>
          </div>
        </div>
      </div>
    </button>
  );
});

const KeyFeaturesCards = observer(({mobile}) => {
  const [flippedIndex, setFlippedIndex] = useState(-1);

  const featureCards = (
    mainStore.l10n.creators.key_features.cards.map((feature, index) =>
      <KeyFeatureCard
        key={`feature-${index}`}
        feature={feature}
        flipped={index === flippedIndex}
        setFlipped={flip => setFlippedIndex(flip ? index : -1)}
        mobile={mobile}
      />
    )
  );

  if(!mobile) {
    return (
      <div className="main-page-block__key-features__list">
        { featureCards }
      </div>
    );
  }

  return (
    <Swiper
      className="main-page-block__key-features__carousel"
      spaceBetween={20}
      slidesPerView={1.5}
      centeredSlides
      loop
      pagination={{
        enabled: true,
        clickable: true
      }}
      modules={[Pagination]}
    >
      { featureCards.map((featureCard, index) =>
        <SwiperSlide key={`key-feature-${index}`} className="main-page-block__key-features__slide">
          { featureCard }
        </SwiperSlide>
      )}
    </Swiper>
  );
});

const KeyFeatures = observer(({mobile}) => {
  return (
    <div className="main-page-block main-page-block--key-features">
      <div className="main-page-block__key-features__header-container">
        <h4 className="main-page-block__key-features__header">
          { mainStore.l10n.creators.key_features.header }
        </h4>
        <Action to="/features/details" className="dark highlight small main-page-block__key-features__header-link">
          { mainStore.l10n.actions.learn_more }
        </Action>
      </div>
      <KeyFeaturesCards mobile={mobile} />
    </div>
  );
});

export default KeyFeatures;
