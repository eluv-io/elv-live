import React from "react";

import {GridCarousel, RichText} from "../../components/Misc";
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
        <h1 className="center-align">{ mainStore.l10n.partners.title }</h1>
      </div>
      <div className="page__content-block">
        <RichText richText={mainStore.l10n.partners.text} className="page__copy" />
      </div>

      <div className="page__content-block">
        <h3 className="page__content-block__header center-align">
          { mainStore.l10n.partners.providers_validators }
        </h3>
        <GridCarousel classNameGrid="centered partners__list--grid" classNameCarousel="partners__list--carousel">
          {
            partners.map(({name, logo, link, info, is_provider, is_validator}, index) =>
              <PartnerIcon
                name={name}
                logo={logo?.url}
                link={link}
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
        <h3 className="page__content-block__header center-align">
          { mainStore.l10n.partners.ecosystem }
        </h3>
        <div className="grid partners__ecosystem">
          { ecosystem.map(({name, logo, link}, index) =>
            link ?
              <a href={link} target="_blank" rel="noreferrer">
                <ImageIcon title={name} icon={logo?.url} className="partners__ecosystem-icon" key={`ecosystem-${index}`} />
              </a> :
              <ImageIcon title={name} icon={logo?.url} className="partners__ecosystem-icon" key={`ecosystem-${index}`} />
          )}
        </div>
      </div>
    </div>
  );
});

export default Partners;
