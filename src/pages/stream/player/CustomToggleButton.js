import { PlayerAPI } from "bitmovin-player";
import { ToggleButton, ToggleButtonConfig,UIInstanceManager,i18n } from "bitmovin-player-ui";
import React from "react";

/**
 * A button that toggles Apple AirPlay.
 */

export default class CustomToggleButton extends ToggleButton{

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