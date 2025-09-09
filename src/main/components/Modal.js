import React, {useCallback, useEffect} from "react";
import {createPortal} from "react-dom";
import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import FocusTrap from "focus-trap-react";

import {XIcon} from "../static/icons/Icons";

const ModalComponent = ({children, hideCloseButton, className="", CloseModal}) => {
  return (
    <FocusTrap>
      <div className={`modal fade-in ${className || ""}`} onClick={(event) => CloseModal(event)}>
        {
          CloseModal && !hideCloseButton &&
            <button className="modal__close-button">
              <ImageIcon
                title="Close"
                icon={XIcon}
                onClick={() => CloseModal()}
              />
            </button>
        }
        <div
          className="modal__content"
          onClick={event => event.stopPropagation()}
        >
          { children }
        </div>
      </div>
    </FocusTrap>
  );
};

const Modal = observer(({children, active, hideCloseButton, Close, className=""}) => {
  // const CloseModal = (event) => {
  //   if(!Close) { return; }
  //
  //   if(event && (event.key || "").toLowerCase() !== "escape") { return; }
  //
  //   document.removeEventListener("keydown", Close);
  //   document.body.style.overflowY = "scroll";
  //
  //   Close(false);
  // };
  const CloseModal = useCallback((event) => {
    if(event.target.classList.contains("modal")) {
      Close();
    }
  }, [Close]);

  useEffect(() => {
    const HandleEscapeKey = (event) => {
      if(event.key === "Escape") {
        Close();
      }
    };

    if(active) {
      document.body.style.overflowY = "hidden";
      document.addEventListener("keydown", HandleEscapeKey);
    } else {
      document.body.style.overflowY = "scroll";
    }

    // document.addEventListener("keydown", CloseModal);
    // document.body.style.overflowY = active ? "hidden" : "scroll";

    return () => {
      document.body.style.overflowY = "scroll";
      document.removeEventListener("keydown", HandleEscapeKey);
    };
  }, [active]);

  if(!active) { return null; }

  return (
    createPortal(
      <ModalComponent className={className} hideCloseButton={hideCloseButton} CloseModal={Close ? CloseModal : undefined} >{children}</ModalComponent>,
      document.getElementById("app")
    )
  );
});

export default Modal;
