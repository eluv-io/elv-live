import React from "react";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class ViewTrailer extends React.Component {
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

      const offering = this.props.siteStore.activeTrailer.currentOffering;
      let playoutOptions = this.props.siteStore.activeTrailer.playoutOptions;

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

  VideoPage() {

    const title = this.props.siteStore.activeTrailer;
    const poster = this.props.siteStore.activeTrailer.landscapeUrl || this.props.siteStore.activeTrailer.imageUrl;

    return (
      <div className={"video-feature__video"}>
        <video
          id="background-video"
          loop
          autoPlay
          muted={true}
          key={`active-title-video-${title.titleId}-${title.currentOffering}`}
          ref={this.InitializeVideo}
          poster={poster}
          controls={this.state.showControls}
        />
      </div>
    );
  }

  render() {
    if(!this.props.siteStore.activeTrailer) { return null; }

    return (
      <React.Fragment>
        { this.VideoPage() }  
      </React.Fragment>
    );
  }
}

export default ViewTrailer;
