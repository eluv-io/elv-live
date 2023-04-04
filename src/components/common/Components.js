import React from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";

export const RichText = ({richText, children, className=""}) => {
  return (
    <div className={`rich-text ${className}`}>
      { children }
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
      >
        { DOMPurify.sanitize(richText) }
      </ReactMarkdown>
    </div>
  );
};
