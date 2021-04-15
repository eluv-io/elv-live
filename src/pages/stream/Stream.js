import React from "react";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import {NavLink, Redirect} from "react-router-dom";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";

import Logo from "Images/logo/whiteEluvioLiveLogo.svg";
import ChatOpen from "Assets/icons/chat icon.svg";
import ChatClose from "Assets/icons/chat icon collapse.svg";
import LiveChat from "Stream/components/LiveChat";

@inject("siteStore")
@observer
class Stream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showChat: true,
      initialized: false,
      streamURI: undefined,
      streamRequestFailed: false
    };
  }

  async componentDidMount() {
    if(document.getElementById("launcher")) {
      document.getElementById("launcher").style.display = "none";
    }

    try {
      const streamURI = await this.props.siteStore.LoadStreamURI();
      this.setState({
        streamURI,
        streamRequestFailed: !streamURI
      });
    } catch(error) {
      console.error(error);
      this.setState({streamRequestFailed: true});
    }
  }

  componentWillUnmount() {
    if(document.getElementById("launcher")) {
      document.getElementById("launcher").style.display = "";
    }
  }

  InitializeVideo(element) {
    if(this.state.initialized || !this.state.streamURI || !element) { return; }

    new EluvioPlayer(
      element,
      {
        clientOptions: {
          network: EluvioPlayerParameters.networks.DEMO,
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
          watermark: EluvioPlayerParameters.watermark.OFF
        }
      }
    );

    this.setState({initialized: true});
  }

  Sponsors() {
    return (
      this.props.siteStore.sponsors.map((sponsor, index) =>
        <a href={sponsor.link} target="_blank" rel="noopener" className="stream-page__footer__sponsor-link" key={`sponsor-${index}`} title={sponsor.name}>
          <img src={sponsor.image_url} className="stream-page__footer__sponsor-image" alt={sponsor.name} />
        </a>
      )
    );
  }

  render() {
    if(!this.props.siteStore.currentSiteTicket || this.state.streamRequestFailed) {
      return <Redirect to={this.props.siteStore.SitePath("code")} />;
    }

    return (
      <div className={`page-container stream-page ${this.state.showChat ? "stream-page-chat-visible" : "stream-page-chat-hidden"}`}>
        <div className="stream-page__main">
          <div className="stream-page__header">
            <NavLink to={this.props.siteStore.baseSitePath} className="stream-page__header__logo">
              <ImageIcon icon={Logo} label="Eluvio Live" />
            </NavLink>
            {
              this.state.showChat ?
                <button className="stream-page__header__chat-toggle stream-page__header__chat-toggle-hide" onClick={() => this.setState({showChat: !this.state.showChat})}>
                  <ImageIcon icon={ChatClose} label="Hide Chat" />
                </button> :
                <button className="stream-page__header__chat-toggle stream-page__header__chat-toggle-show" onClick={() => this.setState({showChat: !this.state.showChat})}>
                  <ImageIcon icon={ChatOpen} label="Show Chat" />
                </button>
            }
          </div>
          <div className="stream-page__video-container">
            <div className="stream-page__video-target" ref={element => this.InitializeVideo(element)} />
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
