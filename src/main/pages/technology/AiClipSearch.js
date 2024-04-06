import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import ImageIcon from "../../components/ImageIcon";
import {ApplicationIcons, DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import {Accordion, AccordionGroup, InfoBox, RichText} from "../../components/Misc";
import AppSuiteControlPanel from "./AppSuiteControlPanel";

const AiClipSearch = observer(() => {
  const copy = mainStore.l10n.casablanca.pages.ai_clip_search;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{mainStore.l10n.casablanca.title}</h1>
        <h3>{mainStore.l10n.casablanca.header}</h3>
      </div>
      <div className="page__content-block">
        <div className="application-info__header">
          <div className="application-info__header-title">{copy.header}</div>
          <div className="application-info__title-group">
            <ImageIcon icon={ApplicationIcons.AiClipSearchIcon} className="application-info__icon"/>
            <div className="application-info__header-text light">{copy.title}</div>
            <ImageIcon icon={ApplicationIcons.V2TagIcon} className="application-info__tag-icon"/>
          </div>
          <RichText richText={copy.short_description} className="application-info__short-description page__copy fade-in--slow"/>
          <RichText richText={copy.full_description} className="application-info__full-description page__copy fade-in--slow"/>
        </div>
      </div>
      <AppSuiteControlPanel />
      {
        copy.accordion_sections.map(section => (
          <div className="page__content-block" key={`clip-search-section-${section.header}`}>
            <AccordionGroup
              key={`clip-search-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} key={`clip-search-accordion-item-${item.title}`}>
                      <RichText className="accordion__description-card" richText={item.description}/>
                    </Accordion>
                  )) :
                  <Accordion title={section.header} hasHeader={false}>
                    <RichText className="accordion__description-card" richText={section.description}/>
                  </Accordion>
              }
            </AccordionGroup>
          </div>
        ))
      }
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.FabricBrowserIcon}
          header={copy.info_link.title}
          content={copy.info_link.description}
          links={[
            {
              // href: ,
              text: copy.info_link.links[0].text,
              icon: DocumentIcon,
              target: "_blank"
            },
            {
              to: copy.info_link.links[1].to,
              text: copy.info_link.links[1].text,
              icon: DocumentIcon,
              target: "_blank"
            }
          ]}
        />
      </div>
    </div>
  );
});

export default AiClipSearch;

