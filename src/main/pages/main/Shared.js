import React, {useEffect, useRef} from "react";
import {observer} from "mobx-react";
import HeaderLoop from "../../static/videos/header-loop.mp4";

const HeaderVideo = observer(({src=HeaderLoop}) => {
  const ref = useRef(null);

  // Autoplay attribute is not reliably honored on innerHTML-inserted video
  useEffect(() => {
    const video = ref.current?.querySelector("video");

    if(!video) { return; }

    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  return (
    <div
      ref={ref}
      className="main-page-header__video"
      // React doesn't handle muted attribute properly, which breaks autoplay
      dangerouslySetInnerHTML={{__html: `<video src=${src} loop muted playsinline="" autoplay class="main-page-header__video" />`}}
    />
  );
});

export const MainHeader = ({children, backgroundImage, video=true, videoSrc, light=false}) => {
  return (
    <div className={`main-page-header main-page-header__image-bg ${light ? "main-page-header--light" : ""}`} style={backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    } : null}>
      { video ? <HeaderVideo src={videoSrc} /> : null }
      <div className="main-page-header__content">
        { children }
      </div>
      <div className="main-page-header__gradient" />
    </div>
  );
};
