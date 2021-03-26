import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import ErrorHandler from "Common/ErrorHandler";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

import EluvioConfiguration from "EluvioConfiguration";

@inject("siteStore")
@observer
class PromoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      promoIndex: 1,
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

  Video() {
    const promoLink = UrlJoin(this.props.siteStore.currentSiteMetadataPath, "promos", this.state.promoIndex.toString());
    const network = EluvioConfiguration["config-url"].includes("demov3") ? EluvioPlayerParameters.networks.DEMO : EluvioPlayerParameters.networks.MAIN;

    return (
      <div
        className="promo-video"
        ref={element => {
          if(!element) { return; }

          new EluvioPlayer(
            element,
            {
              clientOptions: {
                network,
                client: this.props.siteStore.rootStore.client
              },
              sourceOptions: {
                playoutParameters: {
                  objectId: EluvioConfiguration["live-site-id"],
                  linkPath: promoLink
                  //versionHash: "hq__JZnbcLjgqDps1qvwyTqaWRhR7Vy3P6TySCxEivQ8Hu5ZXs1X7XQUsQBbcBdzpiK7mxfeU2r9Rn"
                }
              },
              playerOptions: {
                watermark: EluvioPlayerParameters.watermark.OFF,
                muted: EluvioPlayerParameters.muted.OFF,
                autoplay: EluvioPlayerParameters.autoplay.ON,
                controls: EluvioPlayerParameters.controls.DEFAULT
              }
            }
          );
        }}
      />
    );
  }

  render() {
    //if(!this.props.siteStore.promos || this.props.siteStore.promos.length === 0) { return null; }

    let nextButton, previousButton;
    if(this.props.siteStore.promos && this.props.siteStore.promos.length > 0) {
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
          disabled={this.state.promoIndex >= this.props.siteStore.promos.length - 1}
          onClick={() => this.setState({promoIndex: this.state.promoIndex + 1})}
        >
          Play Next
        </button>
      );
    }

    return (
      <div className="promo-player-container">
        { this.Video() }
        <div className="promo-buttons-container">
          { previousButton }
          { nextButton }
        </div>
      </div>
    );
  }
}

export default ErrorHandler(PromoPlayer);
