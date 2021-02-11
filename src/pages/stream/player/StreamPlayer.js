import React from "react";
import {inject, observer} from "mobx-react";

import {toJS} from "mobx";

import BitmovinImports from "bitmovin-player";
import * as BitmovinUIImports from "bitmovin-player-ui";
import CustomToggleButton from "Stream/player/CustomToggleButton";
import {EluvioConfiguration} from "EluvioConfiguration";

// TODO: Robust error handling
const SetErrorMessage = (message) => {
  console.log(message);
};

/**
 * A button that toggles Apple AirPlay.
 */

@inject("siteStore")
@observer
class StreamPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerRef: undefined,
      activeStream: 0,
      player: null,
      playoutOptions: [],
    };

    this.LoadBitmovin = this.LoadBitmovin.bind(this);
    this.handleMultiViewSwitch = this.handleMultiViewSwitch.bind(this);
    this.DestroyPlayer = this.DestroyPlayer.bind(this);
  }

  handleMultiViewSwitch() {
    const source = toJS(this.props.siteStore.streams[this.state.activeStream].playoutOptions);

    this.state.player.load(source).then(
      () => {
        /* eslint-disable no-console */
        console.log("Successfully created Bitmovin Player instance");
        /* eslint-enable no-console */

      },
      (error) => {
        this.DestroyPlayer();

        if(error.name === "SOURCE_NO_SUPPORTED_TECHNOLOGY") {
          SetErrorMessage(`${PROTOCOL} ${DRM} playout not supported for this content`);

        } else {
          SetErrorMessage(`Bitmovin error: ${error.name}`);
          console.error(error);
        }
      }
    );
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.state.player) {
      this.state.player.destroy();
    }
  }

  StreamSwitchButton() {
    if(this.props.siteStore.streams.length <= 1) { return undefined; }

    return new CustomToggleButton(() => {
      this.setState({activeStream: (this.state.activeStream + 1) % this.props.siteStore.streams.length});

      this.handleMultiViewSwitch();
    }, "ui-airplaytogglebutton ui-multiviewToggleButton");
  }

  LoadBitmovin(playerRef) {
    if(!playerRef || this.state.playerRef || this.props.siteStore.streams.length === 0) { return; }

    const conf = {
      key: EluvioConfiguration["bitmovin-license-key"],
      playback: {
        muted: false,
        autoplay: true,
      },
      ui: false, // disable the built-in UI
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
            this.StreamSwitchButton(),
            new CustomToggleButton(this.props.handleDarkToggle, "ui-vrtogglebutton ui-darkmodetogglebutton"),
            new BitmovinUIImports.FullscreenToggleButton(),
          ].filter(c => c),
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
      player: player,
      playerRef
    });

    let source = toJS(this.props.siteStore.streams[0].playoutOptions);

    console.log(source);

    player.load(source).then(
      () => {
        console.log("Successfully created Bitmovin Player instance");
      },
      (error) => {
        this.DestroyPlayer();
        if(error.name === "SOURCE_NO_SUPPORTED_TECHNOLOGY") {
          //SetErrorMessage(`${PROTOCOL} ${DRM} playout not supported for this content`);
        } else {
          SetErrorMessage(`Bitmovin error: ${error.name}`);
          console.error(error);
        }
      }
    );
  }

  render() {
    return (
      <div
        ref={this.LoadBitmovin}
        key={"player-container"}
        className="feedGrid"
      />
    );
  }
}

export default StreamPlayer;
