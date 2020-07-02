import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import CloseIcon from "../static/icons/x.svg";

@inject("siteStore")
@observer
class BackButton extends React.Component {
  BackButton() {
    let backAction, backText, backIcon, backClass;
    if(this.props.siteStore.activeTitle) {
      backIcon = CloseIcon;
      backText = "Back to Content";
      backClass = "back-button__video";
      backAction = this.props.siteStore.ClearActiveTitle;
    } else {
      backIcon = CloseIcon;
      backText = "Close Modal";
      backClass = "back-button__modal";
      backAction = () => this.props.modalClose();
    }

    return (
      <ImageIcon
        key={`back-icon-${backText}`}
        className={backClass}
        title={backText}
        icon={backIcon}
        onClick={backAction}
      />
    );
  }

  render() {
    return this.BackButton();
  }
}
export default BackButton;
