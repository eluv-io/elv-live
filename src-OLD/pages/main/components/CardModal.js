import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "Assets/copy/Main.yaml";

import ComputerDiagrams from "Assets/icons/computer-diagrams.svg";

import ImageIcon from "Common/ImageIcon";
import LeftArrow from "Icons/left-arrow";
import RightArrow from "Icons/right-arrow";

const HeaderImages = {
  computers: ComputerDiagrams
};

class CardModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      previous: undefined
    };
  }

  Images() {
    return this.props.mainStore.cardImages[this.props.copyKey] || [];
  }

  ChangePage(page) {
    const cards = this.Images();

    this.setState({
      selected: page % cards.length,
      previous: this.state.selected
    }, () => setTimeout(() => this.setState({previous: undefined}), 1500));
  }

  ImageControls() {
    let leftArrow, rightArrow, rightText;

    if(this.state.selected > 0) {
      leftArrow = (
        <button
          className="arrow-left"
          onClick={() => this.ChangePage(this.state.selected - 1)}
        >
          <ImageIcon icon={LeftArrow} label="Previous" />
        </button>
      );
    }

    if(this.state.selected < this.Images().length - 1) {
      rightArrow = (
        <button
          className="arrow-right"
          onClick={() => this.ChangePage(this.state.selected + 1)}
        >
          <ImageIcon icon={RightArrow} label="Next" />
        </button>
      );

      const nextTitle = (this.Images()[this.state.selected + 1] || {}).title || "";
      if(nextTitle) {
        rightText = (
          <button
            className="arrow-right-text"
            onClick={() => this.ChangePage(this.state.selected + 1)}
          >
            View { nextTitle }
          </button>
        );
      }
    }

    const title = (this.Images()[this.state.selected] || {}).title || "";

    return (
      <div className="card-modal__image-controls">
        { leftArrow }
        <h3 className="card-modal__image-controls-title">
          { title }
        </h3>
        { rightText }
        { rightArrow }
      </div>
    );
  }

  ImageSection() {
    if(this.Images().length === 0) {
      return null;
    }

    return this.Images().map(({url, title}, index) =>
      <ImageIcon
        key={`card-image-${index}`}
        className={`card-modal__image ${index === this.state.selected ? "card-modal__image-active" : ""} ${index === this.state.previous ? "card-modal__image-fading-out" : ""}`}
        icon={url}
        label={title}
      />
    );
  }

  TextSection({header, header_image, copy}, borderColor, index) {
    if(header_image) {
      header_image = (
        <ImageIcon className="card-modal__text-section-header-image" icon={HeaderImages[header_image]} alt={header} />
      );
    }

    return (
      <div
        className="card-modal__text-section"
        key={`card-modal_text-section-${index}`}
        style={{borderColor: `#${borderColor}`}}
      >
        <div className="card-modal__text-section-header-section">
          <h2 className="card-modal__text-section-header">{ header }</h2>
          { header_image }
        </div>
        <pre className="card-modal__text-section-copy" dangerouslySetInnerHTML={{__html: copy}}>
        </pre>
      </div>
    );
  }

  render() {
    const copy = Copy.cards[this.props.copyKey];

    return (
      <div className={`card-modal ${this.props.small ? "card-modal-small" : ""} ${this.Images().length === 0 ? "card-modal-no-image" : ""}`}>
        <div className="card-modal__image-container">
          { this.ImageSection() }
          { this.ImageControls() }
        </div>
        <div className="card-modal__text-container">
          { Object.values(copy.sections).map((info, index) => this.TextSection(info, copy.border_color, index)) }
        </div>
      </div>
    );
  }
}

export default inject("mainStore")(observer(CardModal));
