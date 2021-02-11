import {ToggleButton, ToggleButtonConfig} from "bitmovin-player-ui";

/**
 * A button that toggles Apple AirPlay.
 */

class CustomToggleButton extends ToggleButton{
  constructor(handleToggle, cssClass) {
    super(ToggleButtonConfig);

    this.config = this.mergeConfig(ToggleButtonConfig, {
      cssClass: cssClass,
    }, this.config);

    this.state={
      handleToggle: handleToggle,
    };
  }

  configure() {
    this.onClick.subscribe(() => {
      this.state.handleToggle();
    });
  }
}

export default CustomToggleButton;
