import React from "react";
import {inject, observer} from "mobx-react";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import EluvioConfiguration from "../../../configuration";

@inject("rootStore")
@inject("siteStore")
@observer
class Drop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false
    };

    this.InitializeStream = this.InitializeStream.bind(this);
  }

  componentDidMount() {
    this.props.rootStore.SetWalletPanelVisibility("side-panel");
    this.props.rootStore.walletClient.ToggleNavigation(false);
    this.props.rootStore.walletClient.Navigate({
      page: "drop",
      params: {
        marketplaceId: this.props.siteStore.currentSiteInfo.marketplaceId,
        dropId: this.props.match.params.dropId
      }
    });
  }

  componentWillUnmount() {
    this.props.rootStore.SetWalletPanelVisibility("hidden");
  }

  Drop() {
    return this.props.siteStore.currentSiteInfo.drops.find(drop => drop.uuid === this.props.match.params.dropId);
  }

  async InitializeStream(element) {
    const drop = this.Drop();

    if(!drop.stream) { return; }

    const streamHash = drop.stream["."].source;

    try {
      if(this.state.initialized || !element) { return; }

      this.setState({initialized: true});

      const player = new EluvioPlayer(
        element,
        {
          clientOptions: {
            network: EluvioConfiguration["config-url"].includes("main.net955305") ?
              EluvioPlayerParameters.networks.MAIN : EluvioPlayerParameters.networks.DEMO,
            client: this.props.siteStore.client
          },
          sourceOptions: {
            playoutParameters: {
              versionHash: streamHash
            }
          },
          playerOptions: {
            muted: EluvioPlayerParameters.muted.ON,
            autoplay: EluvioPlayerParameters.autoplay.ON,
            loop: EluvioPlayerParameters.loop.ON,
            controls: EluvioPlayerParameters.controls.OFF,
            watermark: EluvioPlayerParameters.watermark.OFF,
            errorCallback: () => {
              setTimeout(() => {
                this.state.player && this.state.player.Destroy();
                this.setState({initialized: false, key: this.state.key + 1, player: undefined});
              }, 5000);
            }
          }
        }
      );

      this.setState({player});
      window.player = player;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);

      this.setState({error: true});
    }
  }
  render() {
    return (
      <div className="page-container drop-page">
        <div className="main-content-container drop-page__content wallet-panel-page-content">
          <div className="drop-page__stream" ref={this.InitializeStream} />
        </div>
      </div>
    );
  }
}

export default Drop;
