import React from "react";
import {Action, Button} from "../../components/Actions";
import TenancyInfo from "./TenancyInfo";
import ImageIcon from "../../components/ImageIcon";
import FeaturesDetails from "../../content/FeaturesBanner.yaml";
import TechnologyIcons from "../../static/icons/technology/TechnologyIcons";
import {PlayCircleIcon} from "../../static/icons/Icons";
import {TabbedInfoBox} from "../../components/Misc";
import {PageContainer} from "../../MainApp";
import {FormatCurrency} from "../../utils/Utils";
import FAQs from "./FAQs";

const TenancyLevels = () => {
  const icons = {
    blockchainExplorer: TechnologyIcons.BlockchainExplorerIcon,
    nodeValidatorProviders: TechnologyIcons.NodeValidatorProvidersIcon,
    playCircle: PlayCircleIcon
  };

  const BannerBox = ({title, icon, paragraph, link}) => {
    return (
      <div className="features-banner__item-details">
        <ImageIcon
          className="features-banner__main-icon"
          icon={icons[icon]}
          label={title}
          title={title}
        />
        <h5>{ title }</h5>
        <p>{ paragraph }</p>
        <Action to={link} includeArrow={true}>
          <div className="features-banner__button-text">Learn More</div>
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
          monthlyPrice={FormatCurrency({number: 0, maximumFractionDigits: 0})}
          additionalCostText="+ utility fees"
        />
        <TenancyInfo
          tenancy="ADVANCED"
          level="Level 2"
          service="Tier 1 Support"
          features={["ALL_MEDIA_PLATFORM", "ALL_CONTENT_DISTRIBUTION", "ALL_WEB3"]}
          monthlyPrice={FormatCurrency({number: monthly ? "995" : "833", maximumFractionDigits: 0})}
          additionalCostText={monthly ? "+ utility fees" : "+ utility fees in annual commit"}
          addedBenefitPercentage="50+%"
          addedBenefitText="On selected Content Fabric utility rates"
        />
        <TenancyInfo
          tenancy="ENTERPRISE"
          level="Level 3"
          service=" Full Valet Service"
          features={["ALL_MEDIA_PLATFORM", "ALL_CONTENT_DISTRIBUTION", "ALL_WEB3"]}
          monthlyPrice={FormatCurrency({number: monthly ? "9995" : "8333", maximumFractionDigits: 0})}
          additionalCostText={monthly ? "+ utility fees" : "+ utility fees in annual commit"}
          addedBenefitPercentage="90+%"
          addedBenefitText="On selected Content Fabric utility rates"
        />
      </div>
    );
  };

  const fullWidthElements = (
    <>
      <div className="features-banner">
        <div className="features-banner__list">
          {
            FeaturesDetails.map(({title, icon, paragraph, link}) => (
              <BannerBox
                key={`features-banner-${title}`}
                title={title}
                icon={icon}
                paragraph={paragraph}
                link={link}
              />
            ))
          }
        </div>
      </div>
      <FAQs />
    </>
  );

  return (
    <PageContainer after={fullWidthElements} padded>
      <div className="page">
        <div className="page__header-container">
          <h1 className="features-details-header">Eluvio Tenancies: Your Secure, Private Web3 Space</h1>
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
        </div>
      </div>
    </PageContainer>
  );
};

export default TenancyLevels;
