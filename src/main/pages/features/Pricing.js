import React from "react";
import UtilityRatesData from "../../content/FeaturesUtilityRates.yaml";
import ImageIcon from "../../components/ImageIcon";
import {SupportIcon} from "../../static/icons/Icons";
import {Accordion} from "../../components/Misc";
import FeaturesGrid from "./FeaturesGrid";
import {FormatCurrency} from "../../utils/Utils";

const Pricing = () => {
  const {committedUtilityLevel, blockchainTransactions, baseRentalOperations, platformServiceFee, bitcodeOperations} = UtilityRatesData;
  const iconMap = {
    supportIcon: SupportIcon
  };

  const SectionWrapper = ({children, header, icon}) => {
    return (
      <div className="features__section">
        <div className="features__info-box curved-box info-box light">
          <div className="info-box__content">
            <div className="info-box__icon-container">
              <ImageIcon icon={icon} className="info-box__icon" title="Media Application Platform" />
            </div>
            <div className="info-box__text">
              <h3 className="info-box__header">{ header }</h3>
            </div>
          </div>
          { children }
        </div>
      </div>
    );
  };

  const CommittedUtilityLevel = ({header, icon, items=[]}) => {
    return (
      <SectionWrapper header={header} icon={icon}>
        {
          items.map((itemData, index) => (
            <Accordion key={`accordion-${itemData.title}`} title={itemData.title} className="features__accordion">
              <FeaturesGrid
                headerRows={[
                  {
                    id: `committed-utility-header-${itemData.title}-1`,
                    className: "features-grid__main-header",
                    cells: [
                      {label: ""},
                      {label: ""},
                      {label: "Monthly"},
                      {label: "Annual"}
                    ]
                  },
                  {
                    id: `committed-utility-header-${itemData.title}-2`,
                    className: "features-grid__helper-header",
                    cells: [
                      {label: committedUtilityLevel.unitLabel},
                      {label: ""},
                      {label: committedUtilityLevel.basePriceLabel}
                    ]
                  }
                ]}
                bodyRows={[
                  {
                    id: `committed-utility-body-${index}`,
                    cells: [
                      {label: itemData.unit},
                      {label: ""},
                      {label: FormatCurrency({number: itemData.priceMonthly})},
                      {label: FormatCurrency({number: itemData.priceAnnual})},
                    ]
                  }
                ]}
              />
            </Accordion>
          ))
        }
      </SectionWrapper>
    );
  };

  const BlockchainTransactions = ({header, icon, items=[]}) => {
    return (
      <SectionWrapper header={header} icon={icon}>
        {
          items.map((itemData, index) => (
            <Accordion
              key={`accordion-${itemData.title}`}
              title={itemData.title}
              description={itemData.description}
              className="features__accordion"
            >
              <FeaturesGrid
                headerRows={[
                  {
                    id: `blockchain-transactions-header-${itemData.title}-1`,
                    className: "features-grid__top-header",
                    cells: [
                      {label: ""},
                      {label: "Level 1"},
                      {label: "Level 2"},
                      {label: "Level 3"}
                    ]
                  },
                  {
                    id: `blockchain-transactions-header-${itemData.title}-2`,
                    className: "features-grid__main-header",
                    cells: [
                      {label: ""},
                      {label: "Pay As You Go"},
                      {label: "Advanced"},
                      {label: "Enterprise"}
                    ]
                  },
                  {
                    id: `blockchain-transactions-header-${itemData.title}-3`,
                    className: "features-grid__helper-header",
                    cells: [
                      {label: committedUtilityLevel.unitLabel},
                      {label: committedUtilityLevel.basePriceLabel}
                    ]
                  }
                ]}
                bodyRows={[
                  {
                    id: `blockchain-transactions-body-${index}`,
                    cells: [
                      {label: itemData.unit},
                      {label: FormatCurrency({number: itemData.pricePayAsYouGo})},
                      {label: FormatCurrency({number: itemData.priceAdvanced})},
                      {label: FormatCurrency({number: itemData.priceEnterprise})}
                    ]
                  }
                ]}
              />
            </Accordion>
          ))
        }
      </SectionWrapper>
    );
  };

  const BaseRentalOperations = ({header, icon, items=[]}) => {
    return (
      <SectionWrapper header={header} icon={icon}>
        <FeaturesGrid
          caption={baseRentalOperations.caption}
          headerRows={[
            {
              id: "base-rental-header-1",
              className: "features-grid__base-rental",
              cells: [
                {label: ""},
                {label: baseRentalOperations.unitLabel},
                {label: baseRentalOperations.basePriceLabel},
                {label: ""}
              ]
            }
          ]}
          bodyRows={
            items.map(({operation, basePrice, unit, itemDescription}, index) => {
              return {
                id: `base-rental-body-${index}`,
                className:
              "features-grid__base-rental",
                cells:
                [
                  {label: operation},
                  {label: unit},
                  {label: FormatCurrency({number: basePrice})},
                  {label: itemDescription, className: "features-grid__light-text"}
                ]
              };
            })
          }
        />
      </SectionWrapper>
    );
  };

  const PlatformServiceFee = ({header, icon, items=[]}) => {
    return (
      <SectionWrapper header={header} icon={icon}>
        <FeaturesGrid
          caption={platformServiceFee.caption}
          headerRows={[
            {
              id: "platform-service-header-1",
              className: "features-grid__base-rental",
              cells: [
                {label: ""},
                {label: ""},
                {label: platformServiceFee.basePriceLabel},
                {label: ""}
              ]
            }
          ]}
          bodyRows={
            items.map(({label, fee, itemDescription}, index) => {
              return {
                id: `platform-service-body-${index}`,
                className:
                  "features-grid__base-rental",
                cells:
                  [
                    {label: label},
                    {label: ""},
                    {label: fee},
                    {label: itemDescription, className: "features-grid__light-text"}
                  ]
              };
            })
          }
        />
      </SectionWrapper>
    );
  };

  const BitcodeOperations = ({header, icon, items=[], itemsFourCol=[]}) => {
    return (
      <SectionWrapper header={header} icon={icon}>
        {
          items.map(itemData => (
            <Accordion key={`accordion-${itemData.title}`} title={itemData.title} className="features__accordion">
              {
                itemData.sections.map((section, sectionIndex) => (
                  <div key={`bitcode-operations-section-${itemData.title}-${sectionIndex}`}>
                    <div className="features-grid__section-description">{ section.title }</div>
                    <FeaturesGrid
                      headerRows={[
                        {
                          id: `bitcode-playout-header-${sectionIndex}`,
                          className: "features-grid__bitcode-operations",
                          cells: [
                            {label: bitcodeOperations.unitLabel},
                            {label: bitcodeOperations.basePriceLabel}
                          ]
                        }
                      ]}
                      bodyRows={
                        section.items.map(({unit, basePrice, itemDescription}, index) => {
                          return {
                            id: `bitcode-operations-section-${sectionIndex}-body-${index}`,
                            className: "features-grid__bitcode-operations",
                            cells: [
                              {label: unit},
                              {label: FormatCurrency({number: basePrice})},
                              {label: itemDescription, className: "features-grid__light-text"}
                            ]
                          };
                        })
                      }
                    />
                  </div>
                ))
              }
            </Accordion>
          ))
        }
        {
          itemsFourCol.map((itemData, accordionIndex) => (
            <Accordion key={`accordion-${itemData.title}`} title={itemData.title} className="features__accordion" description={itemData.description}>
              <FeaturesGrid
                headerRows={[
                  {
                    id: `bitcode-playout-header-${itemData.title}-${accordionIndex}`,
                    className: "features-grid__base-rental features-grid__helper-header",
                    cells: [
                      {label: ""},
                      {label: bitcodeOperations.unitLabel},
                      {label: bitcodeOperations.basePriceLabel},
                      {label: ""}
                    ]
                  }
                ]}
                bodyRows={
                  itemData.items.map(({detail, unit, basePrice, itemDescription}, index) => (
                    {
                      id: `bitcode-operations-4col-section-${accordionIndex}-${index}`,
                      className: "features-grid__base-rental",
                      cells: [
                        {label: detail},
                        {label: unit},
                        {label: FormatCurrency({number: basePrice})},
                        {label: itemDescription, className: "features-grid__light-text"}
                      ]
                    }
                  ))
                }
              />
            </Accordion>
          ))
        }
      </SectionWrapper>
    );
  };

  return (
    <div className="page">
      <div className="page__header-container">
        <h1 className="features--purple-header">Content Fabric Utility Rates</h1>
      </div>
      <div className="page__content-block">
        { CommittedUtilityLevel({
          header: committedUtilityLevel.header,
          icon: iconMap[committedUtilityLevel.icon],
          items: committedUtilityLevel.items
        }) }
        { BlockchainTransactions({
          header: blockchainTransactions.header,
          icon: iconMap[blockchainTransactions.icon],
          items: blockchainTransactions.items
        })}
        { BaseRentalOperations({
          header: baseRentalOperations.header,
          icon: iconMap[baseRentalOperations.icon],
          items: baseRentalOperations.items
        })}
        { BitcodeOperations({
          header: bitcodeOperations.header,
          icon: iconMap[bitcodeOperations.icon],
          items: bitcodeOperations.items,
          itemsFourCol: bitcodeOperations.itemsFourCol
        })}
        { PlatformServiceFee({
          header: platformServiceFee.header,
          icon: iconMap[platformServiceFee.icon],
          items: platformServiceFee.items
        })}
      </div>
    </div>
  );
};

export default Pricing;
