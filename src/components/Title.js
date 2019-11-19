import React from "react";
import {inject, observer} from "mobx-react";
import AsyncComponent from "./AsyncComponent";
// import HLSPlayer from "hls.js";

@inject("siteStore")
@observer
class Title extends React.Component {
  constructor(props) {
    super(props);

    this.PageContent = this.PageContent.bind(this);
    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentWillUnmount() {
    if(this.player) {
      this.player.destroy();
      this.player = undefined;
    }
  }

  InitializeVideo(element) {
    const title = this.props.siteStore.titles[this.props.titleKey];
    if(!element || !title) { return; }

    /*
      // hls.js
      const sourceUrl = this.props.siteStore.titles[this.props.titleKey].playoutOptions.hls.playoutUrl;
      const player = new HLSPlayer();
      player.loadSource(sourceUrl);
      player.attachMedia(element);
    */

    const authToken = this.props.siteStore.authTokens[this.props.titleKey];
    const config = {
      key: EluvioConfiguration["bitmovin-api-key"],
      network: {
        preprocessHttpRequest(type, request) {
          request.headers.Authorization = `Bearer ${authToken}`;
          return Promise.resolve(request);
        }
      },
      playback: {
        autoplay: false
      }
    };

    let poster = title.images.main_slider_background_desktop.url;
    let playoutOptions = title.playoutOptions;
    if(title.trailers.default) {
      poster = title.trailers.default.images.thumbnail.url;
      playoutOptions = title.trailers.default.playoutOptions;
    }

    this.player = new bitmovin.player.Player(element, config);
    this.player.load({
      ...(playoutOptions),
      poster
    });
  }

  PageContent() {
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

        <div
          className="title-video"
          ref={this.InitializeVideo}
        />
      </div>
    );
  }

  render() {
    return (
      <AsyncComponent
        Load={() => this.props.siteStore.LoadTitle(this.props.franchiseKey, this.props.titleKey)}
        render={this.PageContent}
      />
    );
  }
}

export default Title;
