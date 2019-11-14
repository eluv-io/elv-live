import React from "react";
import {inject, observer} from "mobx-react";
import HLSPlayer from "hls.js";

@inject("siteStore")
@observer
class Title extends React.Component {
  constructor(props) {
    super(props);

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  InitializeVideo(element) {
    const sourceUrl = this.props.siteStore.titles[this.props.titleKey].playoutOptions.hls.playoutUrl;
    const player = new HLSPlayer();
    player.loadSource(sourceUrl);
    player.attachMedia(element);
  }

  FullView() {
    const title = this.props.siteStore.titles[this.props.titleKey];

    if(!title) { return; }

    return (
      <div className="title-container">
        <h3>
          <button onClick={this.props.siteStore.ClearActiveTitle} className="back-button">
            Back to Titles
          </button>
          {title.name}
        </h3>

        <video
          className="title-video"
          controls
          poster={title.components.main_slider_background_desktop}
          ref={this.InitializeVideo}
        />
      </div>
    );
  }

  Preview() {
    const title = this.props.siteStore.titles[this.props.titleKey];

    if(!title) { return; }

    return (
      <div className="title-preview" onClick={() => this.props.siteStore.SetActiveTitle(this.props.titleKey)}>
        <img
          alt={title.name}
          src={title.components.poster}
        />
        <h3>{title.name}</h3>
      </div>
    );
  }

  render() {
    if(this.props.siteStore.activeTitle) {
      if(this.props.siteStore.activeTitle === this.props.titleKey) {
        return this.FullView();
      } else {
        return null;
      }
    }

    return this.Preview();
  }
}

export default Title;
