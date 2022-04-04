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

    const pages = [];

    this.props.siteStore.currentSiteInfo.event_info_modals.forEach((section, sectionIndex) =>
      section.pages.forEach((page, pageIndex) => {
        pages.push({sectionIndex, pageIndex});
      })
    );

    this.state = {
      page: props.initialSection ? pages.findIndex(pageInfo => props.initialSection === pageInfo.sectionIndex) : 0,
      pages
    };
  }

  CurrentPage() {
    const { sectionIndex, pageIndex } = this.state.pages[this.state.page];
    return this.props.siteStore.currentSiteInfo.event_info_modals[sectionIndex].pages[pageIndex];
  }

  SetPage(page) {
    this.setState({page});

    document.querySelector(".modal__content").scrollTo({ top: 0, behavior: "smooth" });
  }

  PageControls() {
    let leftArrow, rightArrow, rightText;

    const textColor = this.CurrentPage().text_color.color || "#000000";

    if(this.state.page > 0) {
      leftArrow = (
        <button
          style={{color: textColor}}
          className="arrow-left"
          onClick={() => this.SetPage(this.state.page - 1)}
        >
          <LeftArrow color={textColor} />
        </button>
      );
    }

    if(this.state.page < this.state.pages.length - 1) {
      rightArrow = (
        <button
          style={{color: textColor}}
          className="arrow-right"
          onClick={() => this.SetPage(this.state.page + 1)}
        >
          <RightArrow color={textColor} />
        </button>
      );

      const nextPage = this.state.pages[this.state.page + 1];
      if(nextPage) {
        const nextPageInfo = this.props.siteStore.currentSiteInfo.event_info_modals[nextPage.sectionIndex].pages[nextPage.pageIndex];

        if(nextPageInfo.page_title) {
          rightText = (
            <button
              style={{color: textColor}}
              className="arrow-right-text"
              onClick={() => this.SetPage(this.state.page + 1)}
            >
              { nextPageInfo.page_title }
            </button>
          );
        }
      }
    }

    const title = this.CurrentPage().page_title || "";

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
    const { page_title, image, video } = this.CurrentPage();
    const { sectionIndex, pageIndex } = this.state.pages[this.state.page];

    if(image) {
      const imagePath = image["."] && image["."]["/"];
      return (
        <ImageIcon
          key={`info-modal-image-${imagePath}`}
          className="event-info-modal__image event-info-modal__image-active"
          icon={image.url}
          label={page_title}
        />
      );
    } else if(video) {
      const linkPath = this.props.siteStore.LocalizedSitePath(UrlJoin("info", "event_info_modals", sectionIndex.toString(), "pages", pageIndex.toString(), "video", "sources", "default"));
      const videoHash = video["."] && video["."].source;

      return (
        <Player
          key={`info-modal-player-${videoHash}`}
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
                  linkPath
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
    } else {
      return null;
    }
  }

  render() {
    if(!this.state.pages || this.state.pages.length === 0) {
      return null;
    }

    const { text, text_color, background_color, image, video } = this.CurrentPage();
    const textColor = text_color.color || "#000000";
    const backgroundColor = background_color.color || "#FFFFFF";

    return (
      <Modal Toggle={this.props.Close} className="event-info-modal-modal">
        <div
          style={{backgroundColor, color: textColor, "*": { backgroundColor, color: `${textColor} !important` }}}
          className={`event-info-modal ${this.props.small ? "event-info-modal-small" : ""} ${!image && !video ? "event-info-modal-no-image" : ""}`}
        >
          <div className="event-info-modal__image-container">
            { this.MediaSection() }
          </div>
          { this.PageControls() }
          <div className="event-info-modal__text-container" style={{backgroundColor, color: textColor}}>
            <div
              className="event-info-modal__markdown markdown-document"
              ref={element => {
                if(!element) { return; }

                render(
                  <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                    { SanitizeHTML(text) }
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
      section: 0
    };

    this.ToggleModal = this.ToggleModal.bind(this);
  }

  ToggleModal(showModal=false, section=0) {
    this.setState({
      showModal,
      section
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
            eventInfoModals.map((page, section) =>
              <button
                key={`description-button-${section}`}
                className="btn event-description__button"
                onClick={() => this.ToggleModal(true, section)}
              >
                { page.button_text }
              </button>
            )
          }
        </div>

        { this.state.showModal ? <EventInfoModal initialSection={this.state.section} Close={this.ToggleModal} /> : null }
      </div>
    );
  }
}

export default EventInfoButtons;
