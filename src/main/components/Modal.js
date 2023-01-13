import React, {useEffect} from "react";
import {createPortal} from "react-dom";
import {observer} from "mobx-react";
import ImageIcon from "./ImageIcon";
import FocusTrap from "focus-trap-react";

import CloseIcon from "../static/icons/x.svg";

const ModalComponent = ({children, className="", CloseModal}) => {
  return (
    <FocusTrap>
      <div className={`modal fade-in ${className || ""}`} onClick={() => CloseModal()}>
        {
          CloseModal ?
            <button className="modal__close-button">
              <ImageIcon
                title="Close"
                icon={CloseIcon}
                onClick={() => CloseModal()}
              />
            </button> :
            null
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

const Modal = observer(({children, active, Close, className=""}) => {
  const CloseModal = (event) => {
    if(!Close) { return; }

    if(event && (event.key || "").toLowerCase() !== "escape") { return; }

    document.removeEventListener("keydown", Close);
    document.body.style.overflowY = "scroll";

    Close(false);
  };

  useEffect(() => {
    document.addEventListener("keydown", CloseModal);
    document.body.style.overflowY = active ? "hidden" : "scroll";

    return () => {
      document.body.style.overflowY = "scroll";
      document.removeEventListener("keydown", CloseModal);
    };
  }, [active]);

  if(!active) { return null; }

  return (
    createPortal(
      <ModalComponent children={children} className={className} CloseModal={Close ? CloseModal : undefined} />,
      document.getElementById("app")
    )
  );
});

export default Modal;
