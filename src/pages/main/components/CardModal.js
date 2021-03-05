import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "../copy/Copy.yaml";

//
import TestImage from "Assets/images/ritaora/heroRita.jpg";

// Header images
import ComputerDiagrams from "Assets/icons/computer-diagrams.svg";

import ImageIcon from "Common/ImageIcon";

const CardImages = {
  retain_control: [
    {
      image: TestImage
    },
    {
      image: TestImage
    }
  ]
};

const HeaderImages = {
  computers: ComputerDiagrams
};

class CardModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: 0
    };
  }

  SelectedImage() {
    return (
      <div className="card-modal__selected-image-container">
        <ImageIcon
          className="card-modal__selected-image"
          //icon={CardImages[this.props.copyKey][this.state.image].image}
          icon={TestImage}
          label={this.props.copyKey}
        />
      </div>
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
        <pre className="card-modal__text-section-copy">
          { copy }
        </pre>
      </div>
    );
  }

  render() {
    const copy = Copy.cards[this.props.copyKey];

    return (
      <div className="card-modal">
        <div className="card-modal__image-container">
          { this.SelectedImage() }
        </div>
        <div className="card-modal__text-container">
          { Object.values(copy.sections).map((info, index) => this.TextSection(info, copy.border_color, index)) }
        </div>
      </div>
    );
  }
}

export default CardModal;
