import React from "react";
import {Accordion} from "../../components/Misc";
import {Action} from "../../components/Actions";
import {PlayCircleIcon} from "../../static/icons/Icons";
import ImageIcon from "../../components/ImageIcon";
import FeatureDetails from "../../content/FeaturesDetails.yaml";

const Details = () => {
  const detailsData = FeatureDetails || {};

  const ItemCard = (data) => {
    const {contentTitle, description, link} = data;

    return (
      <div className="features-details__item-card" key={`item-card-${contentTitle}`}>
        <div className="features-details__item-card__content">
          <span>{ contentTitle }</span>
          <p>{ description }</p>
          <Action to={link}>View Doc</Action>
        </div>
      </div>
    );
  };

  const detailSection = (
    detailsData.map(({header, items}) => (
      <div className="features-details__section">
        <div className="features-details__info-box curved-box info-box light">
        <div className="info-box__content">
          <div className="info-box__icon-container">
            <ImageIcon icon={PlayCircleIcon} className="info-box__icon" title="Media Application Platform" />
          </div>
          <div className="info-box__text">
            <h3 className="info-box__header">{ header }</h3>
          </div>
        </div>
        {
          (items || []).map(itemData => (
            <Accordion key={`accordion-${itemData.title}`} title={itemData.title} className="features-details__accordion">
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

  return (
    <div className="page">
      <div className="page__header-container">
        <h1 className="features-details__header">Features</h1>
      </div>
      <div className="page__content-block">
        { detailSection }
      </div>
    </div>
  );
};

export default Details;
