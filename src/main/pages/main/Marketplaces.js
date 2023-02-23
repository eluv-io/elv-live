import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {mainStore, uiStore} from "../../stores/Main";
import {Action, Button} from "../../components/Actions";
import {DiscoverIcon} from "../../static/icons/Icons";
import UrlJoin from "url-join";
import ImageIcon from "../../components/ImageIcon";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";

import BackgroundImage from "../../static/images/main/Creators-&-Content-Businesses.jpg";
import {runInAction} from "mobx";

const MarketplaceGrid = observer(({mobile}) => {
  const marketplaces = mainStore.marketplaces.slice(0, 4);

  if(mobile) {
    return (
      <Swiper
        className="marketplace__carousel"
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
        {marketplaces.map(({name, card_front, tenantSlug, marketplaceSlug}) =>
          <SwiperSlide key={`marketplace-${tenantSlug}-${marketplaceSlug}`} className="marketplace__slide">
            <Action
              to={UrlJoin("/wallet", "#", "marketplaces", "redirect", tenantSlug, marketplaceSlug)}
              className="marketplace__card"
            >
              <ImageIcon
                icon={card_front}
                label={name}
                className="marketplace__card-image"
              />
            </Action>
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  return (
    <div className="marketplace__grid">
      {marketplaces.map(({name, card_front, tenantSlug, marketplaceSlug}) =>
        <Action
          key={`marketplace-${tenantSlug}-${marketplaceSlug}`}
          to={UrlJoin("/wallet", "#", "marketplaces", "redirect", tenantSlug, marketplaceSlug)}
          className="marketplace__card"
        >
          <ImageIcon
            icon={card_front}
            label={name}
            className="marketplace__card-image"
          />
        </Action>
      )}
    </div>
  );
});

const Marketplaces = observer(({mobile}) => {
  useEffect(() => {
    runInAction(() => mainStore.LoadMarketplaces());
  }, []);

  if(!mainStore.marketplaces) { return null; }

  return (
    <div className="marketplace">
      { mobile ? null : <ImageIcon icon={BackgroundImage} className="marketplace__background" /> }
      <MarketplaceGrid mobile={mobile} />
      <div className="marketplace__info">
        <h3 className="marketplace_text">
          { mainStore.l10n.creators.marketplaces.header }
        </h3>
        {
          mobile ? null :
            <div className="marketplace__actions">
              <Button
                includeArrow
                icon={DiscoverIcon}
                to="/wallet"
                className="dark secondary marketplace__action"
              >
                { mainStore.l10n.actions.browse_all_projects }
              </Button>
            </div>
        }
      </div>
    </div>
  );
});

export default Marketplaces;
