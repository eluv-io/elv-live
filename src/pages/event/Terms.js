import React from "react";

import TermsDocument from "Assets/documents/Terms.html";

class Privacy extends React.Component {
  constructor(props) {
    super(props);

    const blob = new Blob([TermsDocument], {type: "text/html"});

    this.state = {
      policyUrl: window.URL.createObjectURL(blob)
    };
  }

  componentDidMount() {
    document.title = "Terms and Conditions | Eluvio LIVE";
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
      <div className="page-container terms-page-container">
        <div className="main-content-container terms-page">
          <h1 className="terms-page__header">Terms and Conditions</h1>
          <iframe className="terms-page__document-frame" src={this.state.policyUrl} />
        </div>
      </div>
    );
  }
}

export default Privacy;
