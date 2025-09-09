import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination, Navigation} from "swiper";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {Action} from "../../components/Actions";
import {runInAction, toJS} from "mobx";
import {Video} from "../../components/Misc";
import {EluvioPlayerParameters} from "@eluvio/elv-player-js/lib/index";

const SiteCard = observer(({mediaProperty, active, index}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(!active || loaded) { return; }

    setLoaded(true);
  }, [active, index]);

  const video = mediaProperty.video;

  return (
    <Action href={mediaProperty.url} target="_blank" className="site-carousel__site">
      <div className="site-carousel__placeholder" />
      {
        !loaded ? null :
          (video && (Object.keys(video || {}).length > 0)) ?
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
                  capLevelToPlayerSize: EluvioPlayerParameters.capLevelToPlayerSize.ON,
                  showLoader: EluvioPlayerParameters.showLoader.OFF
                }}
              />
            </div>:
            <ImageIcon
              loading="lazy"
              icon={mediaProperty.image}
              label={mediaProperty.title || mediaProperty.name}
              className="site-carousel__site-image"
            />
      }
    </Action>
  );
});

// Lazy load all but 5 items around current
const IsActive = ({index, activeIndex, length}) => {
  return (
    activeIndex === index ||
    activeIndex === index - 1 ||
    activeIndex === index - 2 ||
    activeIndex === index - 3 ||
    activeIndex === index - 4 ||
    activeIndex === index - 5 ||
    activeIndex === index - 6 ||
    activeIndex === (index + 1) % length ||
    activeIndex === (index + 2) % length ||
    activeIndex === (index + 3) % length ||
    activeIndex === (index + 4) % length ||
    activeIndex === (index + 5) % length ||
    index <= 1 && activeIndex >= length - 3
  );
};

const SiteCarousel = observer(({mobile}) => {
  useEffect(() => {
    runInAction(() => mainStore.LoadFeaturedProperties());
  }, []);

  const [activeSlide, setActiveSlide] = useState(0);

  if(!mainStore.featuredProperties) { return null; }

  return (
    <Swiper
      className="site-carousel"
      spaceBetween={0}
      slidesPerView={mobile ? 2 : 8.5}
      centeredSlides
      loop
      initialSlide={4}
      navigation={!mobile}
      pagination={{
        enabled: false
      }}
      style={{
        "--swiper-pagination-color": "#fff",
        "--swiper-navigation-color": "#fff",
      }}
      modules={mobile ? [] : [Navigation]}
      onSwiper={swiper => window.swiper = swiper}
      onSlideChange={swiper => setActiveSlide(swiper.realIndex)}
    >
      {mainStore.featuredProperties.map((mediaProperty, index) =>
        <SwiperSlide key={`site-${mediaProperty.propertyId}`} className={"site-carousel__slide"}>
          <SiteCard
            mediaProperty={mediaProperty}
            index={index}
            active={IsActive({index, activeIndex: activeSlide, length: mainStore.featuredProperties.length})}
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
});

export default SiteCarousel;
