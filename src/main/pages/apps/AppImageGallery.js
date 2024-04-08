import React from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";

export const AppImageGallery = ({items}) => {
  return (
    <div className="page__content-block">
      <div className="curved-box light application-info__image-gallery">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop
          pagination={{
            enabled: true,
            clickable: true
          }}
          modules={[Pagination]}
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
