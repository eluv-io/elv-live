import React from "react";
import {render} from "react-dom";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";

export const RichText = ({richText, className=""}) => {
  return (
    <div
      className={`rich-text ${className}`}
      ref={element => {
        if(!element) { return; }

        render(
          <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
            { SanitizeHTML(richText) }
          </ReactMarkdown>,
          element
        );
      }}
    />
  );
};
