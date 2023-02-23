import React from "react";
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
import {Action} from "../../components/Actions";
import ImageIcon from "../../components/ImageIcon";

const FeatureCards = [
  {
    image: Feature1,
    text: "Live Events & Drops"
  },
  {
    image: Feature2,
    text: "Marketplace",
  },
  {
    image: Feature3,
    text: "Payment Gateway",
  },
  {
    image: Feature4,
    text: "Content Investing",
  },
  {
    image: Feature5,
    text: "Dynamic Traits",
  },
  {
    image: Feature6,
    text: "Market Making Curation & Matching",
  },
  {
    image: Feature7,
    text: "Customization",
  },
  {
    image: Feature8,
    text: "Data",
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

const KeyFeatures = ({mobile}) => {
  return (
    <div className="main-page-block main-page-block--key-features">
      <div className="main-page-block__key-features__header-container">
        <h4 className="main-page-block__key-features__header">
          Key Features
        </h4>
        <Action to="/features/details" className="dark highlight small main-page-block__key-features__header-link">
          Learn More
        </Action>
      </div>
      <KeyFeaturesCards mobile={mobile} />
    </div>
  );
};

export default KeyFeatures;
