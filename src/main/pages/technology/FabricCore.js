import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {Accordion, AccordionGroup, InfoBox, RichText, Video} from "../../components/Misc";
import {DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import AppSuiteControlPanel from "../apps/AppSuiteControlPanel";
import * as fabricCoreImages from "../../static/images/technology/fabric-core";
import AppImageGallery from "../apps/AppImageGallery";

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
        {
          copy.sections.map(item => (
            <div key={`fabric-core-section-${item.title}`} className="page__content-block">
              <h3 className="page__content-block__header light">{item.title}</h3>
              <RichText richText={item.description} className="page__copy fade-in--slow"/>
            </div>
          ))
        }
      </div>
      <AppSuiteControlPanel />
      {
        copy.accordion_sections.map(section => (
          <div className="page__content-block" key={`fabric-core-section-${section.header}`}>
            <AccordionGroup
              key={`fabric-core-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} defaultOpen key={`fabric-core-accordion-item-${item.title}`}>
                      <RichText className="accordion__description-card" richText={item.description}/>
                    </Accordion>
                  )) :
                  <Accordion title={section.header} hasHeader={false} defaultOpen>
                    <RichText className="accordion__description-card" richText={section.description}/>
                  </Accordion>
              }
            </AccordionGroup>
          </div>
        ))
      }
      <AppImageGallery items={Object.values(fabricCoreImages || {})} />
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

