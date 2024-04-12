import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {Accordion, AccordionGroup, InfoBox, RichText} from "../../components/Misc";
import {DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import AppSuiteControlPanel from "../apps/AppSuiteControlPanel";
import * as fabricCoreImages from "../../static/images/technology/fabric-core";
import AppImageGallery from "../apps/AppImageGallery";

const FabricCore = observer(() => {
  const copy = mainStore.l10n.casablanca.pages.fabric_core;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{mainStore.l10n.casablanca.title}</h1>
        <h3>{mainStore.l10n.casablanca.header}</h3>
      </div>
      <div className="page__content-block">
        {
          copy.sections.map(item => (
            <div key={`fabric-core-section-${item.title}`}>
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
          header={copy.info_link.title}
          content={copy.info_link.description}
          links={[
            {
              to: mainStore.l10n.content_fabric.casablanca.links[0].link,
              target: "_blank",
              text: mainStore.l10n.content_fabric.casablanca.links[0].text,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
    </div>
  );
});

export default FabricCore;

