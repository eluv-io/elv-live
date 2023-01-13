import React from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";
import ReactMarkdown from "react-markdown";
import Copy from "Assets/copy/Main.yaml";

import Whitepaper from "Assets/documents/EluvioContentFabricProtocolWhitepaper.pdf";

class Technology extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: Object.keys(Copy.blockchain.sections).includes(window.location.hash.replace("#", "")) ?
        window.location.hash.replace("#", "") : "main"
    };

    this.SetPageFromHash = this.SetPageFromHash.bind(this);
  }

  componentDidMount() {
    document.title = "The Eluvio Content Fabric | Eluvio LIVE";
    document
      .getElementsByTagName("meta")
      .namedItem("description")
      .setAttribute("content", Copy.seo.page_descriptions.blockchain);
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
    key = Object.keys(Copy.blockchain.sections).includes(key) ? key : "main";

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
          Object.keys(Copy.blockchain.sections).map(key =>
            <button
              key={`technology-page__navigation-button-${key}`}
              className={`technology-page__navigation-button technology-page__navigation-button-short ${key === this.state.page ? "selected" : ""}`}
              onClick={() => this.SetPage(key)}
            >
              <div className="technology-page__navigation-button__header">
                { Copy.blockchain.sections[key].header }
              </div>
            </button>
          )
        }
        <a
          href={Whitepaper}
          target="_blank"
          className="technology-page__navigation-button technology-page__navigation-button-short"
        >
          <div className="technology-page__navigation-button__header">
            Protocol Whitepaper
          </div>
        </a>
      </div>
    );
  }

  Pages() {
    return [
      ...Object.keys(Copy.blockchain.sections).map(key =>
        <div
          key={`technology-page__${key}`}
          className={`technology-page__item technology-page__copy-block ${this.state.page === key ? "active" : ""}`}
        >
          <h2 className="technology-page__copy-header">{ Copy.blockchain.sections[key].header }</h2>
          <div
            className="technology-page__copy technology-page__markdown"
            ref={element => {
              if(!element) { return; }

              render(
                <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
                  { Copy.blockchain.sections[key].text }
                </ReactMarkdown>,
                element
              );
            }}
          />
        </div>
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

export default inject("siteStore")(observer(Technology));
