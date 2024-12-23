import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import {InitializeEluvioPlayer, EluvioPlayerParameters} from "@eluvio/elv-player-js/lib/index";
import EluvioConfiguration from "../../../configuration";
import Countdown from "Common/Countdown";
import Modal from "Common/Modal";
import ImageIcon from "Common/ImageIcon";
import UrlJoin from "url-join";
import {RichText} from "Common/Components";
import {Navigate} from "react-router";

const EventPlayer = inject("rootStore")(inject("siteStore")(observer(({
  rootStore,
  siteStore,
  dropIndex,
  dropState,
  streamHash,
  streamOptions,
  requiresTicket,
  OnLoad,
  Reload
}) => {
  const [videoElement, setVideoElement] = useState(0);
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    try {
      if(!videoElement) { return; }

      siteStore.LoadDropStreamOptions({
        dropIndex,
        dropState,
        streamHash,
        requiresTicket
      }).then(playoutParameters => {
        let restarts = 0;
        InitializeEluvioPlayer(
          videoElement,
          {
            clientOptions: {
              network: EluvioConfiguration.network === "demo" ?
                EluvioPlayerParameters.networks.DEMO : EluvioPlayerParameters.networks.MAIN,
              client: rootStore.client
            },
            sourceOptions: {
              playoutParameters
            },
            playerOptions: {
              loop: streamOptions.loop,
              muted: EluvioPlayerParameters.muted.OFF,
              autoplay: EluvioPlayerParameters.autoplay.ON,
              controls: EluvioPlayerParameters.controls.AUTO_HIDE,
              watermark: EluvioPlayerParameters.watermark.OFF,
              playerCallback: () => {
                if(OnLoad) { OnLoad(videoElement); }
              },
              restartCallback: error => {
                // eslint-disable-next-line no-console
                console.error(error);

                restarts += 1;
                if(restarts > 2) {
                  player && player.Destroy();

                  setTimeout(() => Reload(), 5000);
                }
              }
            }
          }
        ).then(player => setPlayer(player));
      });

      window.player = player;

      return () => player && player.Destroy();
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);

      this.setState({error: true});
    }
  }, [videoElement]);

  return (
    <div
      className="drop-page__stream"
      ref={element => {
        if(!streamHash) { return; }

        setVideoElement(element);
      }}
    />
  );
})));

class Drop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerKey: 1,
      localstorageKey: `drop-status-${props.match.params.dropId}`,
      showMessage: true,
      dropInfo: this.Drop()
    };
  }

  async componentDidMount() {
    this.props.siteStore.SetCurrentDropEvent(this.props.match.params.dropId);

    /*
    this.props.rootStore.SetWalletPanelVisibility({
      visibility: "side-panel",
      location: {
        page: "drop",
        params: {
          tenantSlug: this.props.siteStore.currentSiteInfo.marketplace_info.tenant_slug,
          marketplaceSlug: this.props.siteStore.currentSiteInfo.marketplace_info.marketplace_slug,
          eventSlug: this.props.siteStore.siteSlug,
          dropId: this.props.match.params.dropId
        }
      }
    });

     */
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
            <RichText richText={messageInfo.message} className="event-message__content__message" />
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

    const states = ["event_state_preroll", "event_state_main", "event_state_post_vote", "event_state_mint_start", "event_state_event_end"].map(state =>
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
    let streamStateKey = currentState.state;
    if(currentState.use_main_stream) {
      streamState = states.find(state => state.state === "event_state_main");
      streamStateKey = "event_state_main";
    }

    const streamHash = streamState && streamState.stream &&
      ((streamState.stream["/"] && streamState.stream["/"].split("/").find(component => component.startsWith("hq__")) || streamState.stream["."].source));

    const streamOptions = {
      loop: streamState.loop_stream
    };

    return {
      ...drop,
      dropIndex,
      states,
      currentStateIndex,
      streamStateKey,
      streamHash,
      streamOptions
    };
  }

  render() {
    const drop = this.state.dropInfo;

    if(!this.props.rootStore.walletLoggedIn && drop.requires_login) {
      return <Navigate replace to={UrlJoin("/", this.props.siteStore.currentSite.tenantSlug || "", this.props.siteStore.currentSite.siteSlug || "", "drop", this.props.match.params.dropId)} />;
    }

    if(drop.requires_ticket && !this.props.siteStore.currentSiteTicketSku) {
      return <Navigate replace to={this.props.siteStore.SitePath("code")} />;
    }

    const currentState = drop.states[drop.currentStateIndex];
    const nextState = drop.states[drop.currentStateIndex + 1];
    const { streamHash, streamOptions } = this.state.dropInfo;

    return (
      <>
        <div className="page-container drop-page">
          { this.Message() }
          <div className="main-content-container drop-page__content">
            <EventPlayer
              key={`event-player-${streamHash}-${this.state.playerKey}`}
              dropIndex={drop.dropIndex}
              dropState={drop.streamStateKey}
              streamHash={streamHash}
              streamOptions={streamOptions}
              requiresTicket={drop.requires_ticket}
              Reload={() => this.setState({playerKey: this.state.playerKey + 1})}
              OnLoad={videoElement => {
                this.props.rootStore.SetDefaultWalletState({
                  ...this.props.rootStore.defaultWalletState,
                  video: !videoElement ? null : {
                    element: videoElement.getElementsByTagName("video")[0],
                    playing: !videoElement.paused
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
      </>
    );
  }
}

export default inject("rootStore")(inject("siteStore")(observer(Drop)));
