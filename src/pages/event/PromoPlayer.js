import React from "react";
import {inject, observer} from "mobx-react";

import {toJS} from "mobx";

import BitmovinImports from "bitmovin-player";
import * as BitmovinUIImports from "bitmovin-player-ui";
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
class PromoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerRef: undefined,
      player: null
    };

    this.LoadBitmovin = this.LoadBitmovin.bind(this);
    this.DestroyPlayer = this.DestroyPlayer.bind(this);
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.state.player) {
      this.state.player.destroy();
    }
  }

  LoadBitmovin(playerRef) {
    if(!playerRef || this.state.playerRef) { return; }

    const conf = {
      key: EluvioConfiguration["bitmovin-license-key"],
      playback: {
        muted: true,
        autoplay: true,
      },
      //ui: true,
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

    const myUiManager = new BitmovinUIImports.UIManager(player, myUi);

    this.setState({
      player,
      playerRef
    });

    let source = toJS(this.props.siteStore.promos[this.props.promoIndex].playoutOptions);

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
        className="promo-player"
      />
    );
  }
}

export default PromoPlayer;
