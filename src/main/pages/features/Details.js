import React from "react";
import {Accordion} from "../../components/Misc";
import {Action} from "../../components/Actions";
import {PlayCircleIcon} from "../../static/icons/Icons";
import ImageIcon from "../../components/ImageIcon";

const Details = () => {
  const AccordionItemCard = () => {
    return (
      <div className="features-details__item-card">
        <div className="features-details__item-card__content">
          <span>By reference and by copy</span>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
          </p>
          <Action to="/">View Doc</Action>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page__header-container">
        <h1 className="features-details__header">Features</h1>
      </div>
      <div className="page__content-block">
        <div className="features-details__info-box curved-box info-box light">
          <div className="info-box__content">
            <div className="info-box__icon-container">
              <ImageIcon icon={PlayCircleIcon} className="info-box__icon" title="Media Application Platform" />
            </div>
            <div className="info-box__text">
              <h3 className="info-box__header">Media Application Platform</h3>
            </div>
          </div>
          <Accordion title="Direct Ingest from File System & Cloud Storage" className="features-details__accordion">
            { AccordionItemCard() }
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Details;
