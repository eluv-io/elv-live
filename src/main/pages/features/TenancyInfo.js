import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {CheckmarkIcon} from "../../static/icons/Icons";

const tenanciesMap = {
  "PAY_AS_YOU_GO": "Pay As You Go",
  "ADVANCED": "Advanced",
  "ENTERPRISE": "Enterprise"
};

const featuresMap = {
  "ALL_MEDIA_PLATFORM": "All Media Platform Features",
  "ALL_CONTENT_DISTRIBUTION": "All Content Distribution Features",
  "ALL_WEB3": "All Web3 Features"
};

const TenancyInfo = ({
  level,
  tenancy,
  service,
  features=[],
  addedBenefitPercentage="",
  addedBenefitText="",
  monthlyPrice,
  additionalCostText
}) => {
  return (
    <div className="tenancy-info">
      <div className="tenancy-info__level">{ level }</div>
      <h4 className="tenancy-info__tenancy">{ tenanciesMap[tenancy] }</h4>
      <div className="tenancy-info__service">{ service }</div>
      <hr />

      <div className="tenancy-info__features">
        <div className="tenancy-info__features__content">
          <div className="tenancy-info__features__content__header">
            <h4 className="tenancy-info__features__content__header__percentage">{ addedBenefitPercentage }</h4>
            <div className="tenancy-info__features__content__header__details">{ addedBenefitText }</div>
          </div>

          <ul className="tenancy-info__features__content__list">
            {
              features.map(feature => (
                <li key={`features-list-item-${feature}`} className="tenancy-info__features__content__list__item">
                  <span className="tenancy-info__features__content__list__item__text">{ featuresMap[feature] }</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <hr />

      <div className="tenancy-info__pricing">
        <h1 className="tenancy-info__pricing__amount">${ monthlyPrice || "" }</h1>
        <div className={`tenancy-info__pricing__rate tenancy-info__pricing__rate--${additionalCostText.length < 15 ? "column" : "row"}`}>
          <span className="tenancy-info__pricing__rate__month">per month</span>
          <span className="tenancy-info__pricing__rate__fees">{ additionalCostText }</span>
        </div>
      </div>
    </div>
  );
};

export default TenancyInfo;
