import React from "react";
import {inject, observer} from "mobx-react";
import {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import EluvioConfiguration from "EluvioConfiguration";
import {ErrorWrapper} from "Common/ErrorBoundary";
import Player from "Common/Player";

@inject("siteStore")
@observer
class PromoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      promoIndex: 0,
      loaded: false,
      error: ""
    };
  }

  componentDidMount() {
    document.body.style.overflowY = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflowY = "auto";
  }

  Video(linkPath) {
    return (
      <Player
        params={
          {
            clientOptions: {
              client: this.props.siteStore.rootStore.client
            },
            sourceOptions: {
              drms: [
                "clear",
                "aes-128",
                "sample-aes",
                "widevine"
              ],
              playoutParameters: {
                objectId: EluvioConfiguration["live-site-id"],
                linkPath
              }
            },
            playerOptions: {
              watermark: EluvioPlayerParameters.watermark.OFF,
              muted: EluvioPlayerParameters.muted.OFF,
              autoplay: EluvioPlayerParameters.autoplay.ON,
              controls: EluvioPlayerParameters.controls.AUTO_HIDE
            }
          }
        }
      />
    );
  }

  render() {
    const promoLinks = this.props.siteStore.promos;

    let nextButton, previousButton;
    if(this.props.siteStore.promos && this.props.siteStore.promos.length > 1) {
      previousButton = (
        <button
          className="btn previous-promo-button"
          disabled={this.state.promoIndex <= 0}
          onClick={() => this.setState({promoIndex: this.state.promoIndex - 1})}
        >
          Play Previous
        </button>
      );

      nextButton = (
        <button
          className="btn next-promo-button"
          disabled={this.state.promoIndex >= promoLinks.length - 1}
          onClick={() => this.setState({promoIndex: this.state.promoIndex + 1})}
        >
          Play Next
        </button>
      );
    }

    return (
      <div className="promo-player-container">
        <div className="promo-player-ar">
          { this.Video(promoLinks[this.state.promoIndex]) }
          {
            !previousButton && !nextButton ? null :
              <div className="promo-buttons-container">
                { previousButton }
                { nextButton }
              </div>
          }
        </div>
      </div>
    );
  }
}

export default ErrorWrapper(PromoPlayer);
