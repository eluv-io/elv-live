import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";

import {
  ClockIcon,
  FlagIcon,
  MailIcon,
  MinimizeIcon,
  SocialIcons,
  SpreadMapIcon,
  SupportIcon,
  TelephoneIcon
} from "../../static/icons/Icons";
import SupportGrid from "./SupportGrid";

export const CustomerServiceSection = observer(({smallFont=false}) => {
  const supportData = mainStore.l10n.features_support;
  const iconsMap = {
    clockIcon: ClockIcon,
    mailIcon: MailIcon,
    telephoneIcon: TelephoneIcon,
    slackIcon: SocialIcons.SlackIcon,
    flagIcon: FlagIcon,
    minimizeIcon: MinimizeIcon,
    mapIcon: SpreadMapIcon
  };

  return (
    <div className={`features-support__customer-service ${smallFont ? "features-support__customer-service--small-font" : ""}`}>
      {
        ["standardCustomerService", "priorityCustomerService"].map(service => (
          <div key={`customer-service-${service}`} className="features-support__customer-service-section">
            <h4>{ supportData[service].header }</h4>
            {
              supportData[service].items.map(({icon, label}) => (
                <div className="features-support__customer-service-detail" key={`features-support-customer-service-${label}`}>
                  <ImageIcon icon={iconsMap[icon]} title={label} />
                  &nbsp;{ label }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
});

export const FeaturesSupport = observer(() => {
  const supportData = mainStore.l10n.features_support;

  return (
    <div className="page">
      <div className="page__header-container">
        <h1 className="features--purple-header">Support</h1>
      </div>
      <div className="page__content-block">
        <div className="features__section">
          <div className="features__info-box curved-box info-box light">
            <div className="info-box__content">
              <div className="info-box__icon-container">
                <ImageIcon icon={SupportIcon} className="info-box__icon" title="Media Application Platform" />
              </div>
              <div className="info-box__text">
                <h3 className="info-box__header">{ supportData.header }</h3>
                <p>{ supportData.description }</p>
              </div>
            </div>

            <SupportGrid items={supportData.gridItems} />
            <CustomerServiceSection />
          </div>
        </div>
      </div>
    </div>
  );
});
