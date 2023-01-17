import React from "react";

import TermsDocument from "Assets/documents/Terms.html";

class Terms extends React.Component {
  constructor(props) {
    super(props);

    const blob = new Blob([TermsDocument], {type: "text/html"});

    this.state = {
      termsUrl: window.URL.createObjectURL(blob)
    };
  }

  componentDidMount() {
    document.title = "Terms of Service | Eluvio LIVE";
    document
      .getElementsByTagName("meta")
      .namedItem("robots")
      .setAttribute("content", "noindex");
    document
      .getElementsByTagName("meta")
      .namedItem("description")
      .setAttribute("content", "");
  }

  render() {
    return (
      <div className="page-content terms-page">
        <h1 className="terms-page__header">Eluvio End User Agreement</h1>
        <iframe className="terms-page__document-frame" src={this.state.termsUrl} />
      </div>
    );
  }
}

export default Terms;
