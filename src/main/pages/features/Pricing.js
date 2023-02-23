import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {Accordion} from "../../components/Misc";
import FeaturesGrid from "./FeaturesGrid";
import {FormatCurrency} from "../../utils/Utils";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";

import {SupportIcon} from "../../static/icons/Icons";

const Pricing = observer(() => {
  const {
    committedUtilityLevel,
    blockchainTransactions,
    baseRentalOperations,
    platformServiceFee,
    bitcodeOperations
  } = mainStore.l10n.features.pricing;

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

  const CommittedUtilityLevel = () => {
    const {header, items, rowClassName, unitLabel, basePriceLabel} = committedUtilityLevel;
    const icon = iconMap[committedUtilityLevel.icon];

    return (
      <SectionWrapper header={header} icon={icon}>
        {
          items.map((itemData, index) => (
            <Accordion key={`accordion-${itemData.title}`} title={itemData.title} className="features__accordion">
              <FeaturesGrid
                headerRows={[
                  {
                    id: `committed-utility-header-${itemData.title}-1`,
                    className: `${rowClassName} features-grid__main-header`,
                    cells: [
                      {label: ""},
                      {label: "Monthly"},
                      {label: "Annual"}
                    ]
                  },
                  {
                    id: `committed-utility-header-${itemData.title}-2`,
                    className: `${rowClassName} features-grid__helper-header`,
                    cells: [
                      {label: unitLabel},
                      {label: basePriceLabel},
                      {label: ""}
                    ]
                  }
                ]}
                bodyRows={[
                  {
                    id: `committed-utility-body-${index}`,
                    className: rowClassName,
                    cells: [
                      {label: itemData.unit},
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

  const BlockchainTransactions = () => {
    const {header, items, rowClassName, unitLabel, basePriceLabel} = blockchainTransactions;
    const icon = iconMap[blockchainTransactions.icon];

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
                    className: `${rowClassName} features-grid__top-header`,
                    cells: [
                      {label: ""},
                      {label: "Level 1"},
                      {label: "Level 2"},
                      {label: "Level 3"}
                    ]
                  },
                  {
                    id: `blockchain-transactions-header-${itemData.title}-2`,
                    className: `${rowClassName} features-grid__main-header`,
                    cells: [
                      {label: ""},
                      {label: "Pay As You Go"},
                      {label: "Advanced"},
                      {label: "Enterprise"}
                    ]
                  },
                  {
                    id: `blockchain-transactions-header-${itemData.title}-3`,
                    className: `${rowClassName} features-grid__helper-header`,
                    cells: [
                      {label: unitLabel},
                      {label: basePriceLabel}
                    ]
                  }
                ]}
                bodyRows={[
                  {
                    id: `blockchain-transactions-body-${index}`,
                    className: rowClassName,
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

  const BaseRentalOperations = () => {
    const {header, items, unitLabel, basePriceLabel, rowClassName, caption} = baseRentalOperations;
    const icon = iconMap[baseRentalOperations.icon];

    return (
      <SectionWrapper header={header} icon={icon}>
        <FeaturesGrid
          caption={caption}
          headerRows={[
            {
              id: "base-rental-header-1",
              className: rowClassName,
              cells: [
                {label: ""},
                {label: unitLabel},
                {label: basePriceLabel},
                {label: ""}
              ]
            }
          ]}
          bodyRows={
            items.map(({operation, basePrice, unit, itemDescription}, index) => {
              return {
                id: `base-rental-body-${index}`,
                className:
              rowClassName,
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

  const PlatformServiceFee = () => {
    const {header, items, basePriceLabel, rowClassName, caption} = platformServiceFee;
    const icon = iconMap[platformServiceFee.icon];

    return (
      <SectionWrapper header={header} icon={icon}>
        <FeaturesGrid
          caption={caption}
          headerRows={[
            {
              id: "platform-service-header-1",
              className: rowClassName,
              cells: [
                {label: ""},
                {label: basePriceLabel},
                {label: ""}
              ]
            }
          ]}
          bodyRows={
            items.map(({label, fee, itemDescription}, index) => {
              return {
                id: `platform-service-body-${index}`,
                className:
                  rowClassName,
                cells:
                  [
                    {label: label},
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

  const BitcodeOperations = () => {
    const {header, items, itemsFourCol, rowClassName, unitLabel, basePriceLabel} = bitcodeOperations;
    const icon = iconMap[bitcodeOperations.icon];

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
                          className: rowClassName,
                          cells: [
                            {label: unitLabel},
                            {label: basePriceLabel}
                          ]
                        }
                      ]}
                      bodyRows={
                        section.items.map(({unit, basePrice, itemDescription}, index) => {
                          return {
                            id: `bitcode-operations-section-${sectionIndex}-body-${index}`,
                            className: rowClassName,
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
                    className: `${itemData.rowClassName} features-grid__helper-header`,
                    cells: [
                      {label: ""},
                      {label: unitLabel},
                      {label: basePriceLabel},
                      {label: ""}
                    ]
                  }
                ]}
                bodyRows={
                  itemData.items.map(({detail, unit, basePrice, itemDescription}, index) => (
                    {
                      id: `bitcode-operations-4col-section-${accordionIndex}-${index}`,
                      className: itemData.rowClassName,
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
        <h1 className="features--purple-header">Pricing</h1>
      </div>
      <div className="page__content-block">
        { CommittedUtilityLevel() }
        { BlockchainTransactions()}
        { BaseRentalOperations()}
        { BitcodeOperations()}
        { PlatformServiceFee()}
      </div>
    </div>
  );
});

export default Pricing;
