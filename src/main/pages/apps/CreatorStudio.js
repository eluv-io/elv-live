import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {Accordion, AccordionGroup, InfoBox, RichText} from "../../components/Misc";
import ImageIcon from "../../components/ImageIcon";
import {ApplicationIcons, DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import AppSuiteControlPanel from "./AppSuiteControlPanel";

import * as creatorStudioImages from "../../static/images/apps/creator-studio";
import AppImageGallery from "./AppImageGallery";

const CreatorStudio = observer(() => {
  const copy = mainStore.l10n.core_apps.pages.creator_studio;

  return (
    <div className="page light">
      <div className="page__content-block">
        <div className="application-info__header">
          <div className="application-info__header-title-group">
            <div className="application-info__header-title">{copy.header}</div>
            <div className="application-info__title-group">
              <ImageIcon icon={ApplicationIcons.CreatorStudioIcon} className="application-info__icon"/>
              <div className="application-info__header-text light">{copy.title}</div>
            </div>
            <RichText richText={copy.short_description} className="application-info__short-description page__copy fade-in--slow"/>
          </div>
          <RichText richText={copy.full_description} className="application-info__full-description page__copy fade-in--slow"/>
        </div>
      </div>
      <AppSuiteControlPanel />
      {
        copy.accordion_sections.map(section => (
          <div className="page__content-block" key={`creator-studio-section-${section.header}`}>
            <AccordionGroup
              key={`creator-studio-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} key={`creator-studio-accordion-item-${item.title}`} defaultOpen>
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
      <AppImageGallery
        items={
          Object.keys(creatorStudioImages || {})
            .sort((a, b) => {
              const numA = parseInt(a.replace("CreatorStudio", ""), 10);
              const numB = parseInt(b.replace("CreatorStudio", ""), 10);

              return numA - numB;
            })
            .map(key => creatorStudioImages[key])
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

export default CreatorStudio;

