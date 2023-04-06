import React from "react";
import {observer} from "mobx-react";
import HeaderLoop from "../../static/videos/header-loop.mp4";

const HeaderVideo = observer(() => {
  return (
    <div
      className="main-page-header__video"
      // React doesn't handle muted attribute properly, which breaks autoplay
      dangerouslySetInnerHTML={{__html: `<video src=${HeaderLoop} loop muted playsinline="" autoplay class="main-page-header__video" />`}}
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
