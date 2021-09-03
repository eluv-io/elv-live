import React from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import EluvioConfiguration from "../../../configuration";
import Countdown from "Common/Countdown";
import Modal from "Common/Modal";
import ImageIcon from "Common/ImageIcon";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import UrlJoin from "url-join";

@inject("rootStore")
@inject("siteStore")
@observer
class Drop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      showMessage: true,
      ended: false
    };

    this.InitializeStream = this.InitializeStream.bind(this);
  }

  async componentDidMount() {
    this.props.rootStore.walletClient.ToggleNavigation(false);
    await this.props.rootStore.walletClient.Navigate({
      page: "drop",
      params: {
        marketplaceId: this.props.siteStore.currentSiteInfo.marketplaceId,
        dropId: this.props.match.params.dropId
      }
    });

    this.props.rootStore.SetWalletPanelVisibility("side-panel");
  }

  componentWillUnmount() {
    this.props.rootStore.SetWalletPanelVisibility("hidden");
  }

  Message() {
    if(!this.state.showMessage) { return null; }

    const drop = this.Drop();

    let key = "modal_message_start";
    if(this.state.ended) {
      key = "modal_message_end";
    }

    const messageInfo = drop[key];

    if(!messageInfo || !messageInfo.show) { return null; }

    return (
      <Modal
        className="event-message-container"
        Toggle={() => this.setState({showMessage: false})}
      >
        <div className="event-message">
          <div className="event-message__content">
            {
              !messageInfo.image ? null:
                <ImageIcon
                  className="event-message__content__image"
                  title={drop.event_header}
                  icon={this.props.siteStore.SiteUrl(UrlJoin("info", "drops", drop.dropIndex.toString(), key, "image"))}
                />
            }
            <div
              className="event-message__content__message"
              ref={element => {
                if(!element) { return; }

                render(
                  <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                    { SanitizeHTML(messageInfo.message) }
                  </ReactMarkdown>,
                  element
                );
              }}
            />
          </div>
          <div className="event-message__actions">
            <button onClick={() => this.setState({showMessage: false})} className="event-message__button">
              OK
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  Drop() {
    let dropIndex = this.props.siteStore.currentSiteInfo.drops.findIndex(drop => drop.uuid === this.props.match.params.dropId);
    let drop = this.props.siteStore.currentSiteInfo.drops[dropIndex];

    return {
      ...drop,
      dropIndex
    };
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
            muted: EluvioPlayerParameters.muted.OFF,
            autoplay: EluvioPlayerParameters.autoplay.ON,
            controls: EluvioPlayerParameters.controls.AUTO_HIDE,
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
        { this.Message() }
        <div className="main-content-container drop-page__content wallet-panel-page-content">
          <div className="drop-page__stream" ref={this.InitializeStream} />
          <div className="drop-page__info">
            <h1 className="drop-page__info__header">{ this.Drop().event_header }</h1>
            <Countdown
              time={this.Drop().end_date}
              OnEnded={() => {
                this.setState({
                  ended: true,
                  showMessage: true
                });
              }}
              Render={({diff, countdown}) => (
                <div className="drop-page__info__subheader drop-page__info__countdown">
                  {
                    diff > 0 ?
                      `${countdown} left!` :
                      "Drop has ended!"
                  }
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Drop;
