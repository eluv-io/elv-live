import React from "react";

import BitmovinImports from "bitmovin-player";
import * as BitmovinUIImports from "bitmovin-player-ui";
import EluvioConfiguration from "EluvioConfiguration";
import ErrorHandler from "Common/ErrorHandler";
import {toJS} from "mobx";

// TODO: Robust error handling
const SetErrorMessage = (message) => {
  console.log(message);
};

class BitmovinPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerRef: undefined,
      player: null,
      error: "",
      lastPlayPauseAction: ""
    };

    this.LoadBitmovin = this.LoadBitmovin.bind(this);
    this.DestroyPlayer = this.DestroyPlayer.bind(this);
    this.ScrollPlayPause = this.ScrollPlayPause.bind(this);
  }

  componentDidMount() {
    if(!this.props.scrollPlayPause) { return; }

    document.addEventListener("scroll", this.ScrollPlayPause);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.ScrollPlayPause);
  }

  ScrollPlayPause() {
    if(!this.state.playerRef || !this.state.player) { return; }

    const {top, left, bottom, right} = this.state.playerRef.getBoundingClientRect();
    const isVisible = (
      top >= 0 &&
      left >= 0 &&
      bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    if(this.state.lastPlayPauseAction !== "play" && isVisible && !this.state.player.isPlaying()) {
      this.state.player.play();
      this.setState({lastPlayPauseAction: "play"});
    } else if(this.state.lastPlayPauseAction !== "pause" && !isVisible && this.state.player.isPlaying()) {
      this.state.player.pause();
      this.setState({lastPlayPauseAction: "pause"});
    }
  }

  DestroyPlayer() {
    if(this.state.player) {
      this.state.player.destroy();
    }
  }

  LoadBitmovin(playerRef) {
    const playoutOptions = toJS(this.props.playoutOptions);

    if(this.state.player) {
      this.state.player.load(playoutOptions);
      return;
    }

    if(!playerRef || this.state.playerRef) { return; }

    const conf = {
      key: EluvioConfiguration["bitmovin-license-key"],
      playback: {
        muted: this.props.muted || false,
        autoplay: this.props.autoPlay || false
      }
    };

    let player = new BitmovinImports.Player(playerRef, conf);

    let controlBar = new BitmovinUIImports.ControlBar({
      components: [
        new BitmovinUIImports.Container({
          components: [
            new BitmovinUIImports.PlaybackTimeLabel({ timeLabelMode: BitmovinUIImports.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
            new BitmovinUIImports.SeekBar({ label: new BitmovinUIImports.SeekBarLabel() }),
            new BitmovinUIImports.PlaybackTimeLabel({ timeLabelMode: BitmovinUIImports.PlaybackTimeLabelMode.TotalTime, cssClasses: ["text-right"] }),
          ],
          cssClasses: ["controlbar-top"],
        }),
        new BitmovinUIImports.Container({
          components: [
            new BitmovinUIImports.PlaybackToggleButton(),
            new BitmovinUIImports.VolumeToggleButton(),
            new BitmovinUIImports.VolumeSlider(),
            new BitmovinUIImports.Spacer(),
            new BitmovinUIImports.FullscreenToggleButton(),
          ],
          cssClasses: ["controlbar-bottom"],
        }),
      ],
    });

    const myUi = new BitmovinUIImports.UIContainer({
      components: [
        new BitmovinUIImports.BufferingOverlay(),
        new BitmovinUIImports.PlaybackToggleOverlay(),
        new BitmovinUIImports.CastStatusOverlay(),
        controlBar,
        new BitmovinUIImports.ErrorMessageOverlay(),
      ],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        BitmovinUIImports.PlayerUtils.PlayerState.Prepared,
        BitmovinUIImports.PlayerUtils.PlayerState.Paused,
        BitmovinUIImports.PlayerUtils.PlayerState.Finished,
      ],
    });

    new BitmovinUIImports.UIManager(player, myUi);

    this.setState({
      player,
      playerRef
    });

    player.load(playoutOptions).then(
      () => {
        console.log("Successfully created Bitmovin Player instance");
      },
      (error) => {
        this.setState({error: error.toString()});
        this.DestroyPlayer();
        if(error.name === "SOURCE_NO_SUPPORTED_TECHNOLOGY") {
          //SetErrorMessage(`${PROTOCOL} ${DRM} playout not supported for this content`);
        } else {
          //SetErrorMessage(`Bitmovin error: ${error.name}`);
          //console.error(error);
        }
      }
    );
  }

  render() {
    return (
      <div
        ref={this.LoadBitmovin}
        key="player-container"
        className="promo-player"
      />
    );
  }
}

export default ErrorHandler(BitmovinPlayer);
