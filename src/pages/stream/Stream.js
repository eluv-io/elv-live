import React from "react";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import {NavLink, Redirect} from "react-router-dom";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

import Logo from "Images/logo/whiteEluvioLiveLogo.svg";
import ChatIcon from "Assets/icons/chat icon simple.svg";
import LiveChat from "Stream/components/LiveChat";
import {ToggleZendesk} from "Utils/Misc";
import EluvioConfiguration from "../../../configuration";

@inject("siteStore")
@observer
class Stream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1,
      showChat: false,
      initialized: false,
      versionHash: undefined,
      streamURI: undefined,
      streamRequestFailed: false,
      error: false
    };
  }

  async componentDidMount() {
    ToggleZendesk(false);
  }

  componentWillUnmount() {
    ToggleZendesk(true);
  }

  async InitializeVideo(element) {
    try {
      if(this.state.initialized || !element) { return; }


      this.setState({initialized: true});

      const versionHashPromise = this.props.siteStore.StreamHash();
      const uriPromise = this.props.siteStore.LoadStreamURI();

      this.setState({
        versionHash: await versionHashPromise,
        streamURI: await uriPromise
      });

      new EluvioPlayer(
        element,
        {
          clientOptions: {
            network: EluvioConfiguration["config-url"].includes("main.net955305") ?
              EluvioPlayerParameters.networks.MAIN : EluvioPlayerParameters.networks.DEMO,
            client: this.props.siteStore.client
          },
          sourceOptions: {
            playoutParameters: {
              offeringURI: this.state.streamURI
            }
          },
          playerOptions: {
            muted: true,
            autoplay: EluvioPlayerParameters.autoplay.ON,
            controls: EluvioPlayerParameters.controls.AUTO_HIDE,
            watermark: EluvioPlayerParameters.watermark.OFF,
            restartCallback: async () => {
              // Player wants to restart because of errors - check if the main site has been updated since playback has started
              // If so, reload the whole page to re-fetch the channel info
              const client = this.props.siteStore.rootStore.client;
              const latestHash = await this.props.siteStore.StreamHash();

              if(!client.utils.EqualHash(this.state.versionHash, latestHash)) {
                this.setState({
                  initialized: false,
                  key: this.state.key + 1
                });

                // Tell player to abort
                return true;
              }

              // Some other issue. Let player try to restart
            }
          }
        }
      );
    } catch(error) {
      console.error(error);

      this.setState({error: true});
    }
  }

  Sponsors() {
    return (
      this.props.siteStore.sponsors.map((sponsor, index) =>
        <a href={sponsor.link} target="_blank" rel="noopener" className="stream-page__footer__sponsor-link" key={`sponsor-${index}`} title={sponsor.name}>
          <img src={sponsor.light_image_url || sponsor.image_url} className="stream-page__footer__sponsor-image" alt={sponsor.name} />
        </a>
      )
    );
  }

  render() {
    if(!this.props.siteStore.currentSiteTicket) {
      return <Redirect to={this.props.siteStore.SitePath("code")} />;
    }

    return (
      <div className={`page-container stream-page ${this.state.showChat ? "stream-page-chat-visible" : "stream-page-chat-hidden"}`}>
        <div className="stream-page__main">
          <div className="stream-page__header">
            <NavLink to={this.props.siteStore.baseSitePath} className="stream-page__header__logo">
              <ImageIcon icon={Logo} label="Eluvio Live" />
            </NavLink>
            <button className={`stream-page__header__chat-toggle stream-page__header__chat-toggle-${this.state.showChat ? "hide" : "show"}`} onClick={() => this.setState({showChat: !this.state.showChat})}>
              <ImageIcon icon={ChatIcon} label={this.state.showChat ? "hide" : "show"} />
            </button>
          </div>
          <div className="stream-page__video-container" key={`video-container-${this.state.key}`}>
            <div className="stream-page__video-target" ref={element => this.InitializeVideo(element)} />
            {
              !this.state.error ? null :
                <div className="stream-page__error-container">
                  <div className="stream-page__error-container__message">
                    We're sorry, something went wrong. Please try reloading the page.
                  </div>
                  <button className="stream-page__error-container__reload-button" onClick={() => window.location.replace(window.location.href) }>
                    Reload
                  </button>
                </div>
            }
          </div>
          <div className="stream-page__footer">
            <div className="stream-page__footer__text">
              <h2 className="stream-page__footer__subtitle">
                { this.props.siteStore.streamPageInfo.subheader }
              </h2>
              <h1 className="stream-page__footer__title">
                { this.props.siteStore.streamPageInfo.header }
              </h1>
            </div>
            <div className="stream-page__footer__sponsors">
              { this.Sponsors() }
            </div>
          </div>
        </div>
        <div className={`stream-page__chat-panel ${this.state.showChat ? "stream-page__chat-panel-visible" : "stream-page__chat-panel-hidden"}`}>
          <div className="stream-page__chat-panel__header">
            <h2 className="stream-page__chat-panel__header-text">{ this.props.siteStore.streamPageInfo.header }</h2>
          </div>
          <LiveChat />
        </div>
      </div>
    );
  }
}

export default Stream;
