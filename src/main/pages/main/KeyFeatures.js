import React from "react";
import {Action} from "../../components/Actions";
import ImageIcon from "../../components/ImageIcon";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";

import Feature1 from "../../static/images/main/features/1_Live-Events-_-Drops-Card-Face.png";
import Feature2 from "../../static/images/main/features/2_Marketplace-Card-Face.png";
import Feature3 from "../../static/images/main/features/3_Payment Gateway Card Face.png";
import Feature4 from "../../static/images/main/features/4_Content-Investing-Card-Face.png";
import Feature5 from "../../static/images/main/features/5_Dynamic-Traits-Card-Face.png";
import Feature6 from "../../static/images/main/features/6_Market-Making-Curation-_-Matching-Card-Facing.png";
import Feature7 from "../../static/images/main/features/7_Customization-Card-Face.png";
import Feature8 from "../../static/images/main/features/8_Data-Card-Face.png";

const FeatureCards = [
  {
    image: Feature1,
    text: "Live Events & Drops\nLorem ipsum dolor sit amet consectetur.",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature2,
    text: "Marketplace",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature3,
    text: "Payment Gateway",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature4,
    text: "Content Investing",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature5,
    text: "Dynamic Traits",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature6,
    text: "Market Making Curation & Matching",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature7,
    text: "Customization",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  },
  {
    image: Feature8,
    text: "Data",
    description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
  }
];

const KeyFeaturesCards = ({mobile}) => {
  if(!mobile) {
    return (
      <div className="main-page-block__key-features__list">
        { FeatureCards.map(({image, text}) =>
          <button key={`key-feature-${text}`} className="main-page-block__key-feature">
            <ImageIcon icon={image} label={text} className="main-page-block__key-feature__image" />
          </button>
        )}
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
      { FeatureCards.map(({image, text}) =>
        <SwiperSlide key={`key-feature-${text}`} className="main-page-block__key-features__slide">
          <button className="main-page-block__key-feature">
            <ImageIcon icon={image} label={text} className="main-page-block__key-feature__image" />
          </button>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

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
