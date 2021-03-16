import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

import Copy from "../copy/Copy.yaml";
import CardModal from "Pages/main/components/CardModal";
import Modal from "Common/Modal";

@inject("mainStore")
@observer
class FeatureBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  ToggleModal(show) {
    this.setState({
      showModal: show
    });

    this.props.mainStore.ToggleFeatureBlockModal(show);
  }

  render() {
    const copy = Copy.main[this.props.copyKey];

    const imageUrl = this.props.mainStore.MainSiteUrl(UrlJoin("images", this.props.copyKey, "main_image"));

    let media = <div className="feature-block__video" />;
    if(!this.props.promoVideo) {
      media = <img src={imageUrl} alt={copy.header} className="feature-block__image" />;
    } else if(this.props.mainStore.promoPlayoutOptions[0]) {
      media = (
        <div
          className="feature-block__video"
          ref={element => {
            if(!element || this.state.player) { return; }

            this.setState({
              player: (
                new EluvioPlayer(
                  element,
                  {
                    clientOptions: {
                      network: EluvioPlayerParameters.networks.DEMO,
                      client: this.props.mainStore.rootStore.client
                    },
                    sourceOptions: {
                      playoutOptions: this.props.mainStore.promoPlayoutOptions[0]
                    },
                    playerOptions: {
                      watermark: EluvioPlayerParameters.watermark.OFF,
                      muted: EluvioPlayerParameters.muted.ON,
                      autoplay: EluvioPlayerParameters.autoplay.WHEN_VISIBLE,
                      controls: EluvioPlayerParameters.controls.DEFAULT,
                      loop: EluvioPlayerParameters.loop.ON
                    }
                  }
                )
              )
            });
          }}
        />
      );
    }

    return (
      <>
        {
          this.state.showModal ?
            <Modal Toggle={() => this.ToggleModal(false)}>
              <CardModal copyKey={this.props.copyKey} />
            </Modal> :
            null
        }
        <div className={`feature-block feature-block-${this.props.copyKey} scroll-block`} id={`scroll-block-${this.props.copyKey}`}>
          <div className="feature-block__image-container">
            { media }
          </div>
          <div className="feature-block__text-container">
            <h2 className="feature-block__header">{ copy.header }</h2>
            <h3 className="feature-block__subheader">{ copy.subheader }</h3>
            <div className="feature-block__text">{ copy.text }</div>
          </div>
          <div className="feature-block__actions">
            <button
              className="feature-block__action"
              onClick={() => this.ToggleModal(true)}
            >
              Learn More
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default FeatureBlock;
