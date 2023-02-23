import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";

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
