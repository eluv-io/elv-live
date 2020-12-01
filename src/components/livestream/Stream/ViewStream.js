import React from "react";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class ViewStream extends React.Component {
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

    this.DestroyPlayer();

    this.video = element;

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));
      let title = this.props.siteStore.feeds[this.props.feedOption];
      const offering = title.currentOffering;
      let playoutOptions = title.playoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

      playoutOptions = playoutOptions[offering];

      let player;
      if(this.props.siteStore.dashSupported && playoutOptions.dash) {
        // DASH

        this.setState({protocol: "dash"});

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

        player.on(
          DashJS.MediaPlayer.events.CAN_PLAY,
          () => {
            this.setState({
              audioTracks: {
                current: player.getCurrentTrackFor("audio").index,
                available: player.getTracksFor("audio").map(audioTrack =>
                  ({
                    index: audioTrack.index,
                    label: audioTrack.labels && audioTrack.labels.length > 0 ? audioTrack.labels[0].text : audioTrack.lang
                  })
                )
              }
            });
          }
        );

        player.on(
          DashJS.MediaPlayer.events.TEXT_TRACK_ADDED,
          () => {

            const available = player.getTracksFor("text").map(textTrack =>
              ({
                index: textTrack.index,
                label: textTrack.labels && textTrack.labels.length > 0 ? textTrack.labels[0].text : textTrack.lang
              })
            );

            this.setState({
              textTracks: {
                current: available.findIndex(track => track.index === player.getCurrentTrackFor("text").index),
                available
              }
            });
          }
        );

        player.initialize(element, playoutUrl);
      } else {
        // HLS

        this.setState({protocol: "hls"});

        if(!HLSPlayer.isSupported()) {
          if(this.props.siteStore.availableDRMs.includes("fairplay")) {
            InitializeFairPlayStream({playoutOptions, video: element});
          } else {
            // Prefer AES playout
            element.src = (
              playoutOptions.hls.playoutMethods["sample-aes"] ||
              playoutOptions.hls.playoutMethods["aes-128"] ||
              playoutOptions.hls.playoutMethods.clear
            ).playoutUrl;
          }

          this.setState({native: true});

          return;
        }

        // Prefer AES playout
        const playoutUrl = (
          playoutOptions.hls.playoutMethods["aes-128"] ||
          playoutOptions.hls.playoutMethods.clear
        ).playoutUrl;

        player = new HLSPlayer();

        player.on(HLSPlayer.Events.AUDIO_TRACK_SWITCHED, () => {
          this.setState({
            audioTracks: {
              current: player.audioTrack,
              available: player.audioTrackController.tracks.map(audioTrack =>
                ({
                  index: audioTrack.id,
                  label: audioTrack.name
                })
              )
            }
          });
        });

        player.on(HLSPlayer.Events.SUBTITLE_TRACK_LOADED, () => {
          this.setState({
            textTracks: {
              current: player.subtitleTrack,
              available: Array.from(this.video.textTracks)
            }
          });
        });

        player.on(HLSPlayer.Events.SUBTITLE_TRACK_SWITCH, () => {
          this.setState({
            textTracks: {
              current: player.subtitleTrack,
              available: Array.from(this.video.textTracks)
            }
          });
        });

        player.loadSource(playoutUrl);
        player.attachMedia(element);
      }

      this.player = player;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    return (
      <video
        key={`active-title-video-${this.props.feedOption}`}
        ref={this.InitializeVideo}
        autoPlay
        // poster={poster}
        controls={this.props.showControls}
        className={this.props.classProp}
        muted = {this.props.mutedOption}
      />
    );
  }
}

export default ViewStream;