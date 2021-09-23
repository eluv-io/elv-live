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
import {Redirect} from "react-router";

const EventPlayer = ({client, streamHash, streamOptions, OnLoad}) => {
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

      if(OnLoad) {
        OnLoad(videoElement);
      }

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
      localstorageKey: `drop-status-${props.match.params.dropId}`,
      showMessage: true,
      dropInfo: this.Drop()
    };
  }

  async componentDidMount() {
    this.props.siteStore.SetCurrentDropEvent(this.props.match.params.dropId);

    this.props.rootStore.SetDefaultWalletState({
      visibility: "side-panel",
      location: {
        page: "drop",
        params: {
          marketplaceId: this.props.siteStore.currentSiteInfo.marketplaceId,
          dropId: this.props.match.params.dropId
        }
      }
    });

    this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState);
  }

  componentWillUnmount() {
    this.props.rootStore.ResetDefaultWalletState();
    this.props.rootStore.SetWalletPanelVisibility(this.props.rootStore.defaultWalletState);
  }

  StoredState() {
    try {
      return JSON.parse(localStorage.getItem(this.state.localstorageKey)) || {};
    // eslint-disable-next-line no-empty
    } catch(_) {}

    return {};
  }

  Message() {
    const drop = this.state.dropInfo;

    if(!this.state.showMessage || this.StoredState()[drop.currentStateIndex]) { return null; }

    const currentState = drop.states[drop.currentStateIndex];

    const messageInfo = currentState.modal_message;

    if(!messageInfo || !messageInfo.show) { return null; }

    const CloseModal = () => {
      this.setState({showMessage: false});

      localStorage.setItem(
        this.state.localstorageKey,
        JSON.stringify({
          ...this.StoredState(),
          [drop.currentStateIndex]: true
        })
      );
    };

    return (
      <Modal
        className="event-message-container"
        Toggle={CloseModal}
      >
        <div className="event-message">
          <div className="event-message__content">
            {
              !messageInfo.image ? null:
                <ImageIcon
                  className="event-message__content__image"
                  title={drop.event_header}
                  icon={this.props.siteStore.SiteUrl(UrlJoin("info", "drops", drop.dropIndex.toString(), currentState.state, "modal_message", "image"))}
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
            <button
              onClick={CloseModal}
              className="event-message__button"
            >
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

    const states = ["event_state_preroll", "event_state_main", "event_state_post_vote", "event_state_mint_start"].map(state =>
      (state === "event_state_main" || drop[state].use_state) ? { state, ...drop[state] } : null
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
    if(!this.props.rootStore.walletLoggedIn) {
      return <Redirect to={UrlJoin("/", this.props.siteStore.currentSite.tenantSlug || "", this.props.siteStore.currentSite.siteSlug || "", "drop", this.props.match.params.dropId)} />;
    }

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
            OnLoad={videoElement => {
              this.props.rootStore.SetDefaultWalletState({
                visibility: "side-panel",
                location: {
                  page: "drop",
                  params: {
                    marketplaceId: this.props.siteStore.currentSiteInfo.marketplaceId,
                    dropId: this.props.match.params.dropId
                  }
                },
                video: !videoElement ? null : {
                  element: videoElement.getElementsByTagName("video")[0],
                  muted: videoElement.muted
                }
              });
            }}
          />
          <div className="drop-page__info">
            <div className="drop-page__info__headers">
              <h1 className="drop-page__info__header">{ currentState.header }</h1>
              { currentState.subheader ? <h2 className="drop-page__info__subheader">{ currentState.subheader }</h2> : null }
            </div>
            {
              nextState ?
                <Countdown
                  key={`event-state-countdown-${currentState.state}`}
                  time={nextState.start_date}
                  OnEnded={() =>
                    this.setState({
                      showMessage: true,
                      dropInfo: this.Drop()
                    })
                  }
                  Render={({diff, countdown}) => (
                    currentState.show_countdown ?
                      <div className="drop-page__info__subheader drop-page__info__countdown">
                        {
                          diff > 0 ?
                            `${countdown} left!` :
                            "Drop has ended!"
                        }
                      </div> :
                      <div className="drop-page__info__countdown" />
                  )}
                /> : <div className="drop-page__info__countdown" />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Drop;
