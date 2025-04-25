import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import AppSuiteControlPanel from "./AppSuiteControlPanel";
import ImageIcon from "../../components/ImageIcon";
import {ApplicationIcons, DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import {Accordion, AccordionGroup, InfoBox, RichText, Video} from "../../components/Misc";
import * as videoEditorImages from "../../static/images/apps/video-editor";
import AppImageGallery from "./AppImageGallery";

const VideoEditor = observer(() => {
  const copy = mainStore.l10n.core_apps.pages.video_editor;

  return (
    <div className="page light">
      <div className="page__content-block">
        <div className="application-info__header">
          <div className="application-info__header-title-group">
            <div className="application-info__header-title">{copy.header}</div>
            <div className="application-info__title-group">
              <ImageIcon icon={ApplicationIcons.VideoEditorIcon} className="application-info__icon"/>
              <div className="application-info__header-text light">{copy.title}</div>
            </div>
            <RichText richText={copy.short_description} className="application-info__short-description page__copy fade-in--slow"/>
          </div>

          <Video versionHash={copy.walkthrough_video} className="application-info__header-video " />

          <RichText richText={copy.full_description} className="application-info__full-description page__copy page__copy--no-mb fade-in--slow"/>
        </div>
      </div>
      <AppSuiteControlPanel />
      {
        copy.accordion_sections.map(section => (
          <div className="page__content-block" key={`video-editor-section-${section.header}`}>
            <AccordionGroup
              key={`video-editor-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} key={`video-editor-accordion-item-${item.title}`} defaultOpen>
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
      <AppImageGallery items={Object.values(videoEditorImages || {})} />
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

export default VideoEditor;

