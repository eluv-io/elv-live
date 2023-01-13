import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

export const RichText = ({richText, className=""}) => {
  const [reactRoot, setReactRoot] = useState(undefined);

  return (
    <div
      className={`rich-text ${className}`}
      ref={element => {
        if(!element) { return; }

        const root = reactRoot || createRoot(element);
        setReactRoot(root);

        root.render(
          <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
            { DOMPurify.sanitize(richText) }
          </ReactMarkdown>,
        );
      }}
    />
  );
};
