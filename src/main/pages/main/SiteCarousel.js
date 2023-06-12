import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {Action} from "../../components/Actions";
import {runInAction} from "mobx";
import {Video} from "../../components/Misc";
import {EluvioPlayerParameters} from "@eluvio/elv-player-js";

const SiteCard = ({name, hero, hero_mobile, hero_video, hero_video_mobile, siteUrl, active, index}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(!active || loaded) { return; }

    setLoaded(true);
  }, [active, index]);

  const video = hero_video_mobile || hero_video;

  return (
    <Action href={siteUrl} className="site-carousel__site">
      <div className="site-carousel__placeholder" />
      {
        !loaded ? null :
          video ?
            <div className="site-carousel__site-image site-carousel__site-video">
              { /* Cover the video element so it doesn't interfere with dragging the carousel */ }
              <div className="site-carousel__site-video-cover" />
              <Video
                videoMetadata={video}
                className="site-carousel__site-image site-carousel__site-video-player"
                playerOptions={{
                  autoplay: EluvioPlayerParameters.autoplay.WHEN_VISIBLE,
                  muted: EluvioPlayerParameters.muted.ON,
                  controls: EluvioPlayerParameters.controls.OFF,
                  loop: EluvioPlayerParameters.loop.ON,
                  watermark: EluvioPlayerParameters.watermark.OFF,
                  capLevelToPlayerSize: EluvioPlayerParameters.capLevelToPlayerSize.ON
                }}
              />
            </div>:
            <ImageIcon
              loading="lazy"
              icon={hero_mobile || hero}
              label={name}
              className="site-carousel__site-image"
            />
      }
    </Action>
  );
};

// Lazy load all but 5 items around current
const IsActive = ({index, activeIndex, length}) => {
  return (
    activeIndex === index ||
    activeIndex === index - 1 ||
    activeIndex === index - 2 ||
    activeIndex === (index + 1) % length ||
    activeIndex === (index + 2) % length ||
    index <= 1 && activeIndex >= length - 2
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
      spaceBetween={0}
      slidesPerView={mobile ? 2 : 3.5}
      centeredSlides
      loop
      pagination={{
        enabled: true,
        clickable: true
      }}
      modules={[Pagination]}
      onSwiper={swiper => window.swiper = swiper}
      onSlideChange={swiper => setActiveSlide(swiper.realIndex)}
    >
      {mainStore.featuredSites.map((site, index) =>
        <SwiperSlide key={`site-${site.slug}`} className={`site-carousel__slide ${activeSlide === index ? "site-carousel__slide--active" : ""}`}>
          <SiteCard
            {...site}
            mobile={mobile}
            active={IsActive({index, activeIndex: activeSlide, length: mainStore.featuredSites.length})}
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
});

export default SiteCarousel;
