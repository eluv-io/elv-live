import React from "react";

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
      <h4>{ tenanciesMap[tenancy] }</h4>
      <div className="tenancy-info__service">{ service }</div>
      <hr />

      <div className="tenancy-info__features">
        <div className="tenancy-info__content">
          <div className="tenancy-info__content__header">
            <h4>{ addedBenefitPercentage }</h4>
            <div className="tenancy-info__content__header-details">{ addedBenefitText }</div>
          </div>

          <ul>
            {
              features.map(feature => (
                <li key={`features-list-item-${feature}`} className="tenancy-info__list-item">
                  <span>{ featuresMap[feature] }</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <hr />

      <div className="tenancy-info__pricing">
        <h1>${ monthlyPrice || "" }</h1>
        <div className={`tenancy-info__pricing-rate tenancy-info__pricing-rate--${additionalCostText.length < 15 ? "column" : "row"}`}>
          <span>per month</span>
          <span>{ additionalCostText }</span>
        </div>
      </div>
    </div>
  );
};

export default TenancyInfo;
