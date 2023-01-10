import React from "react";
import {createRoot} from "react-dom/client";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";

export const RichText = ({richText, className=""}) => {
  return (
    <div
      className={`rich-text ${className}`}
      ref={element => {
        if(!element) { return; }

        createRoot(element).render(
          <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
            { SanitizeHTML(richText) }
          </ReactMarkdown>,
        );
      }}
    />
  );
};
