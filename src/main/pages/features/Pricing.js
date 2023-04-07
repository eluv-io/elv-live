import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {Accordion} from "../../components/Misc";
import FeaturesGrid from "./FeaturesGrid";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {SupportIcon} from "../../static/icons/Icons";

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

const BlockchainTransactions = observer(() => {
  const {header, items, rowClassName, icon, headerItems} = mainStore.l10n.features.pricing.blockchainTransactions;

  return (
    <SectionWrapper header={header} icon={iconMap[icon]}>
      <FeaturesGrid
        headerRows={[
          {
            id: "blockchain-transactions-header-top",
            className: rowClassName,
            cells: headerItems.map(headerItem => ({label: headerItem}))
          }
        ]}
        bodyRows={[
          {
            id: "blockchain-transactions-body-top",
            className: rowClassName,
            cells: [
              {label: "NFT Contract Creation"},
              {label: "per NFT contract (one per Edition)"},
              {label: "$10.00"},
              {label: "On Demand or Live Video ingest to h264 mezzanines @ 1080p. Broad support for source encodings, e.g. h264, hevc, mpeg2, dnxhd, prores", className: "features-grid__light-text"}
            ]
          }
        ]}
      />
      {
        items.map((itemData, index) => (
          <Accordion
            key={`accordion-${itemData.title}`}
            title={itemData.title}
            subtitle={itemData.subtitle}
            description={itemData.description}
            triggerText="VIEW DETAILS"
            className="features__accordion features__blockchain-accordion"
          >
            <FeaturesGrid
              headerRows={[
                {
                  id: `blockchain-transactions-header-${itemData.title}-${index}`,
                  className: `${rowClassName} features-grid__helper-header`,
                  cells: headerItems.map(headerItem => ({label: headerItem}))
                }
              ]}
              bodyRows={
                itemData.items.map(rowItem => (
                  {
                    id: `blockchain-transactions-body-${itemData.title}-${rowItem.detail}`,
                    className: rowClassName,
                    cells: [
                      {label: rowItem.detail},
                      {label: rowItem.unit},
                      {label: rowItem.basePrice},
                      {label: rowItem.description}
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
});

const BaseRentalOperations = observer(() => {
  const {header, items, unitLabel, basePriceLabel, rowClassName, caption, icon} = mainStore.l10n.features.pricing.baseRentalOperations;

  return (
    <SectionWrapper header={header} icon={iconMap[icon]}>
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
                {label: basePrice},
                {label: itemDescription, className: "features-grid__light-text"}
              ]
            };
          })
        }
      />
    </SectionWrapper>
  );
});

const PlatformServiceFee = observer(() => {
  const {header, items, headerItems, rowClassName, icon} = mainStore.l10n.features.pricing.platformServiceFee;

  return (
    <SectionWrapper header={header} icon={iconMap[icon]}>
      <FeaturesGrid
        headerRows={[
          {
            id: "platform-service-header-1",
            className: rowClassName,
            cells: headerItems.map(headerItem => ({
              label: headerItem
            }))
          }
        ]}
        bodyRows={
          items.map(({label, fee, minimum, itemDescription}, index) => {
            return {
              id: `platform-service-body-${index}`,
              className:
                rowClassName,
              cells:
                [
                  {label: label},
                  {label: fee},
                  {label: minimum},
                  {label: itemDescription, className: "features-grid__light-text"}
                ]
            };
          })
        }
      />
    </SectionWrapper>
  );
});

const ContentDistributionGrid = observer(({section, sectionIndex, rowClassName, itemData}) => {
  if(section.subSections && section.subSections.length > 0) {
    return (
      section.subSections.map(subSection => (
        <div className="features__sub-section" key={`sub-section-${subSection.title}`}>
          {
            subSection.title &&
            <div className="features__sub-section-title">{subSection.title}</div>
          }
          <FeaturesGrid
            className="features-grid--indented"
            headerRows={[
              {
                id: `content-distribution-${subSection.title}-${sectionIndex}`,
                className: rowClassName,
                cells: (subSection.headerItems || itemData.headerItems).map(headerItem => (
                  {label: headerItem}
                ))
              }
            ]}
            bodyRows={
              subSection.items.map(({detail, perSec, perHour, multiplier, itemDescription}, index) => {
                return {
                  id: `content-distribution-${sectionIndex} -${index}`,
                  key: `content-distribution-${sectionIndex}-${index}`,
                  className: rowClassName,
                  cells: [
                    {label: detail},
                    {label: perSec},
                    {label: perHour},
                    {label: multiplier},
                    {label: itemDescription, className: "features-grid__light-text"}
                  ]
                };
              })
            }
          />
        </div>
      ))
    );
  } else {
    return (
      <FeaturesGrid
        headerRows={[
          {
            id: `content-distribution-${section.title}-${sectionIndex}`,
            className: section.rowClassName || rowClassName,
            cells: (section.headerItems || itemData.headerItems).map(headerItem => (
              {label: headerItem}
            ))
          }
        ]}
        bodyRows={
          section.items.map(({detail, unit, perSec, perHour, multiplier, itemDescription}, index) => {
            return {
              id: `content-distribution-${sectionIndex} -${index}`,
              key: `content-distribution-${sectionIndex}-${index}`,
              className: section.rowClassName || rowClassName,
              cells: [
                {label: detail},
                {label: unit},
                {label: perSec},
                {label: perHour},
                {label: multiplier},
                {label: itemDescription, className: "features-grid__light-text"}
              ]
            };
          })
        }
      />
    );
  }
});

const ContentDistribution = observer(() => {
  const {header, items, rowClassName, icon} = mainStore.l10n.features.pricing.contentDistribution;

  return (
    <SectionWrapper header={header} icon={iconMap[icon]}>
      {
        items.map(itemData => (
          <Accordion title={itemData.title} className="features__accordion" key={`accordion-${itemData.title}`}>
            {
              itemData.sections.map((section, sectionIndex) => (
                <div key={`accordion-${itemData.title}-${section.title}`}>
                  <div className="features__section-title">{ section.title }</div>
                  <div className="features__section-description">{section.description}</div>

                  <ContentDistributionGrid
                    section={section}
                    sectionIndex={sectionIndex}
                    rowClassName={itemData.rowClassName || rowClassName}
                    itemData={itemData}
                  />
                </div>
              ))
            }
          </Accordion>
        ))
      }
    </SectionWrapper>
  );
});

const AdvancedContentServices = observer(() => {
  const {header, items, rowClassName, icon, headerItems} = mainStore.l10n.features.pricing.advancedContentServices;

  return (
    <SectionWrapper header={header} icon={iconMap[icon]}>
      {
        items.map(itemData => (
          <Accordion title={itemData.title} description={itemData.description} className="features__accordion" key={`accordion-${itemData.title}`}>
            {
              itemData.sections.map((section, sectionIndex) => (
                <div key={`section-${sectionIndex}`}>
                  <div className="features__section-title">{ section.title }</div>
                  <FeaturesGrid
                    headerRows={[
                      {
                        id: `content-distribution-${section.title || ""}-${sectionIndex}`,
                        className: section.rowClassName || rowClassName,
                        cells: (headerItems).map(headerItem => (
                          {label: headerItem}
                        ))
                      }
                    ]}
                    bodyRows={
                      section.items.map(({detail, unit, perSec, perHour, multiplier, itemDescription}, index) => {
                        return {
                          id: `content-distribution-${sectionIndex} -${index}`,
                          key: `content-distribution-${sectionIndex}-${index}`,
                          className: section.rowClassName || rowClassName,
                          cells: [
                            {label: detail},
                            {label: unit},
                            {label: perSec},
                            {label: perHour},
                            {label: multiplier},
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
    </SectionWrapper>
  );
});

const Pricing = () => {
  return (
    <div className="page">
      <div className="page__header-container">
        <h1 className="features--purple-header">Pricing</h1>
      </div>
      <div className="page__content-block">
        <BaseRentalOperations />
        <ContentDistribution />
        <AdvancedContentServices />
        <BlockchainTransactions />
        <PlatformServiceFee />
      </div>
    </div>
  );
};

export default Pricing;
