import React from "react";
import {Action, Button} from "../../components/Actions";
import TenancyInfo from "./TenancyInfo";
import ImageIcon from "../../components/ImageIcon";
import FeaturesDetails from "../../content/FeaturesBanner.yaml";
import TechnologyIcons from "../../static/icons/technology/TechnologyIcons";
import {PlayCircleIcon} from "../../static/icons/Icons";
import {TabbedInfoBox} from "../../components/Misc";

const Features = () => {
  const icons = {
    blockchainExplorer: TechnologyIcons.BlockchainExplorerIcon,
    nodeValidatorProviders: TechnologyIcons.NodeValidatorProvidersIcon,
    playCircle: PlayCircleIcon
  };

  const BannerBox = ({title, icon, paragraph, link}) => {
    return (
      <div className="features-banner__list__item-details">
        <ImageIcon
          className="features-banner__list__item-details__main-icon"
          icon={icons[icon]}
          label={title}
          title={title}
        />
        <h5 className="features-banner__list__item-details__title">{ title }</h5>
        <p className="features-banner__list__item-details__paragraph">{ paragraph }</p>
        <Action to={link} includeArrow={true} className="features-banner__list__item-details__learn-button">
          <div className="features-banner__list__item-details__learn-button__text">Learn More</div>
        </Action>
      </div>
    );
  };

  const TenanciesList = ({monthly=false}) => {
    return (
      <div className="tenancies-list">
        <TenancyInfo
          tenancy="PAY_AS_YOU_GO"
          level="Level 1"
          service="Self Service"
          features={["ALL_MEDIA_PLATFORM", "ALL_CONTENT_DISTRIBUTION", "ALL_WEB3"]}
          monthlyPrice="0"
          additionalCostText="+ utility fees"
        />
        <TenancyInfo
          tenancy="ADVANCED"
          level="Level 2"
          service="Tier 1 Support"
          features={["ALL_MEDIA_PLATFORM", "ALL_CONTENT_DISTRIBUTION", "ALL_WEB3"]}
          monthlyPrice={monthly ? "995" : "833"}
          additionalCostText={monthly ? "+ utility fees" : "+ utility fees in annual commit"}
          addedBenefitPercentage="50+%"
          addedBenefitText="On selected Content Fabric utility rates"
        />
        <TenancyInfo
          tenancy="ENTERPRISE"
          level="Level 3"
          service=" Full Valet Service"
          features={["ALL_MEDIA_PLATFORM", "ALL_CONTENT_DISTRIBUTION", "ALL_WEB3"]}
          monthlyPrice={monthly ? "9,995" : "8,333"}
          additionalCostText={monthly ? "+ utility fees" : "+ utility fees in annual commit"}
          addedBenefitPercentage="90+%"
          addedBenefitText="On selected Content Fabric utility rates"
        />
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page__header-container">
        <h1>Eluvio Tenancies: Your Secure, Private Web3 Space</h1>
        <h3>What works best for your brand?</h3>
      </div>
      <div className="page__content-block">
        <TabbedInfoBox
          noBackgroundStyling={true}
          tabs={[
            {
              title: "Monthly",
              content: TenanciesList({monthly: true})
            },
            {
              title: "Annually",
              content: TenanciesList({monthly: false})
            }
          ]}
        />

        <div className="features-connect">
          <Button className="light primary features-connect__button">Connect with us</Button>
        </div>

        <div className="features-banner">
          <div className="features-banner__list">
            {
              FeaturesDetails.map(({title, icon, paragraph, link}) => (
                <BannerBox
                  title={title}
                  icon={icon}
                  paragraph={paragraph}
                  link={link}
                />
              ))
            }
          </div>
        </div>
        <div className="features-faqs">
          <h1>FAQs</h1>
        </div>
      </div>
    </div>
  );
};

export default Features;
