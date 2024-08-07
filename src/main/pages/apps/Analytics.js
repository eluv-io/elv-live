import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import ImageIcon from "../../components/ImageIcon";
import {ApplicationIcons, DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import {Accordion, AccordionGroup, InfoBox, RichText} from "../../components/Misc";
import AppSuiteControlPanel from "./AppSuiteControlPanel";
import * as analyticsImages from "../../static/images/apps/analytics";
import AppImageGallery from "./AppImageGallery";

const Analytics = observer(() => {
  const copy = mainStore.l10n.casablanca.pages.analytics;

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
            <ImageIcon icon={ApplicationIcons.ContentAnalyticsIcon} className="application-info__icon"/>
            <div className="application-info__header-text light">{copy.title}</div>
            <ImageIcon icon={ApplicationIcons.NewTagIcon} className="application-info__tag-icon"/>
          </div>
          <RichText richText={copy.short_description} className="application-info__short-description page__copy fade-in--slow"/>
          <RichText richText={copy.full_description} className="application-info__full-description page__copy fade-in--slow"/>
        </div>
      </div>
      <AppSuiteControlPanel />
      {
        copy.accordion_sections.map(section => (
          <div className="page__content-block" key={`analytics-section-${section.header}`}>
            <AccordionGroup
              key={`analytics-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} key={`analytics-accordion-item-${item.title}`} defaultOpen>
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
      <AppImageGallery items={Object.values(analyticsImages || {})} />
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.FabricBrowserIcon}
          header={copy.info_link.title}
          content={copy.info_link.description}
          links={[
            {
              to: copy.info_link.links[0].to,
              text: copy.info_link.links[0].text,
              icon: DocumentIcon,
              target: "_blank"
            },
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

export default Analytics;

