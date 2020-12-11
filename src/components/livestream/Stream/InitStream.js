import React from "react";
import HLSPlayer from "hls.js";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class InitStream extends React.Component {
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

  InitializeVideo(element) {
    if(!element) { return; }

    // this.DestroyPlayer();

    this.video = element;

    try {
      // element.addEventListener("canplay", () => this.setState({showControls: true}));
      let title = this.props.siteStore.feeds[this.props.stream];
      const offering = title.currentOffering;
      let playoutOptions = title.playoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

      playoutOptions = playoutOptions[offering];

      // Prefer AES playout
      const playoutUrl = (
        playoutOptions.hls.playoutMethods["aes-128"] ||
        playoutOptions.hls.playoutMethods.clear
      ).playoutUrl;
  
      const player = new HLSPlayer({
        // maxBufferLength: 30,
        // maxBufferSize: 300,
        enableWorker: true,
        //startLevel: streamIndex === this.state.activeStream ? -1 : 0,
        capLevelToPlayerSize: true
      });

      player.loadSource(playoutUrl);
      player.attachMedia(element);
      
      this.player = player;

      console.log(this.props.feed,"player", player);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      console.log(this.props.feed,"player error", player);
    }
  }

  // InitializeVideo(element) {
  //   if(!element) { return; }

  //   this.DestroyPlayer();

  //   this.video = element;

  //   try {
  //     element.addEventListener("canplay", () => this.setState({showControls: true}));
  //     let title = this.props.siteStore.feeds[this.props.stream];
  //     const offering = title.currentOffering;
  //     let playoutOptions = title.playoutOptions[offering];

  //     if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

  //     playoutOptions = playoutOptions[offering];

  //     let player;
  //     if(this.props.siteStore.dashSupported && playoutOptions.dash) {
  //       // DASH

  //       player = DashJS.MediaPlayer().create();

  //       player.updateSettings({
  //         'streaming': {
  //             'abr': {
  //               'limitBitrateByPortal': true
  //             }
  //         }
  //       })

  //       const playoutUrl = (playoutOptions.dash.playoutMethods.widevine || playoutOptions.dash.playoutMethods.clear).playoutUrl;
  //       if(playoutOptions.dash.playoutMethods.widevine) {
  //         const widevineUrl = playoutOptions.dash.playoutMethods.widevine.drms.widevine.licenseServers[0];

  //         player.setProtectionData({
  //           "com.widevine.alpha": {
  //             "serverURL": widevineUrl
  //           }
  //         });
  //       }

  //       player.initialize(element, playoutUrl);
  //     } else {
  //       // HLS

  //       this.setState({protocol: "hls"});

  //       if(!HLSPlayer.isSupported()) {
  //         if(this.props.siteStore.availableDRMs.includes("fairplay")) {
  //           InitializeFairPlayStream({playoutOptions, video: element});
  //         } else {
  //           // Prefer AES playout
  //           element.src = (
  //             playoutOptions.hls.playoutMethods["sample-aes"] ||
  //             playoutOptions.hls.playoutMethods["aes-128"] ||
  //             playoutOptions.hls.playoutMethods.clear
  //           ).playoutUrl;
  //         }

  //         // this.setState({native: true});

  //         return;
  //       }

  //       // Prefer AES playout
  //       const playoutUrl = (
  //         playoutOptions.hls.playoutMethods["aes-128"] ||
  //         playoutOptions.hls.playoutMethods.clear
  //       ).playoutUrl;
    
  //       const player = new HLSPlayer({
  //         // maxBufferLength: 30,
  //         // maxBufferSize: 300,
  //         enableWorker: true,
  //         //startLevel: streamIndex === this.state.activeStream ? -1 : 0,
  //         capLevelToPlayerSize: true
  //       });
  
  //       player.loadSource(playoutUrl);
  //       player.attachMedia(element);
  //     }

  //     this.player = player;
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error(error);
  //   }
  // }
  

  render() {
    // console.log("this.props.streamIndex" ,this.props.streamIndex );
    // console.log("this.props.feed" ,this.props.feed );

    return (
      <video
        key={`active-stream-${this.props.feed}`}
        id={`active-stream-${this.props.feed}`}
        ref={this.InitializeVideo}
        autoPlay
        // poster={poster}
        controls
        className={(this.props.activeStream === this.props.feed) || (this.props.activeStream === 6) ? "active-stream" : "hide-stream"}
        muted = {this.props.feed === 0 ? false : true}
      />
    );
  }
}

export default InitStream;