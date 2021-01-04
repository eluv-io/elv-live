import React from "react";

import {inject, observer} from "mobx-react";
import { Player, PlayerEvent } from "bitmovin-player";
import {  PlayerUtils, PlaybackTimeLabelMode,Container, PlaybackTimeLabel, SeekBar, SeekBarLabel, ControlBar, UIContainer, UIManager, BufferingOverlay, PlaybackToggleButton, VolumeToggleButton, VolumeSlider, Spacer, PlaybackToggleOverlay, CastStatusOverlay, ErrorMessageOverlay, FullscreenToggleButton} from "bitmovin-player-ui";
import CustomToggleButton from  "./CustomToggleButton"; 

@inject("siteStore")
@observer
class BitmovinPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
      switchValue: 0,
      player: null,
      playoutOptions: [],
    };

    this.LoadBitmovin = this.LoadBitmovin.bind(this);
    this.handleMultiViewSwitch = this.handleMultiViewSwitch.bind(this);
    this.DestroyPlayer = this.DestroyPlayer.bind(this);

  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.LoadBitmovin();
  }
  
  handleMultiViewSwitch() {
    let source, feedOption;

    if(this.state.switchValue == (this.props.siteStore.feeds.length -1)) {
      feedOption = 0;
    } else {
      feedOption = this.state.switchValue + 1;
    }

    this.setState({switchValue: feedOption});

    source = this.props.siteStore.feeds[feedOption].playoutOptions;

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
    let player = new Player(playerContainer, conf);


    let controlBar = new ControlBar({
      components: [
        
        new Container({
          components: [
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
            new SeekBar({ label: new SeekBarLabel() }),
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.TotalTime, cssClasses: ["text-right"] }),
          ],
          cssClasses: ["controlbar-top"],
        }),
        new Container({
          components: [
            new PlaybackToggleButton(),
            new VolumeToggleButton(),
            new VolumeSlider(),
            new Spacer(),
            new CustomToggleButton(this.handleMultiViewSwitch, "ui-airplaytogglebutton ui-multiviewToggleButton"),
            new CustomToggleButton(this.props.handleDarkToggle, "ui-vrtogglebutton ui-darkmodetogglebutton"),
            new FullscreenToggleButton(),
          ],
          cssClasses: ["controlbar-bottom"],
        }),
      ],
    });

    const myUi = new UIContainer({
      components: [
        new BufferingOverlay(),
        new PlaybackToggleOverlay(),
        new CastStatusOverlay(),
        controlBar,
        new ErrorMessageOverlay(),
      ],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });
    
    const myUiManager = new UIManager(player, myUi);
    
    this.setState({player: player});

    let source = this.props.siteStore.feeds[0].playoutOptions;

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
        // muted = {this.props.feed === 0 ? false : true}
      />
    );
  }
}

export default BitmovinPlayer;