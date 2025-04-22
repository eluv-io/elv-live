import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {ApplicationIcons} from "../../static/icons/Icons";
import {Action} from "../../components/Actions";
import ImageIcon from "../../components/ImageIcon";

const AppSuiteControlPanel = observer(() => {
  const copy = mainStore.l10n.core_apps.application_suite;

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
          {copy.title}
        </h3>
        <div className="application-suite-info__icons">
          {
            copy.items.map(app => (
              <Action to={app.to} target="_blank" key={`app-suite-${app.title}`}>
                <div className="application-suite-info__icon">
                  <ImageIcon icon={APP_ICON_MAP[app.icon]} className="application-suite-info__icon__icon" />
                  <div className="application-suite-info__icon__text">
                    { app.title }
                  </div>
                </div>
              </Action>
            ))
          }
        </div>
      </div>
    </div>
  );
});

export default AppSuiteControlPanel;
