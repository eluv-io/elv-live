import React from "react";
import {Action, Button} from "../../components/Actions";
import TenancyInfo from "./TenancyInfo";
import ImageIcon from "../../components/ImageIcon";
import {TabbedInfoBox} from "../../components/Misc";
import {PageContainer} from "../../MainApp";
import FAQs from "./FAQs";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";

import {
  PlayCircleIcon,
} from "../../static/icons/Icons";
import TechnologyIcons from "../../static/icons/technology/TechnologyIcons";
import SupportGrid from "./SupportGrid";
import {CustomerServiceSection} from "./Support";
import {toJS} from "mobx";

const BannerBox = ({title, icon, paragraph, link}) => {
  const icons = {
    blockchainExplorer: TechnologyIcons.BlockchainExplorerIcon,
    nodeValidatorProviders: TechnologyIcons.NodeValidatorProvidersIcon,
    playCircle: PlayCircleIcon
  };

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

const TableSection = observer(() => {
  console.log("items", toJS(mainStore.l10n.features.tenancies.comparison_table))
  return (
    <div className="tenancies-comparison curved-box info-box light">
      <div className="tenancies-comparison__table-container">
        <div className="tenancies-comparison__header">Feature Comparison at a Glance</div>
        <SupportGrid sections={mainStore.l10n.features.tenancies.comparison_table} compactRows={"xs"} />
      </div>

      <div className="tenancies-comparison__table-container">
        <div className="tenancies-comparison__header">Customer Service and Support</div>
        <SupportGrid items={mainStore.l10n.features_support.gridItems} compactRows={"sm"} />
        <CustomerServiceSection smallFont={true} />
      </div>
    </div>
  );
});

const TenanciesList = ({monthly=false}) => {
  return (
    <div className="tenancies-list">
      {mainStore.l10n.features.tenancies.levels.map(({header, sub_header, monthly_price, annual_price, added_benefit_text, added_benefit_percentage, features}) => (
        <TenancyInfo
          key={header}
          header={header}
          subHeader={sub_header}
          monthlyPrice={monthly ? monthly_price : annual_price}
          additionalCostText="+ utility fees"
          addedBenefitPercentage={added_benefit_percentage}
          addedBenefitText={added_benefit_text}
          features={features}
        />
      ))}
    </div>
  );
};

const fullWidthElements = (
  <>
    <div className="features-banner">
      <div className="features-banner__list">
        {
          mainStore.l10n.features_banner.map(({title, icon, paragraph, link}) => (
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

const TenancyLevels = observer(() => {
  return (
    <PageContainer after={fullWidthElements} padded>
      <div className="page">
        <div className="page__header-container">
          <h1 className="features-details-header">Eluvio Tenancies: Your Secure, Private Web3 Space</h1>
          <h3>What works best for your creative brand?</h3>
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
            <Button className="light primary features-connect__button" to="/about/contact">Connect with us</Button>
          </div>
          <TableSection />
        </div>
      </div>
    </PageContainer>
  );
});

export default TenancyLevels;
