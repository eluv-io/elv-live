import React from "react";

import PrivacyPolicyDocument from "Assets/documents/PrivacyPolicy.html";

class Privacy extends React.Component {
  constructor(props) {
    super(props);

    const blob = new Blob([PrivacyPolicyDocument], {type: "text/html"});

    this.state = {
      policyUrl: window.URL.createObjectURL(blob)
    };
  }

  componentDidMount() {
    document.title = "Privacy Policy | Eluvio LIVE";
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
      <div className="page-content privacy-page">
        <h1 className="privacy-page__header">Privacy Policy</h1>
        <iframe className="privacy-page__document-frame" src={this.state.policyUrl} />
      </div>
    );
  }
}

export default Privacy;
