import React from "react";
import {inject, observer} from "mobx-react";
import UrlJoin from "url-join";

import Modal from "Common/Modal";

import LeftArrow from "Assets/icons/left-arrow.svg";
import RightArrow from "Assets/icons/right-arrow.svg";
import ImageIcon from "Common/ImageIcon";
import {RichText} from "Common/Components";

class EventDescriptionsModalClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      section: props.section,
      page: props.page
    };
  }

  componentDidMount() {
    document.body.style.overflowY = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflowY = "auto";
  }

  Markdown(content) {
    return (
      <RichText richText={content} className="event-description-modal__markdown markdown-document" />
    );
  }

  // Determine the next valid page - paging can cross sections
  AdjacentPages() {
    const section = this.props.siteStore.currentSiteInfo.event_descriptions[this.state.section];

    // A valid section is a section with at least one page defined
    const validSections = this.props.siteStore.currentSiteInfo.event_descriptions
      .map((section, index) => section.pages.length > 0 ? index : undefined)
      .filter(index => typeof index !== "undefined");

    let previousPage, nextPage;
    if(this.state.page > 0) {
      previousPage = { section: this.state.section, page: this.state.page - 1};
    } else {
      const previousValidSectionIndex = validSections.reverse().find(index => index < this.state.section);

      if(previousValidSectionIndex >= 0) {
        previousPage = {
          section: previousValidSectionIndex,
          page: this.props.siteStore.currentSiteInfo.event_descriptions[previousValidSectionIndex].pages.length - 1
        };
      }
    }

    if(this.state.page < section.pages.length - 1) {
      nextPage = { section: this.state.section, page: this.state.page + 1};
    } else {
      const nextValidSectionIndex = validSections.find(index => index > this.state.section);
      if(nextValidSectionIndex >= 0) {
        nextPage = {
          section: nextValidSectionIndex,
          page: 0
        };
      }
    }

    return { nextPage, previousPage };
  }

  Content() {
    const page = this.props.siteStore.currentSiteInfo.event_descriptions[this.state.section].pages[this.state.page];
    const imageUrl = page.image ? this.props.siteStore.SiteUrl(UrlJoin("info", "event_descriptions", this.state.section.toString(), "pages", this.state.page.toString(), "image")) : null;

    const { nextPage, previousPage } = this.AdjacentPages();
    const nextPageTitle = nextPage ? this.props.siteStore.currentSiteInfo.event_descriptions[nextPage.section].pages[nextPage.page].page_title : null;

    return (
      <div
        className="event-description-modal"
        ref={element => {
          if(!element) { return; }

          if(page.text_color) {
            element.style.setProperty("--eventDescriptionForeground", page.text_color.color);
          }

          if(page.background_color) {
            element.style.setProperty("--eventDescriptionBackground", page.background_color.color);
          }
        }}
        key={`event-description-modal-${this.state.section}-${this.state.page}`}
      >
        <div
          className="event-description-modal__content"
          key={`modal-content-${this.state.section}-${this.state.page}`}
          ref={element => element && element.scrollTo(0, 0)}
        >
          { imageUrl ? <img src={imageUrl} alt={page.page_title} className="event-description-modal__image"/> : null }
          { this.Markdown(page.text) }
        </div>
        <div className="event-description-modal__page-buttons">
          {
            previousPage ?
              <button className="event-description-modal__page-button left-button" onClick={() => this.setState(previousPage)}>
                <ImageIcon icon={LeftArrow} />
              </button>
              : null
          }

          {
            nextPage ?
              <button className="event-description-modal__page-button right-button" onClick={() => this.setState(nextPage)}>
                { nextPageTitle ? <span className="event-description-modal__page-button-title">{ nextPageTitle }</span> : null }
                <ImageIcon icon={RightArrow} />
              </button>
              : null
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal
        className="event-description-modal-container"
        Toggle={this.props.Toggle}
        content={this.Content()}
      />
    );
  }
}

const EventDescriptionsModal = inject("siteStore")(observer(EventDescriptionsModalClass));

class EventDescriptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalStart: {
        section: 0,
        page: 0
      }
    };

    this.ToggleModal = this.ToggleModal.bind(this);
  }

  ToggleModal(showModal=false, modalStart={section: 0, page: 0}) {
    this.setState({
      showModal,
      modalStart
    });
  }

  render() {
    const eventDescriptions = this.props.siteStore.currentSiteInfo.event_descriptions;

    if(!eventDescriptions || eventDescriptions.length === 0) {
      return null;
    }

    return (
      <div className="event-description">
        <div className="event-description__buttons">
          {
            eventDescriptions.map((section, index) =>
              section.pages.length === 0 ? null :
                <button
                  key={`description-button-${index}`}
                  className="btn event-description__button"
                  onClick={() => this.ToggleModal(true, {section: index, page: 0})}
                >
                  { section.name }
                </button>
            )
          }
        </div>

        { this.state.showModal ? <EventDescriptionsModal {...this.state.modalStart} Toggle={this.ToggleModal} /> : null }
      </div>
    );
  }
}

export default inject("siteStore")(observer(EventDescriptions));
