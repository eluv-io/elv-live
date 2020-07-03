import React from "react";

class ModalChannel extends React.Component {
  render() {
    const featuredTitle = this.props.title;

    return (
      <div className={`modal__container ${this.props.showTab === "Live Schedule" ? "" : "hide"}`}>
        <h1 className="modal__title">
          {featuredTitle.displayTitle}
        </h1>
        <p className="modal__info">
                Channel Schedule 
        </p>
      </div>
    );
  }
}

export default ModalChannel;