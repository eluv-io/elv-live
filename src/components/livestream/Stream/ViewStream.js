import React from "react";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";
import { Player, PlayerEvent } from 'bitmovin-player';

@inject("siteStore")
@observer
class ViewStream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
    };
    // this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    let title = this.props.siteStore.feeds[this.props.feed];
    let playoutOptions = title.playoutOptions;
    const playerElement = document.getElementById(`active-stream-${this.props.feed}`);

    const config = {
      key: "532a4784-591a-4039-8497-5feb80e5dd66",
      playback: {
        autoplay: false,
        muted: false
      },
      style: {
        controls: 'true',
        overflow: 'none'
      }
    };
    
  
    // API 8
    const player = new Player(playerElement, config);
  
    player.load(playoutOptions).then(
      () => {
        console.log('Successfully created Bitmovin Player instance');
      },
      (error) => {
        DestroyPlayer();
        if(error.name === "SOURCE_NO_SUPPORTED_TECHNOLOGY") {
          SetErrorMessage(`${PROTOCOL} ${DRM} playout not supported for this content`);
        } else {
          SetErrorMessage(`Bitmovin error: ${error.name}`);
          console.error(error);
        }
      }
    );

    // LoadBitmovin();
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.player) {
      this.player.destroy ? this.player.destroy() : this.player.reset();
    }
  }


  // LoadBitmovin() {
  //   let title = this.props.siteStore.feeds[this.props.feed];
  //   const offering = title.currentOffering;
  //   let playoutOptions = title.playoutOptions;
  //   playoutOptions = playoutOptions[offering];

  //   const playerElement = document.getElementById(`active-stream-${this.props.feed}`);

  //   const config = {
  //     key: "532a4784-591a-4039-8497-5feb80e5dd66",
  //     playback: {
  //       autoplay: true
  //     }
  //   };
  
  //   // API 8
  //   const player = new Player(playerElement, config);
  
  //   player.load(playoutOptions).then(
  //     () => {
  //       console.log('Successfully created Bitmovin Player instance');
  //     },
  //     (error) => {
  //       DestroyPlayer();
  //       if(error.name === "SOURCE_NO_SUPPORTED_TECHNOLOGY") {
  //         SetErrorMessage(`${PROTOCOL} ${DRM} playout not supported for this content`);
  //       } else {
  //         SetErrorMessage(`Bitmovin error: ${error.name}`);
  //         console.error(error);
  //       }
  //     }
  //   );
  // };

  // InitializeVideo(element) {
  //   if(!element) { return; }
  //   this.DestroyPlayer();
  //   this.video = element;

  //   try {
  //     // element.addEventListener("canplay", () => this.setState({showControls: true}));
  //     let title = this.props.siteStore.feeds[this.props.feed];
  //     const offering = title.currentOffering;
  //     let playoutOptions = title.playoutOptions;

  //     if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

  //     playoutOptions = playoutOptions[offering];

  //     // playoutOptions = await client.BitmovinPlayoutOptions({
  //     //   objectId,
  //     //   versionHash,
  //     //   protocols: [PROTOCOL],
  //     //   drms: [DRM]
  //     // });

  //     LoadBitmovin(playoutOptions);

  //     // let player;

  //     // const playerElement = CreatePlayerElement();

  //     // API 8
  //     // let container = document.getElementById(`active-stream-${this.props.feed}`);
  //     // player = new Player(container, config);
  //     // // player.on(PlayerEvent.Playing, () => console.log('player is playing'));
  //     // player.load(playoutOptions).then(
  //     //   () => {
  //     //     console.log('Successfully created Bitmovin Player instance');
  //     //   },
  //     //   (error) => {
  //     //     DestroyPlayer();
  //     //     if(error.name === "SOURCE_NO_SUPPORTED_TECHNOLOGY") {
  //     //       SetErrorMessage(`${PROTOCOL} ${DRM} playout not supported for this content`);
  //     //     } else {
  //     //       SetErrorMessage(`Bitmovin error: ${error.name}`);
  //     //       console.error(error);
  //     //     }
  //     //   }
  //     // );
  //     // this.player = player;
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error(error);
  //   }
  // }

  // InitializeVideo(element) {
  //   if(!element) { return; }
  //   this.DestroyPlayer();
  //   this.video = element;

  //   try {
  //     // element.addEventListener("canplay", () => this.setState({showControls: true}));
  //     let title = this.props.siteStore.feeds[this.props.feed];
  //     const offering = title.currentOffering;
  //     let playoutOptions = title.playoutOptions;

  //     if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

  //     playoutOptions = playoutOptions[offering];

  //     let player;

  //     if(this.props.siteStore.dashSupported && playoutOptions.dash) {
  //       // DASH
  //       this.setState({protocol: "dash"});

  //       player = DashJS.MediaPlayer().create();

  //       player.updateSettings({
  //         'streaming': {
  //             'abr': {
  //                 'limitBitrateByPortal': true
  //             }
  //         }
  //       });
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
  //     } 
  //     else {
  //       // HLS

  //       // this.setState({protocol: "hls"});

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

  //         this.setState({native: true});

  //         return;
  //       }

  //       // Prefer AES playout
  //       const playoutUrl = (
  //         playoutOptions.hls.playoutMethods["aes-128"] ||
  //         playoutOptions.hls.playoutMethods.clear
  //       ).playoutUrl;

  //       player = new HLSPlayer({
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
    // this.LoadBitmovin();

    return (
      <div
        key={`active-stream-${this.props.feed}`}
        id={`active-stream-${this.props.feed}`}
        className={(this.props.activeStream === this.props.feed) || (this.props.activeStream === 6) ? "active-stream" : "hide-stream"}
        // muted = {this.props.feed === 0 ? false : true}
      />
    );
  }
}

export default ViewStream;