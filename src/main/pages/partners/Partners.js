import React from "react";

import {GridCarousel} from "../../components/Misc";
import PartnerIcon from "./PartnerIcon";
import ImageIcon from "../../components/ImageIcon";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {PageLoader} from "../../components/Loader";

const Partners = observer(() => {
  if(!mainStore.mainSite) { return <PageLoader />; }

  const partners = mainStore.mainSite.partners || [];
  const ecosystem = mainStore.mainSite.ecosystem || [];

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>Our Partners</h1>
      </div>
      <div className="page__content-block">
        <div className="page__copy">
          Eluvio partnerships are built on the principals of bringing outstanding content and experiences to their audience in a fundamentally groundbreaking way. Our content partners bring new and innovative ways of experiencing content through visual, interactive and gamified engagement. Our technology partners are innovating on our platform to deliver the new wave of content supply chain to the market, with levels of security, efficiency and sustainability never before possible. Together we are changing the way the creators and consumers are brought closer together.
        </div>
      </div>

      <div className="page__content-block">
        <h3 className="page__content-block__header">Node Providers & Validators</h3>
        <GridCarousel classNameGrid="centered partners__list--grid" classNameCarousel="partners__list--carousel">
          {
            partners.map(({name, logo, info, is_provider, is_validator}, index) =>
              <PartnerIcon
                name={name}
                logo={logo.url}
                modalContent={info}
                isProvider={is_provider}
                isValidator={is_validator}
                key={`partner-${index}`}
              />
            )
          }
        </GridCarousel>
      </div>

      <div className="page__content-block">
        <h3 className="page__content-block__header">Ecosystem</h3>
        <div className="grid partners__ecosystem">
          { ecosystem.map(({name, logo}, index) =>
            <ImageIcon title={name} icon={logo.url} className="partners__ecosystem-icon" key={`ecosystem-${index}`} />
          )}
        </div>
      </div>
    </div>
  );
});

export default Partners;
