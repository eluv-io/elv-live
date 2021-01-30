
/**
 * A button that toggles Apple AirPlay.
 */

export default (ToggleButton, ToggleButtonConfig) => {
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

  return CustomToggleButton;
};

