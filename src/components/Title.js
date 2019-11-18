import React from "react";
import {inject, observer} from "mobx-react";
// import HLSPlayer from "hls.js";

@inject("siteStore")
@observer
class Title extends React.Component {
  constructor(props) {
    super(props);

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

    const playoutOptions = title.trailers ? title.trailers.default.playoutOptions : title.playoutOptions;
    const poster = title.trailers ?
      title.trailers.default.images.thumbnail :
      title.images.main_slider_background_desktop;

    this.player = new bitmovin.player.Player(element, config);
    this.player.load({
      ...(playoutOptions),
      poster
    });
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

        <div
          className="title-video"
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
          src={title.images ? title.images.poster : undefined}
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
