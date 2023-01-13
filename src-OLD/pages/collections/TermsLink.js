import React, {useState} from "react";
import Modal from "Common/Modal";
import {render} from "react-dom";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";

const TermsLink = ({className, linkText, content, contentUrl}) => {
  let [showModal, setShowModal] = useState(undefined);

  let modalElement = document.createElement("div");
  const ShowModal = () => {
    setShowModal(true);
    document.body.appendChild(modalElement);

    render(
      <Modal
        className="terms-link-modal"
        Toggle={() => {
          setShowModal(false);

          modalElement.parentElement ? document.body.removeChild(modalElement) : null;
        }}
      >
        <div className="terms-link__modal">
          {
            contentUrl ?
              <iframe src={contentUrl} className="terms-link__modal__content terms-link__modal__content-html" /> :
              <div
                className="terms-link__modal__content"
                ref={element => {
                  if(!element) {
                    return;
                  }

                  render(
                    <ReactMarkdown linkTarget="_blank" allowDangerousHtml>
                      {SanitizeHTML(content)}
                    </ReactMarkdown>,
                    element
                  );
                }}
              />
          }
        </div>
      </Modal>,
      modalElement
    );
  };

  return (
    <div className={`terms-link ${className || ""}`}>
      <button className="terms-link__button" onClick={ShowModal} type="button" disabled={showModal}>
        { linkText }
      </button>
    </div>
  );
};

export default TermsLink;
