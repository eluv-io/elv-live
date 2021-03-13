import React from "react";
import {observer} from "mobx-react";
import ImageIcon from "Common/ImageIcon";
import CloseIcon from "Icons/x";

@observer
class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.Close = this.Close.bind(this);
  }

  Close(event) {
    if(event && (event.key || "").toLowerCase() !== "escape") { return; }

    this.props.Toggle(false);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.Close);
    document.body.style.overflowY = "hidden";
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.Close);
    document.body.style.overflowY = "auto";
  }

  render() {
    return (
      <React.Fragment>
        <div className={`modal ${this.props.className || ""}`} onClick={() => this.props.Toggle(false)}>
          <ImageIcon
            key={"back-icon-Close Modal"}
            className={"modal__close-button"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => this.props.Toggle(false)}
          />
          <div className="modal__content" onClick={event => event.stopPropagation()}>
            { this.props.content || this.props.children }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;
