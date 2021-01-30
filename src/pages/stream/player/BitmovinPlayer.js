import React from "react";
import {inject, observer} from "mobx-react";

import CustomToggleButtonInit from  "./CustomToggleButton";
import {toJS} from "mobx";

// TODO: Robust error handling
const SetErrorMessage = (message) => {
  console.log(message);
};

let BitmovinImports, BitmovinUIImports, CustomToggleButton;

@inject("siteStore")
@observer
class BitmovinPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      switchValue: 0,
      player: null,
      playoutOptions: [],
    };

    this.LoadBitmovin = this.LoadBitmovin.bind(this);
    this.handleMultiViewSwitch = this.handleMultiViewSwitch.bind(this);
    this.DestroyPlayer = this.DestroyPlayer.bind(this);

  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    if(!BitmovinImports) {
      BitmovinImports = await import("bitmovin-player");
    }

    if(!BitmovinUIImports) {
      BitmovinUIImports = await import("bitmovin-player-ui");
      CustomToggleButton = CustomToggleButtonInit(BitmovinUIImports.ToggleButton, BitmovinUIImports.ToggleButtonConfig);
    }

    this.LoadBitmovin();
  }

  handleMultiViewSwitch() {
    let source, feedOption;

    if(this.state.switchValue === (this.props.siteStore.feeds.length -1)) {
      feedOption = 0;
    } else {
      feedOption = this.state.switchValue + 1;
    }

    this.setState({switchValue: feedOption});

    source = toJS(this.props.siteStore.feeds[feedOption].playoutOptions);

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

  LoadBitmovin() {
    const conf = {
      key: "532a4784-591a-4039-8497-5feb80e5dd66",
      playback: {
        muted: true,
        autoplay: true,
      },
      ui: false, // disable the built-in UI
    };

    let playerContainer = document.getElementById("player-container");
    let player = new BitmovinImports.Player(playerContainer, conf);

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
            new CustomToggleButton(this.handleMultiViewSwitch, "ui-airplaytogglebutton ui-multiviewToggleButton"),
            new CustomToggleButton(this.props.handleDarkToggle, "ui-vrtogglebutton ui-darkmodetogglebutton"),
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

    const myUiManager = new BitmovinUIImports.UIManager(player, myUi);

    this.setState({player: player});

    let source = toJS(this.props.siteStore.feeds[0].playoutOptions);

    console.log(source);

    player.load(source).then(
      () => {
        console.log("Successfully created Bitmovin Player instance");
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

  render() {
    return (
      <div
        key={"player-container"}
        id={"player-container"}
        className="feedGrid"
      />
    );
  }
}

export default BitmovinPlayer;
