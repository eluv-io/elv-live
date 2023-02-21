import "swiper/swiper-bundle.min.css";

import React, {useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {Action} from "../../components/Actions";

const SiteCard = observer(({name, mobile, hero, hero_mobile, siteUrl}) => {
  return (
    <Action href={siteUrl} className="site-carousel__site">
      <ImageIcon
        icon={(mobile && hero_mobile) || hero}
        label={name}
        className="site-carousel__site-image"
      />
    </Action>
  );
});

const SiteCarousel = observer(({mobile}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  if(!mainStore.featuredSites) { return null; }

  return (
    <Swiper
      className="site-carousel"
      spaceBetween={mobile ? 0 : 25}
      slidesPerView={mobile ? 2 : 1.5}
      centeredSlides
      loop
      pagination={{
        enabled: true,
        clickable: true
      }}
      modules={[Pagination]}
      onSlideChange={swiper => setActiveSlide(swiper.realIndex)}
    >
      {mainStore.featuredSites.map((site, index) =>
        <SwiperSlide className={`site-carousel__slide ${activeSlide === index ? "site-carousel__slide--active" : ""}`}>
          <SiteCard {...site} mobile={mobile} key={`site-${site.slug}`} />
        </SwiperSlide>
      )}
    </Swiper>
  );
});

export default SiteCarousel;
