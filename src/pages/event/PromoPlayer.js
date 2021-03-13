import React from "react";
import {inject, observer} from "mobx-react";

import {toJS} from "mobx";

import ErrorHandler from "Common/ErrorHandler";
import BitmovinPlayer from "Common/BitmovinPlayer";

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
        <BitmovinPlayer playoutOptions={toJS(this.props.siteStore.promos[this.state.promoIndex].playoutOptions)} autoPlay />
        <div className="promo-buttons-container">
          { previousButton }
          { nextButton }
        </div>
      </div>
    );
  }
}

export default ErrorHandler(PromoPlayer);
