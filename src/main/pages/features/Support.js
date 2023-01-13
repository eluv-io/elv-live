import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {
  CheckSquareIcon,
  ClockIcon,
  FlagIcon,
  MailIcon, MinimizeIcon,
  SocialIcons, SpreadMapIcon,
  SupportIcon,
  TelephoneIcon
} from "../../static/icons/Icons";
import SupportData from "../../content/FeaturesSupport.yaml";

const FeaturesSupport = () => {
  const ItemCard = (data, key) => {
    const iconMap = {
      aroundClock: {
        label: "24x7",
        icon: ClockIcon
      },
      email: {
        label: "Email",
        icon: MailIcon
      },
      telephone: {
        label: "Telephone",
        icon: TelephoneIcon
      },
      slack: {
        label: "Slack",
        icon: SocialIcons.SlackIcon
      }
    };

    const {label, payAsYouGo, enterprise, advanced, icons} = data;

    return (
      <div className="features-support__item-card" key={key}>
        <div className="features-support__item-card-content">
          <span>
            { label }
            <div className="features-support__item-card-communication">
              {
                Object.keys(icons || {}).map(iconKey => (
                  icons[iconKey] &&
                  <span key={`${key}-icon-${iconKey}`} className="features-support__item-card-communication__item">
                    <ImageIcon icon={iconMap[iconKey].icon}/>
                    <span className="features-support__icon-text">&nbsp;{iconMap[iconKey].label}</span>
                  </span>
                ))
              }
            </div>
          </span>
          <span className="centered">{ payAsYouGo ? <ImageIcon icon={CheckSquareIcon} /> : "" }</span>
          <span className="centered">{ advanced ? <ImageIcon icon={CheckSquareIcon} /> : "" }</span>
          <span className="centered">{ enterprise ? <ImageIcon icon={CheckSquareIcon} /> : "" }</span>
        </div>
      </div>
    );
  };

  const CustomerServiceSection = () => {
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
      <div className="features-support__customer-service">
        {
          ["standardCustomerService", "priorityCustomerService"].map(service => (
            <div key={`customer-service-${service}`} className="features-support__customer-service-section">
              <h4>{ SupportData[service].header }</h4>
              {
                SupportData[service].items.map(({icon, label}) => (
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
  };

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
                <h3 className="info-box__header">{ SupportData.header }</h3>
                <p>{ SupportData.description }</p>
              </div>
            </div>

            <div className="features-support__grid-container">
              <div className="features-support__header-row">
                <span></span>
                <span className="features-support__header-text">
                  <span className="features-support__header-text__subheader">Level 1</span>
                  <h5>Pay As You Go</h5>
                </span>
                <span className="features-support__header-text">
                  <span className="features-support__header-text__subheader">Level 2</span>
                  <h5>Advanced</h5>
                </span>
                <span className="features-support__header-text">
                  <span className="features-support__header-text__subheader">Level 3</span>
                  <h5>Enterprise</h5>
                </span>
              </div>
              {
                SupportData.gridItems.map((item, index) => (
                  ItemCard(item, `item-card-${item.label}-${index}`)
                ))
              }
            </div>

            { CustomerServiceSection() }
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSupport;
