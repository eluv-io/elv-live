import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import ImageIcon from "../../components/ImageIcon";
import {ApplicationIcons, DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import {Accordion, AccordionGroup, InfoBox, RichText} from "../../components/Misc";
import AppSuiteControlPanel from "./AppSuiteControlPanel";
import * as analyticsImages from "../../static/images/apps/analytics";
import AppImageGallery from "./AppImageGallery";
import AnalyticsHeader from "../../static/images/main/analytics-section-header.jpg";

const Analytics = observer(() => {
  const copy = mainStore.l10n.core_apps.pages.analytics;

  return (
    <div className="page light">
      <div className="page__content-block">
        <div className="application-info__header">
          <div className="application-info__header-title-group">
            <div className="application-info__header-title">{copy.header}</div>
            <div className="application-info__title-group">
              <ImageIcon icon={ApplicationIcons.ContentAnalyticsIcon} className="application-info__icon"/>
              <div className="application-info__header-text light">{copy.title}</div>
            </div>
            <RichText richText={copy.short_description} className="application-info__short-description page__copy fade-in--slow no-border"/>
          </div>
          <ImageIcon icon={AnalyticsHeader} />
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
                    <Accordion title={item.title} titleDescription={item.subtitle} key={`analytics-accordion-item-${item.title}`} defaultOpen>
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
          Object.keys(analyticsImages || {})
            .sort((a, b) => {
              const numA = parseInt(a.replace("Analytics", ""), 10);
              const numB = parseInt(b.replace("Analytics", ""), 10);

              return numA - numB;
            })
            .map(key => analyticsImages[key])
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

export default Analytics;

