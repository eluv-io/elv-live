import React from "react";
import {observer} from "mobx-react";

const TenancyInfo = observer(({
  header,
  subHeader,
  features=[],
  addedBenefitPercentage="",
  addedBenefitText="",
  monthlyPrice,
  additionalCostText
}) => {
  return (
    <div className="tenancy-info">
      <div className="tenancy-info__level">{ subHeader }</div>
      <h4>{ header }</h4>
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
                  <div className="tenancy-info__list-item-text">{ feature }</div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <hr />

      <div className="tenancy-info__pricing">
        <div className="tenancy-info__pricing-amount">{ monthlyPrice || "" }</div>
        <div className={`tenancy-info__pricing-rate tenancy-info__pricing-rate--${additionalCostText.length < 35 ? "column" : "row"}`}>
          <span>per month</span>
          <span>{ additionalCostText }</span>
        </div>
      </div>
    </div>
  );
});

export default TenancyInfo;
