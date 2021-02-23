import React from "react";
import {inject, observer} from "mobx-react";

import {toJS} from "mobx";

import BitmovinImports from "bitmovin-player";
import * as BitmovinUIImports from "bitmovin-player-ui";
import {EluvioConfiguration} from "EluvioConfiguration";
import ErrorHandler from "Common/ErrorHandler";

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
      promoIndex: 0,
      playerRef: undefined,
      player: null,
      loaded: false,
      error: ""
    };

    this.LoadBitmovin = this.LoadBitmovin.bind(this);
    this.DestroyPlayer = this.DestroyPlayer.bind(this);
  }

  componentDidMount() {
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    this.DestroyPlayer();
    document.body.style.overflow = "auto";
  }

  DestroyPlayer() {
    if(this.state.player) {
      this.state.player.destroy();
    }
  }

  LoadBitmovin(playerRef) {
    const source = toJS(this.props.siteStore.promos[this.state.promoIndex].playoutOptions);

    if(this.state.player) {
      this.state.player.load(source);
      return;
    }

    if(!playerRef || this.state.playerRef) { return; }

    const conf = {
      key: EluvioConfiguration["bitmovin-license-key"],
      playback: {
        muted: false,
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

    new BitmovinUIImports.UIManager(player, myUi);

    this.setState({
      player,
      playerRef
    });

    player.load(source).then(
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
    if(!this.props.siteStore.promos || this.props.siteStore.promos.length === 0) { return null; }

    let nextButton, previousButton;
    if(this.props.siteStore.promos && this.props.siteStore.promos.length > 0) {
      previousButton = (
        <button
          className="btn previous-promo-button"
          disabled={this.state.promoIndex <= 0}
          onClick={() => this.setState({promoIndex: this.state.promoIndex - 1}, this.LoadBitmovin)}
        >
          Play Previous
        </button>
      );

      nextButton = (
        <button
          className="btn next-promo-button"
          disabled={this.state.promoIndex >= this.props.siteStore.promos.length - 1}
          onClick={() => this.setState({promoIndex: this.state.promoIndex + 1}, this.LoadBitmovin)}
        >
          Play Next
        </button>
      );
    }

    return (
      <div className="promo-player-container">
        <div
          ref={this.LoadBitmovin}
          key="player-container"
          className="promo-player"
        />
        <div className="promo-buttons-container">
          { previousButton }
          { nextButton }
        </div>
      </div>
    );
  }
}

export default ErrorHandler(PromoPlayer);
