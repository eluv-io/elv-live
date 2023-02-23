import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {Video} from "../../components/Misc";

const HeaderVideo = observer(() => {
  return (
    <video
      loop
      muted
      autoPlay
      className="main-page-header__video"
      src={mainStore.headerLoopURL}
    />
  );
});

export const MainHeader = ({children, video=true}) => {
  return (
    <div className="main-page-header">
      { video ? <HeaderVideo /> : null }
      <div className="main-page-header__content">
        { children }
      </div>
      <div className="main-page-header__gradient" />
    </div>
  );
};

export const VideoWithContent = ({videoHash, content}) => {
  return (
    <div className="main-page-block main-page-block--video">
      <Video versionHash={videoHash} className="main-page-block__video" />
      { content }
      <div className="main-page-block__copy-container">
        <h3 className="main-page-block__copy-subheader"></h3>
      </div>
    </div>
  );
};
