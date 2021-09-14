import React, {useState, useEffect} from "react";
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

const START = Date.now();

const EventPlayer = ({client, streamHash, streamOptions}) => {
  const [key, setKey] = useState(0);
  const [videoElement, setVideoElement] = useState(0);
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    try {
      if(!videoElement) { return; }

      if(player) {
        player.Destroy();
      }

      setPlayer(
        new EluvioPlayer(
          videoElement,
          {
            clientOptions: {
              network: EluvioConfiguration["config-url"].includes("main.net955305") ?
                EluvioPlayerParameters.networks.MAIN : EluvioPlayerParameters.networks.DEMO,
              client: client
            },
            sourceOptions: {
              playoutParameters: {
                versionHash: streamHash
              }
            },
            playerOptions: {
              loop: streamOptions.loop,
              muted: EluvioPlayerParameters.muted.OFF,
              autoplay: EluvioPlayerParameters.autoplay.ON,
              controls: EluvioPlayerParameters.controls.AUTO_HIDE,
              watermark: EluvioPlayerParameters.watermark.OFF,
              errorCallback: error => {
                // eslint-disable-next-line no-console
                console.error(error);

                setTimeout(() => {
                  player && player.Destroy();
                  setVideoElement(undefined);
                  setKey(key + 1);
                }, 5000);
              }
            }
          }
        )
      );

      window.player = player;

      return () => player && player.Destroy();
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);

      this.setState({error: true});
    }
  }, [key, videoElement]);

  return (
    <div
      className="drop-page__stream"
      ref={element => {
        setVideoElement(element);
      }}
    />
  );
};

@inject("rootStore")
@inject("siteStore")
@observer
class Drop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      showMessage: true,
      dropInfo: this.Drop()
    };
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

    const states = ["event_state_preroll", "event_state_main", "event_state_post_vote", "event_state_mint_start"].map((state, stateIndex) =>
      (state === "event_state_main" || drop[state].use_state) ? { state, ...drop[state], start_date: new Date(START + 25 * 1000 * (stateIndex)) } : null
    ).filter(state => state);

    let currentStateIndex = states.map((state, index) => Date.now() > new Date(state.start_date) ? index : null)
      .filter(active => active)
      .slice(-1)[0];

    if(typeof currentStateIndex === "undefined") {
      currentStateIndex = 0;
    }

    const currentState = states[currentStateIndex];
    let streamState = currentState;
    if(currentState.use_main_stream) {
      streamState = states.find(state => state.state === "event_state_main");
    }

    const streamHash = streamState && streamState.stream && streamState.stream["."].source;
    const streamOptions = {
      loop: streamState.loop_stream
    };

    return {
      ...drop,
      dropIndex,
      states,
      currentStateIndex,
      streamHash,
      streamOptions
    };
  }

  render() {
    const drop = this.state.dropInfo;
    const currentState = drop.states[drop.currentStateIndex];
    const nextState = drop.states[drop.currentStateIndex + 1];
    const { streamHash, streamOptions } = this.state.dropInfo;

    return (
      <div className="page-container drop-page">
        { this.Message() }
        <div className="main-content-container drop-page__content wallet-panel-page-content">
          <EventPlayer
            key={`event-player-${streamHash}`}
            client={this.props.rootStore.client}
            streamHash={streamHash}
            streamOptions={streamOptions}
          />
          <div className="drop-page__info">
            <h1 className="drop-page__info__header">{ currentState.header }</h1>
            {
              nextState ?
                <Countdown
                  key={`event-state-countdown-${currentState.state}`}
                  time={nextState.start_date}
                  OnEnded={() =>
                    this.setState({
                      initialized: false,
                      showMessage: true,
                      dropInfo: this.Drop()
                    })
                  }
                  Render={({diff, countdown}) => (
                    <div className="drop-page__info__subheader drop-page__info__countdown">
                      {
                        diff > 0 ?
                          `${countdown} left!` :
                          "Drop has ended!"
                      }
                    </div>
                  )}
                /> : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Drop;
