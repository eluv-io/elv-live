import React from "react";
import {observer} from "mobx-react";
import HeaderLoop from "../../static/videos/header-loop.mp4";

const HeaderVideo = observer(() => {
  return (
    <video
      // Muted isn't set properly in react
      ref={element => element?.setAttribute("muted", "1")}
      loop
      playsInline
      autoPlay
      className="main-page-header__video"
      src={HeaderLoop}
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
