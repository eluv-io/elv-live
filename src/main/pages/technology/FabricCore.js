import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {Accordion, AccordionGroup, InfoBox, RichText} from "../../components/Misc";
import {DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import ImageIcon from "../../components/ImageIcon";
import {Action} from "../../components/Actions";
import {ApplicationIcons} from "../../static/icons/Icons";

const AppSuiteControlPanel = observer(() => {
  const copy = mainStore.l10n.casablanca;

  const APP_ICON_MAP = {
    "creator_studio": ApplicationIcons.CreatorStudioIcon,
    "analytics": ApplicationIcons.ContentAnalyticsIcon,
    "clip_search": ApplicationIcons.AiClipSearchIcon,
    "video_editor": ApplicationIcons.VideoEditorIcon,
    "media_wallet": ApplicationIcons.MediaWalletIcon,
    "embeddable_player": ApplicationIcons.EmbeddablePlayerIcon,
    "tag_new": ApplicationIcons.NewTagIcon,
    "tag_v2": ApplicationIcons.V2TagIcon
  };

  return (
    <div className="page__content-block">
      <div className="curved-box application-suite-info light">
        <h3 className="application-suite-info__header">
          {copy.app_suite_title}
        </h3>
        <div className="application-suite-info__icons">
          {
            copy.application_suite.map(app => (
              <Action to={app.to} target="_blank" key={`app-suite-${app.title}`}>
                <div className="application-suite-info__icon">
                  <ImageIcon icon={APP_ICON_MAP[app.icon]} className="application-suite-info__icon__icon" />
                  <div className="application-suite-info__icon__text">
                    { app.title }
                  </div>
                  <ImageIcon icon={APP_ICON_MAP[app.tag]} className="application-suite-info__icon__tag" />
                </div>
              </Action>
            ))
          }
        </div>
      </div>
    </div>
  );
});

const FabricCore = observer(() => {
  const copy = mainStore.l10n.casablanca;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{copy.title}</h1>
        <h3>{copy.header}</h3>
      </div>
      <div className="page__content-block">
        {
          copy.pages.fabric_core.sections.map(item => (
            <div key={`fabric-core-section-${item.title}`}>
              <h3 className="page__content-block__header light">{item.title}</h3>
              <RichText richText={item.description} className="page__copy fade-in--slow"/>
            </div>
          ))
        }
      </div>
      <AppSuiteControlPanel />
      {
        copy.pages.fabric_core.accordion_sections.map(section => (
          <div className="page__content-block" key={`fabric-core-section-${section.header}`}>
            <AccordionGroup
              key={`fabric-core-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} key={`fabric-core-accordion-item-${item.title}`}>
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
          header={copy.pages.fabric_core.info_link.title}
          content={copy.pages.fabric_core.info_link.description}
          links={[
            {
              // href: //,
              text: copy.pages.fabric_core.info_link.link_text,
              icon: DocumentIcon,
              target: "_blank"
            }
          ]}
        />
      </div>
    </div>
  );
});

export default FabricCore;

