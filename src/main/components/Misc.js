import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import ImageIcon from "./ImageIcon";
import Modal from "./Modal";

export const CaptionedImage = ({image, caption, className="", imageClassName="", captionClassName="", expandable}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <>
      <figure onClick={expandable ? () => setShowFullScreen(true) : undefined} className={`captioned-image ${expandable ? "captioned-image--expandable" : ""} ${className}`}>
        <ImageIcon icon={image} className={`captioned-image__image ${imageClassName}`} />
        <figcaption className={`captioned-image__caption ${captionClassName}`}>
          { caption }
        </figcaption>
      </figure>
      {
        showFullScreen ?
          <Modal
            active
            Close={() => setShowFullScreen(false)}
            className="captioned-image__modal dark"
          >
            <CaptionedImage
              image={image}
              caption={caption}
              className={`${className} captioned-image--expanded`}
              captionClassName={captionClassName}
            />
          </Modal> :
          null
      }
    </>
  );
};


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
