import React from "react";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";
import artist1 from "../../static/images/livestream/artist1.png";

@inject("rootStore")
@inject("siteStore")
@observer
class RTMP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.player) {
      this.player.destroy ? this.player.destroy() : this.player.reset();
    }
  }

  Schedule() {
    return {};
  }

  InitializeVideo(element) {
    if(!element) { return; }

    this.DestroyPlayer();

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));
      const title = this.props.siteStore.stream.title;
      const offering = title.currentOffering;
      let playoutOptions = title.playoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

      playoutOptions = playoutOptions[offering];

      let player;
      if(this.props.siteStore.dashSupported && playoutOptions.dash) {
        // DASH

        player = DashJS.MediaPlayer().create();

        const playoutUrl = (playoutOptions.dash.playoutMethods.widevine || playoutOptions.dash.playoutMethods.clear).playoutUrl;
        if(playoutOptions.dash.playoutMethods.widevine) {
          const widevineUrl = playoutOptions.dash.playoutMethods.widevine.drms.widevine.licenseServers[0];

          player.setProtectionData({
            "com.widevine.alpha": {
              "serverURL": widevineUrl
            }
          });
        }

        player.initialize(element, playoutUrl);
      } else {
        // HLS

        // Prefer AES playout
        const playoutUrl = (playoutOptions.hls.playoutMethods["aes-128"] || playoutOptions.hls.playoutMethods.clear).playoutUrl;

        if(!HLSPlayer.isSupported()) {
          element.src = playoutUrl;
          return;
        }

        const player = new HLSPlayer();
        player.loadSource(playoutUrl);
        player.attachMedia(element);
      }

      this.player = player;
      this.video = element;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    console.log("RTMP ACTIVE TITLE:");
    console.log(this.props.siteStore.stream.title);

    const title = this.props.siteStore.stream.title;
    // const poster = this.props.siteStore.activeTitle.landscapeUrl || this.props.siteStore.activeTitle.imageUrl;

    return (
      <video
        key={`active-title-video-${title.titleId}-${title.currentOffering}`}
        ref={this.InitializeVideo}
        autoPlay
        poster ={artist1}
        controls={this.state.showControls}
        className={"stream-container__streamBox--video"}
      />
    );
  }
}

export default RTMP;