import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import {Action, Button} from "../../components/Actions";
import {DiscoverIcon} from "../../static/icons/Icons";
import ImageIcon from "../../components/ImageIcon";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";

import BackgroundImage from "../../static/images/main/release-singles-albums.jpg";
import {EluvioPlayerParameters} from "@eluvio/elv-player-js/lib";
import {Video} from "../../components/Misc";

const PropertyCard = observer(({mediaProperty}) =>
  <Action
    href={mediaProperty.url}
    target="_blank"
    rel="nofollow"
    className="property__card"
  >
    <ImageIcon
      icon={mediaProperty.image}
      label={mediaProperty.title || mediaProperty.name}
      className="property__card-image"
    />
    {
      !mediaProperty.video ? null :
        <Video
          videoMetadata={mediaProperty.video}
          className="property__card-video"
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
    }
  </Action>
);

const PropertyGrid = observer(({mobile}) => {
  const properties = mainStore.featuredProperties.slice(0, 4);

  if(mobile) {
    return (
      <Swiper
        className="property__carousel"
        slidesPerView={1}
        spaceBetween={30}
        loop
        centeredSlides
        pagination={{
          enabled: true,
          clickable: true
        }}
        style={{maxWidth: uiStore.pageWidth}}
        modules={[Pagination]}
      >
        {properties.map(mediaProperty =>
          <SwiperSlide key={`property-${mediaProperty.propertyId}`} className="property__slide">
            <PropertyCard mediaProperty={mediaProperty} />
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  return (
    <div className="property__grid">
      {properties.map(mediaProperty =>
        <PropertyCard key={`property-${mediaProperty.propertyId}`} mediaProperty={mediaProperty} />
      )}
    </div>
  );
});

const Properties = observer(({mobile}) => {
  useEffect(() => {
    mainStore.LoadFeaturedProperties();
  }, []);

  if(!mainStore.featuredProperties) { return null; }

  return (
    <div className="property">
      { mobile ? null : <ImageIcon icon={BackgroundImage} className="property__background" /> }
      <PropertyGrid mobile={mobile} />
      <div className="property__info">
        <h3 className="property_text">
          { mainStore.l10n.creators.properties.header }
        </h3>
        {
          mobile ? null :
            <div className="property__actions">
              <Button
                includeArrow
                icon={DiscoverIcon}
                href={mainStore.walletAppUrl}
                target="_blank"
                className="dark secondary property__action"
              >
                { mainStore.l10n.actions.browse_all_projects }
              </Button>
            </div>
        }
      </div>
    </div>
  );
});

export default Properties;
