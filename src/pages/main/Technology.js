import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "./copy/Copy.yaml";

import Image1 from "Assets/images/technology/1-Content-Fabric-Architecture.png";
import Image2 from "Assets/images/technology/2-Content-Fabric-Distribution.png";
import Image3 from "Assets/images/technology/3-Streaming-Your-Content.png";
import Image4 from "Assets/images/technology/4-Selling-and-Licensing-Your-Content.png";
import Image5 from "Assets/images/technology/5-Selling-NFTs-and-Other-Digital-Collectibles.png";

import CloseIcon from "Icons/x";
import ImageIcon from "Common/ImageIcon";

const IMAGES = {
  "architecture": Image1,
  "how_it_works": Image2,
  "streaming": Image3,
  "buying": Image4,
  "nfts": Image5
};

@inject("siteStore")
@observer
class Technology extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "main"
    };
  }

  SetPage(key) {
    this.setState({page: key === this.state.page ? "main" : key});
    window.scrollTo(0, 0);
  }

  Navigation() {
    return (
      <div className="technology-page__navigation">
        {
          Object.keys(Copy.technology.sections).map(key =>
            <button
              key={`technology-page__navigation-button-${key}`}
              className={`technology-page__navigation-button ${key === this.state.page ? "selected" : ""}`}
              onClick={() => this.SetPage(key)}
            >
              <div className="technology-page__navigation-button__subheader">
                { Copy.technology.sections[key].subheader }
              </div>
              <div className="technology-page__navigation-button__header">
                { Copy.technology.sections[key].header }
              </div>
            </button>
          )
        }
      </div>
    );
  }

  Pages() {
    return [
      <div
        key="technology-page__main"
        className={`technology-page__item technology-page__copy-block ${this.state.page === "main" ? "active" : ""}`}
      >
        <h2 className="technology-page__copy-header">Eluv.io Technology</h2>
        <pre className="technology-page__copy">{ Copy.technology.text }</pre>
      </div>,
      ...Object.keys(Copy.technology.sections).map(key =>
        <img
          key={`technology-page__image-${key}`}
          src={IMAGES[key]}
          alt={Copy.technology.sections[key.header]}
          className={`technology-page__item technology-page__image ${this.state.page === key ? "active" : ""}`}
        />
      )
    ];
  }

  render() {
    return (
      <div className="page-content technology-page">
        <div className="technology-page__content-container">
          <div className="technology-page__content">
            <button
              className={`technology-page__close-button ${this.state.page === "main" ? "hidden" :""}`}
              onClick={() => this.SetPage("main")}
            >
              <ImageIcon icon={CloseIcon} title="Close" />
            </button>
            { this.Pages() }
          </div>
          { this.Navigation() }
        </div>
      </div>
    );
  }
}

export default Technology;
