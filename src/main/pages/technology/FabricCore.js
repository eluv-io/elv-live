import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {Accordion, AccordionGroup, InfoBox, RichText, Video} from "../../components/Misc";
import {DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import AppSuiteControlPanel from "../apps/AppSuiteControlPanel";
import * as fabricCoreImages from "../../static/images/technology/fabric-core";
import AppImageGallery from "../apps/AppImageGallery";

const SectionContent = ({
  sectionId,
  subSections,
  blocks
}) => {
  if(subSections) {
    return (
      subSections.map((subSection, i) => (
        subSection.items ?
          subSection.items.map(item => (
            <Accordion title={item.title} defaultOpen key={`fabric-core-accordion-item-${item.title}`} id={item.id}>
              <RichText className="accordion__description-card" richText={item.description}/>
            </Accordion>
          )) :
          <div key={`sub-section-${i}`}>
            <div style={{fontSize: "20px", fontWeight: 700, color: "var(--color-highlight-3)", margin: "18px 0"}}>{subSection.title}</div>
            <SectionContent
              sectionId={sectionId}
              blocks={subSection.blocks}
            />
          </div>
      ))
    );
  } else if(blocks) {
    return (
      blocks.map((block, i) => (
        block.items ?
          (
            block.items.map((blockItem, i) => (
              <Accordion key={`block-item-accordion-${i}`} title={blockItem.title} className="accordion--block">
                <RichText key={`block-${i}`} className="accordion__description-card" richText={blockItem.description} />
              </Accordion>
            ))
          ) :
          (
            <div key={`block-wrapper-${i}`}>
              <RichText key={`block-${i}`} className={`accordion__description-card ${block.pre_line ? "accordion__description-card--pre-line" : ""}`} richText={block.description} />
            </div>
          )
      ))
    );
  }
};

const FabricCore = observer(() => {
  const copy = mainStore.l10n.core_apps.pages.fabric_core;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{copy.header_title}</h1>
        <h3>{copy.header_subtitle}</h3>
      </div>
      <Video versionHash={copy.header_video} className="main-page-block__video main-page-block__core-video" />
      <div className="page__content-block">
        <div className="page__content-block">
          <h3 className="page__content-block__header light">{copy.summary_section.title}</h3>
          <RichText richText={copy.summary_section.description} className="page__copy fade-in--slow"/>
        </div>
      </div>

      <div className="page__content-block">
        {
          copy.upper_accordion_sections.map(section => (
            <div key={`fabric-core-accordion-section-${section.title}`} className="page__content-block">
              <AccordionGroup header={section.header}>
                <SectionContent
                  sectionId={section.id}
                  subSections={section.sub_sections}
                  blocks={section.blocks}
                />
                {/*{*/}
                {/*  section.sub_sections ?*/}
                {/*    (*/}
                {/*      section.sub_sections.map((subSection, i) => (*/}
                {/*        subSection.items ?*/}
                {/*          subSection.items.map(item => (*/}
                {/*            <Accordion title={item.title} defaultOpen key={`fabric-core-accordion-item-${item.title}`} id={item.id}>*/}
                {/*              <RichText className="accordion__description-card" richText={item.description}/>*/}
                {/*            </Accordion>*/}
                {/*          )) :*/}
                {/*          <Accordion key={`sub-section-${i}`} title={subSection.header} hasHeader={false} defaultOpen id={section.id}>*/}
                {/*            {*/}
                {/*              (section.blocks || []).map((block, i) => (*/}
                {/*                <RichText key={`block-${i}`} className="accordion__description-card" richText={section.description} />*/}
                {/*              ))*/}
                {/*            }*/}
                {/*          </Accordion>*/}
                {/*      ))*/}
                {/*    ) : section.blocks ?*/}
                {/*    (*/}
                {/*      section.blocks.map((block, i) => (*/}
                {/*        <RichText key={`block-${i}`} className="accordion__description-card" richText={section.description} />*/}
                {/*      ))*/}
                {/*    ) : null*/}
                {/*}*/}
              </AccordionGroup>
            </div>
          ))
        }
      </div>
      <AppSuiteControlPanel />
      {
        copy.accordion_sections.map(section => (
          <div className="page__content-block" key={`fabric-core-section-${section.header}`}>
            <AccordionGroup
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} defaultOpen key={`fabric-core-accordion-item-${item.title}`} id={item.id}>
                      <RichText className="accordion__description-card" richText={item.description}/>
                    </Accordion>
                  )) :
                  <Accordion title={section.header} hasHeader={false} defaultOpen id={section.id}>
                    <RichText className="accordion__description-card" richText={section.description}/>
                  </Accordion>
              }
            </AccordionGroup>
          </div>
        ))
      }
      <AppImageGallery
        items={
          Object.keys(fabricCoreImages || {})
            .sort((a, b) => {
              const numA = parseInt(a.replace("FabricCore", ""), 10);
              const numB = parseInt(b.replace("FabricCore", ""), 10);

              return numA - numB;
            })
            .map(key => fabricCoreImages[key])
        }
      />
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.FabricBrowserIcon}
          header={mainStore.l10n.content_fabric.bangkok.header}
          content={mainStore.l10n.content_fabric.bangkok.text}
          links={[
            {
              to: mainStore.l10n.content_fabric.bangkok.links[0].link,
              target: "_blank",
              text: mainStore.l10n.content_fabric.bangkok.links[0].text,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
    </div>
  );
});

export default FabricCore;

