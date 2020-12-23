import { PlayerAPI } from 'bitmovin-player';
import { ToggleButton, ToggleButtonConfig,UIInstanceManager,i18n } from 'bitmovin-player-ui';
import React from 'react';

/**
 * A button that toggles Apple AirPlay.
 */

export default class MultiviewButton extends ToggleButton{

  constructor(handleToggle) {
    super(ToggleButtonConfig);

    this.config = this.mergeConfig(ToggleButtonConfig, {
      cssClass: 'ui-airplaytogglebutton ui-multiviewtogglebutton',
    }, this.config);

    this.state={
      handleToggle: handleToggle,
    }
  }

  configure() {

    this.onClick.subscribe(() => {
      console.log("handleToggle");
      this.state.handleToggle();
    });
  }
}