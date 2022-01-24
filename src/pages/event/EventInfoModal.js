import React from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";

import ImageIcon from "Common/ImageIcon";
import Modal from "Common/Modal";
import EluvioConfiguration from "EluvioConfiguration";
import {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import UrlJoin from "url-join";
import ReactMarkdown from "react-markdown";
import Player from "Common/Player";
import SanitizeHTML from "sanitize-html";

const LeftArrow = ({color}) => (
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.96 159.09">
    <defs>
      <style>{ `.info-modal-arrow{fill:none;stroke:${color}!important;stroke-linecap:square;stroke-miterlimit:10;stroke-width:13px;` }</style>
    </defs>
    <polyline className="info-modal-arrow" points="79.32 149.9 9.19 79.77 79.77 9.19"/>
  </svg>
);

const RightArrow = ({color}) => (
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.96 159.09">
    <defs>
      <style>{ `.info-modal-arrow{fill:none;stroke:${color}!important;stroke-linecap:square;stroke-miterlimit:10;stroke-width:13px;` }</style>
    </defs>
    <polyline className="info-modal-arrow" points="9.64 9.19 79.77 79.32 9.19 149.9"/>
  </svg>
);

@inject("siteStore")
@observer
class EventInfoModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMedia: 0,
      previousMedia: undefined
    };
  }

  Media() {
    return this.props.siteStore.currentSiteInfo.event_info_modals[this.props.index].media || [];
  }

  ChangeMedia(page) {
    const media = this.Media();

    this.setState({
      selectedMedia: page % media.length,
      previousMedia: this.state.selectedMedia
    }, () => setTimeout(() => this.setState({previousMedia: undefined}), 1500));
  }

  MediaControls() {
    let leftArrow, rightArrow, rightText;

    const pageInfo = this.props.siteStore.currentSiteInfo.event_info_modals[this.props.index];
    const textColor = pageInfo.text_color.color;

    if(this.state.selectedMedia > 0) {
      leftArrow = (
        <button
          style={{color: textColor}}
          className="arrow-left"
          onClick={() => this.ChangeMedia(this.state.selectedMedia - 1)}
        >
          <LeftArrow color={textColor} />
        </button>
      );
    }

    if(this.state.selectedMedia < this.Media().length - 1) {
      rightArrow = (
        <button
          style={{color: textColor}}
          className="arrow-right"
          onClick={() => this.ChangeMedia(this.state.selectedMedia + 1)}
        >
          <RightArrow color={textColor} />
        </button>
      );

      const nextTitle = (this.Media()[this.state.selectedMedia + 1] || {}).label || "";
      if(nextTitle) {
        rightText = (
          <button
            style={{color: textColor}}
            className="arrow-right-text"
            onClick={() => this.ChangeMedia(this.state.selectedMedia + 1)}
          >
            View { nextTitle }
          </button>
        );
      }
    }

    const title = (this.Media()[this.state.selectedMedia] || {}).label || "";

    return (
      <div className="event-info-modal__image-controls">
        { leftArrow }
        <h3 className="event-info-modal__image-controls-title">
          { title }
        </h3>
        { rightText }
        { rightArrow }
      </div>
    );
  }

  MediaSection() {
    if(this.Media().length === 0) {
      return null;
    }

    return this.Media().map(({label, image}, index) =>
      image ?
        <ImageIcon
          key={`card-image-${index}`}
          className={`event-info-modal__image ${index === this.state.selectedMedia ? "event-info-modal__image-active" : ""} ${index === this.state.previousMedia ? "event-info-modal__image-fading-out" : ""}`}
          icon={image.url}
          label={label}
        /> :
        index !== this.state.selectedMedia ? null :
          <Player
            className="event-info-modal__video"
            params={
              {
                clientOptions: {
                  client: this.props.siteStore.rootStore.client
                },
                sourceOptions: {
                  drms: [
                    "clear",
                    "aes-128",
                    "sample-aes",
                    "widevine"
                  ],
                  playoutParameters: {
                    objectId: EluvioConfiguration["live-site-id"],
                    linkPath: this.props.siteStore.LocalizedSitePath(UrlJoin("info", "event_info_modals", this.props.index.toString(), "media", index.toString(), "video", "sources", "default")),
                  }
                },
                playerOptions: {
                  watermark: EluvioPlayerParameters.watermark.OFF,
                  muted: EluvioPlayerParameters.muted.OFF,
                  autoplay: EluvioPlayerParameters.autoplay.ON,
                  controls: EluvioPlayerParameters.controls.AUTO_HIDE
                }
              }
            }
          />
    );
  }

  render() {
    const pageInfo = this.props.siteStore.currentSiteInfo.event_info_modals[this.props.index];
    const textColor = pageInfo.text_color.color;
    const backgroundColor = pageInfo.background_color.color;

    return (
      <Modal Toggle={this.props.Close}>
        <div
          style={{backgroundColor, color: textColor, "*": { backgroundColor, color: `${textColor} !important` }}}
          className={`event-info-modal ${this.props.small ? "event-info-modal-small" : ""} ${this.Media().length === 0 ? "event-info-modal-no-image" : ""}`}
        >
          <div className="event-info-modal__image-container">
            { this.MediaSection() }
          </div>
          { this.MediaControls() }
          <div className="event-info-modal__text-container">
            <div
              style={{backgroundColor, color: textColor}}
              className="event-info-modal__markdown markdown-document"
              ref={element => {
                if(!element) { return; }

                render(
                  <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                    { SanitizeHTML(pageInfo.text) }
                  </ReactMarkdown>,
                  element
                );
              }}
            >
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

@inject("siteStore")
@observer
class EventInfoButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      index: 0
    };

    this.ToggleModal = this.ToggleModal.bind(this);
  }

  ToggleModal(showModal=false, index=0) {
    this.setState({
      showModal,
      index
    });
  }

  render() {
    const eventInfoModals = this.props.siteStore.currentSiteInfo.event_info_modals;

    if(!eventInfoModals || eventInfoModals.length === 0) {
      return null;
    }

    return (
      <div className="event-description">
        <div className="event-description__buttons">
          {
            eventInfoModals.map((page, index) =>
              <button
                key={`description-button-${index}`}
                className="btn event-description__button"
                onClick={() => this.ToggleModal(true, index)}
              >
                { page.button_text }
              </button>
            )
          }
        </div>

        { this.state.showModal ? <EventInfoModal index={this.state.index} Close={this.ToggleModal} /> : null }
      </div>
    );
  }
}

export default EventInfoButtons;
