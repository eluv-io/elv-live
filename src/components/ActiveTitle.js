import React from "react";
import HLSPlayer from "hls.js";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import BackIcon from "../static/icons/back.svg";

@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  constructor(props) {
    super(props);

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.state = {
      poster: props.siteStore.CreateLink(
        this.props.siteStore.activeTitle.baseLinkUrl,
        "images/main_slider_background_desktop/thumbnail",
        { height: Math.floor(vh / 1.5) }
      )
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentWillUnmount() {
    if(this.player) {
      this.player.destroy();
    }
  }

  InitializeVideo(element) {
    if(!element) {
      return;
    }

    if(this.player) {
      this.player.destroy();
    }

    try {
      const playoutMethods = this.props.siteStore.activeTitle.playoutOptions.hls.playoutMethods;
      // Prefer AES playout
      const playoutUrl = (playoutMethods["aes-128"] || playoutMethods.clear).playoutUrl;

      const player = new HLSPlayer();

      player.loadSource(playoutUrl);
      player.attachMedia(element);

      this.player = player;

      element.scrollIntoView({behavior: "smooth"});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    if(!this.props.siteStore.activeTitle) { return null; }

    return (
      <div className="active-title">
        <video
          ref={this.InitializeVideo}
          autoPlay
          poster={this.state.poster}
          controls
        />
        <h4>
          <ImageIcon
            className="back-button"
            title="Back"
            icon={BackIcon}
            onClick={this.props.siteStore.ClearActiveTitle}
          />
          { this.props.siteStore.activeTitle.display_title }
        </h4>
        <div className="synopsis">
          { this.props.siteStore.activeTitle.synopsis }
        </div>
      </div>
    );
  }
}

export default ActiveTitle;
