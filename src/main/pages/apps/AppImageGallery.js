import React, {useEffect, useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import ImageIcon from "../../components/ImageIcon";
import LeftArrowIcon from "../../static/icons/arrow-left";
import RightArrowIcon from "../../static/icons/arrow-right";

const GalleryNavigation = ({swiperRef, activeSlide, slideCount}) => {
  return (
    <div className="application-info__image-gallery-navigation">
      <button
        type="button"
        className="application-info__nav-button"
        onClick={() => swiperRef.current.slidePrev()}
      >
        <ImageIcon icon={LeftArrowIcon}/>
      </button>
      <div className="application-info__image-gallery-navigation__text">{activeSlide} of {slideCount}</div>
      <button
        type="button"
        className="application-info__nav-button"
        onClick={() => swiperRef.current.slideNext()}
      >
        <ImageIcon icon={RightArrowIcon}/>
      </button>
    </div>
  );
};

export const AppImageGallery = ({items}) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const swiperRef = useRef(null);

  return (
    <div className="page__content-block">
      <div className="curved-box light application-info__image-gallery">
        <GalleryNavigation activeSlide={activeSlide} slideCount={items.length} swiperRef={swiperRef} />
        <Swiper
          onSlideChange={swiper => {
            setActiveSlide(swiper.realIndex + 1);
          }}
          onSwiper={swiper => swiperRef.current = swiper}
          spaceBetween={20}
          slidesPerView={1}
          loop
        >
          { items.map((featureCard, index) =>
            <SwiperSlide key={`key-feature-${index}`} className="main-page-block__key-features__slide">
              <img
                className="key-feature-card__banner"
                src={featureCard}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default AppImageGallery;
