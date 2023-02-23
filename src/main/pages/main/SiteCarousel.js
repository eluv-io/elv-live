import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {Action} from "../../components/Actions";
import {runInAction} from "mobx";

const SiteCard = ({name, mobile, hero, hero_mobile, siteUrl}) => {
  return (
    <Action href={siteUrl} className="site-carousel__site">
      <div className="site-carousel__placeholder" />
      <ImageIcon
        icon={(mobile && hero_mobile) || hero}
        label={name}
        className="site-carousel__site-image"
      />
    </Action>
  );
};

const SiteCarousel = observer(({mobile}) => {
  useEffect(() => {
    runInAction(() => mainStore.LoadFeaturedSites());
  }, []);

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
        <SwiperSlide key={`site-${site.slug}`} className={`site-carousel__slide ${activeSlide === index ? "site-carousel__slide--active" : ""}`}>
          <SiteCard {...site} mobile={mobile} />
        </SwiperSlide>
      )}
    </Swiper>
  );
});

export default SiteCarousel;
