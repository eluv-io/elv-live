import React from "react";
import {render} from "react-dom";
import ReactMarkdown from "react-markdown/with-html";

import PrivacyPolicy from "Assets/documents/PrivacyPolicy.md";

class Privacy extends React.Component {
  render() {
    return (
      <div className="page-content privacy-page">
        <h1 className="privacy-page__header">Privacy Policy</h1>

        <div
          className="privacy-page__document markdown-document"
          ref={element => {
            if(!element) { return; }

            render(
              <ReactMarkdown allowDangerousHtml >
                { PrivacyPolicy }
              </ReactMarkdown>,
              element
            );
          }}
        >
        </div>
      </div>
    );
  }
}

export default Privacy;
