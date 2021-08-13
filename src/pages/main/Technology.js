import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "Assets/copy/Main.yaml";

import Image1 from "Assets/images/technology/1-Content-Fabric-Architecture.png";
import Image2 from "Assets/images/technology/2-Content-Fabric-Distribution.png";
import Image3 from "Assets/images/technology/3-Streaming-Your-Content.png";
import Image4 from "Assets/images/technology/4-Selling-and-Licensing-Your-Content.png";
import Image5 from "Assets/images/technology/5-Selling-NFTs-and-Other-Digital-Collectibles.png";

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
      page: Object.keys(Copy.technology.sections).includes(window.location.hash.replace("#", "")) ?
        window.location.hash.replace("#", "") : "main"
    };

    this.SetPageFromHash = this.SetPageFromHash.bind(this);
  }

  componentDidMount() {
    document.title = "The Eluvio Content Fabric | Eluvio LIVE";
    document
      .getElementsByTagName("meta")
      .namedItem("description")
      .setAttribute("content", Copy.seo.page_descriptions.technology);
    document
      .getElementsByTagName("meta")
      .namedItem("robots")
      .setAttribute("content", "");

    window.addEventListener("hashchange", this.SetPageFromHash, false);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.SetPageFromHash, false);
  }

  SetPageFromHash() {
    this.SetPage(window.location.hash.replace("#", ""), false);
  }

  SetPage(key, push=true) {
    key = Object.keys(Copy.technology.sections).includes(key) ? key : "main";

    this.setState({page: key === this.state.page ? "main" : key});
    window.scrollTo(0, 0);

    if(push) {
      history.pushState({}, "", window.location.pathname + "#" + (key === "main" ? "" : key));
    }
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
      ...Object.keys(Copy.technology.sections).map(key =>
        key === "main" ?
          <div
            key="technology-page__main"
            className={`technology-page__item technology-page__copy-block ${this.state.page === "main" ? "active" : ""}`}
          >
            <h2 className="technology-page__copy-header">Eluv.io Technology</h2>
            <pre className="technology-page__copy">{ Copy.technology.sections.main.text }</pre>
          </div> :
          <img
            key={`technology-page__image-${key}`}
            src={IMAGES[key]}
            alt={Copy.technology.sections[key].alt}
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
            { this.Pages() }
          </div>
          { this.Navigation() }
        </div>
      </div>
    );
  }
}

export default Technology;
