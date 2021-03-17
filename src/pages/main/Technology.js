import React from "react";
import {inject, observer} from "mobx-react";
import TestImage from "Assets/images/technology/diagram-for-testing.png";

import Copy from "./copy/Copy.yaml";

@inject("siteStore")
@observer
class Technology extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "nfts",
      pages: [
        "main",
        "architecture",
        "how_it_works",
        "streaming",
        "buying",
        "nfts"
      ]
    };
  }

  Navigation() {
    return (
      <div className="technology-page__navigation">
        {
          Object.keys(Copy.technology.sections).map(key =>
            <button
              key={`technology-page__navigation-button-${key}`}
              className={`technology-page__navigation-button ${key === this.state.page ? "selected" : ""}`}
              onClick={() => this.setState({page: key === this.state.page ? "main" : key})}
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

  Page() {
    if(this.state.page === "main") {
      return (
        <div className="technology-page__copy-block">
          <h2 className="technology-page__copy-header">Eluv.io Technology</h2>
          <pre className="technology-page__copy">{ Copy.technology.text }</pre>
        </div>
      );
    } else {
      return (
        <img src={TestImage} alt={Copy.technology.sections[this.state.page].header} className="technology-page__image" />
      );
    }
  }

  render() {
    return (
      <div className="page-content technology-page">
        <div className="technology-page__content-container">
          { this.Page() }
          { this.Navigation() }
        </div>
      </div>
    );
  }
}

export default Technology;
