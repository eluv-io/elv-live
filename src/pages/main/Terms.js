import React from "react";
import {render} from "react-dom";
import ReactMarkdown from "react-markdown/with-html";

import EULA from "Assets/documents/Terms.md";

class Terms extends React.Component {
  render() {
    return (
      <div className="page-content terms-page">
        <h1 className="terms-page__header">Terms</h1>

        <div
          className="terms-page__document-frame markdown-document"
          ref={element => {
            if(!element) { return; }

            render(
              <ReactMarkdown allowDangerousHtml >
                { EULA }
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

export default Terms;
