import React from "react";
import {inject, observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CloseIcon from "Icons/x";
import {ToggleZendesk} from "Utils/Misc";
import {createPortal} from "react-dom";
import {rootStore} from "Stores";

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.Close = this.Close.bind(this);
  }

  Close(event) {
    if(event && (event.key || "").toLowerCase() !== "escape") { return; }

    document.removeEventListener("keydown", this.Close);
    document.body.style.overflowY = "auto";

    ToggleZendesk(true);

    this.props.Toggle(false);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.Close);
    document.body.style.overflowY = "hidden";

    ToggleZendesk(false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.Close);

    if(rootStore.currentWalletState.visibility !== "full") {
      document.body.style.overflowY = "auto";
    }

    ToggleZendesk(true);
  }

  render() {
    return (
      <div className={`modal ${this.props.siteStore.darkMode ? "dark" : ""} ${this.props.className || ""}`} onClick={() => this.Close()}>
        <ImageIcon
          key={"back-icon-Close Modal"}
          className={"modal__close-button"}
          title={"Close Modal"}
          icon={CloseIcon}
          onClick={() => this.Close()}
        />
        <div className="modal__content" onClick={event => event.stopPropagation()}>
          { this.props.content || this.props.children }
        </div>
      </div>
    );
  }
}

const ModalPortal = (args) => {
  return (
    createPortal(
      <Modal {...args} />,
      document.getElementById("app")
    )
  );
};

export default ModalPortal;
