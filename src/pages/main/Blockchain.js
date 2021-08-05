import React from "react";
import {render} from "react-dom";
import {inject, observer} from "mobx-react";
import ReactMarkdown from "react-markdown";
import Copy from "Assets/copy/Main.yaml";

@inject("siteStore")
@observer
class Technology extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "main"
    };
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
  }

  SetPage(key) {
    this.setState({page: key === this.state.page ? "main" : key});
    window.scrollTo(0, 0);
  }

  Navigation() {
    return (
      <div className="technology-page__navigation">
        {
          Object.keys(Copy.blockchain.sections).map(key =>
            <button
              key={`technology-page__navigation-button-${key}`}
              className={`technology-page__navigation-button ${key === this.state.page ? "selected" : ""}`}
              onClick={() => this.SetPage(key)}
            >
              <div className="technology-page__navigation-button__header">
                { Copy.blockchain.sections[key].header }
              </div>
            </button>
          )
        }
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

export default Technology;
