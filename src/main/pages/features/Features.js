import React, {useEffect} from "react";
import {Accordion} from "../../components/Misc";
import {Action} from "../../components/Actions";
import ImageIcon from "../../components/ImageIcon";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";

import {NodeGroupIcon, PlayCircleIcon, Web3Icon} from "../../static/icons/Icons";
import SupportGrid from "./SupportGrid";

const ItemCard = (data, dark=false) => {
  const {contentTitle, description, link} = data;

  return (
    <div className={`features-details__item-card ${dark ? "dark" : "light"}`} key={`item-card-${contentTitle}`}>
      <div className="features-details__item-card__content">
        <span>{ contentTitle }</span>
        <p>{ description }</p>
        <Action to={link}>View Doc</Action>
      </div>
    </div>
  );
};

const ApplicationSection = observer(() => {
  return (
    <div className="features__section">
      <div className="tenancies-comparison features__info-box curved-box info-box light">
        <div className="tenancies-comparison__table-container">
          <div className="info-box__content center">
            <div className="info-box__text">
              <h3 className="features__section-header">Blockchain Content Applications</h3>
            </div>
          </div>

          {
            mainStore.l10n.features.tenancies.comparison_table.map(({header, items}) => (
              <Accordion key={`accordion-${header}`} title={header} className="features__accordion">
                <SupportGrid items={items} />
              </Accordion>
            ))
          }
        </div>
      </div>
    </div>
  );
});

const DetailSection = observer(() => {
  const data = mainStore.l10n.features.details;
  const iconMap = {
    "playIcon": PlayCircleIcon,
    "blockchainIcon": Web3Icon,
    "nodeGroupIcon": NodeGroupIcon
  };

  return (
    data.map(({header, sectionHeader, id, items, icon}) => (
      <div className="features__section" key={`features-section-${id}`} id={id}>
        {
          sectionHeader &&
          <div className="features__section-header">{ sectionHeader }</div>
        }
        <div className="features__info-box curved-box info-box light">
          <div className="info-box__content">
            <div className="info-box__icon-container">
              <ImageIcon icon={iconMap[icon]} className="info-box__icon" title="Media Application Platform" />
            </div>
            <div className="info-box__text">
              <h3 className="info-box__header">{ header }</h3>
            </div>
          </div>
          {
            (items || []).map(itemData => (
              <Accordion key={`accordion-${itemData.title}`} title={itemData.title} className="features__accordion">
                {
                  (itemData.items || []).map(itemData => ItemCard(itemData))
                }
              </Accordion>
            ))
          }
        </div>
      </div>
    ))
  );
});

const Features = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if(hash) {
      const element = document.getElementById(hash.substring(1));
      setTimeout(() => {
        if(element) {
          element.scrollIntoView({behavior: "auto"});
        }
      }, 10);
    }
  }, []);

  return (
    <div className="page">
      <div className="page__header-container">
        <h1 className="features--purple-header">Platform Features</h1>
      </div>
      <div className="page__content-block">
        <ApplicationSection />
        <DetailSection />
      </div>
    </div>
  );
};

export default Features;
