import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

import Copy from "Assets/copy/Main.yaml";
import CardModal from "Pages/main/components/CardModal";
import Modal from "Common/Modal";

@inject("mainStore")
@observer
class FeatureBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      video: undefined,
      videoShouldPlay: true
    };
  }

  ToggleModal(show) {
    this.setState({
      showModal: show
    });

    if(this.state.video) {
      this.setState({videoShouldPlay: !this.state.video.paused});

      this.state.video.pause();
    }

    this.props.mainStore.ToggleFeatureBlockModal(show);
  }

  render() {
    const copy = Copy.main[this.props.copyKey];

    const imageUrl = this.props.mainStore.MainSiteUrl(UrlJoin("images", this.props.copyKey, "main_image"));

    let media = <div className="feature-block__video" />;
    let attribution;
    if(!this.props.promoVideo) {
      media = <img src={imageUrl} alt={copy.header} className="feature-block__image" />;
    } else if(this.props.mainStore.promoPlayoutParameters[0]) {
      if(copy.attribution) {
        attribution = <div className="feature-block__attribution">{ copy.attribution }</div>;
      }

      media = (
        <div
          className="feature-block__video"
          ref={element => {
            console.log("ELEMENT");
            if(!element || this.state.player) { return; }

            this.setState({
              player: (
                new EluvioPlayer(
                  element,
                  {
                    clientOptions: {
                      client: this.props.mainStore.rootStore.client
                    },
                    sourceOptions: {
                      playoutParameters: this.props.mainStore.promoPlayoutParameters[0]
                    },
                    playerOptions: {
                      watermark: EluvioPlayerParameters.watermark.OFF,
                      muted: EluvioPlayerParameters.muted.ON,
                      autoplay: EluvioPlayerParameters.autoplay.WHEN_VISIBLE,
                      controls: EluvioPlayerParameters.controls.DEFAULT,
                      loop: EluvioPlayerParameters.loop.ON,
                      playerCallback: ({videoElement, hlsPlayer}) => {
                        console.log("INIT", videoElement, hlsPlayer);
                        this.setState({video: videoElement});
                      }
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
            <Modal
              Toggle={() => {
                this.ToggleModal(false);

                if(this.state.video && this.state.videoShouldPlay) {
                  this.state.video.play();
                }
              }}
            >
              <CardModal copyKey={this.props.copyKey} />
            </Modal> :
            null
        }
        <div className={`feature-block feature-block-${this.props.copyKey} scroll-block`} id={`scroll-block-${this.props.copyKey}`}>
          <div className="feature-block__image-container">
            { media }
            { attribution }
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
