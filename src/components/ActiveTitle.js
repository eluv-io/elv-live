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

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  InitializeVideo(element) {
    if(!element) { return; }

    try {
      const playoutMethods = this.props.siteStore.activeTitle.playoutOptions.hls.playoutMethods;
      // Prefer AES playout
      const playoutUrl = (playoutMethods["aes-128"] || playoutMethods.clear).playoutUrl;

      const player = new HLSPlayer();

      player.loadSource(playoutUrl);
      player.attachMedia(element);

      element.scrollIntoView({behavior: "smooth"});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    if(!this.props.siteStore.activeTitle) { return null; }

    const key = `active-title-${this.props.siteStore.activeTitle.playlistIndex}-${this.props.siteStore.activeTitle.titleIndex}`;

    return (
      <div className="active-title" key={key}>
        <video
          ref={this.InitializeVideo}
          autoPlay
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
