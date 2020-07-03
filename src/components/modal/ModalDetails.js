import React from "react";

class ModalDetails extends React.Component {
  render() {
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const creator = titleInfo.creator;
    const copyright = titleInfo.copyright;

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`modal__container ${this.props.showTab === "Details" ? "" : "hide"}`}>
        <h1 className="modal__title">
          {featuredTitle.displayTitle}
        </h1>
          
        <p className="modal__info">
          {Maybe(
            creator,
            () => <span className="modal__overview modal__overview--cast">Created by: { creator }</span>
          )}
        </p>
        <p className="modal__info">
          {Maybe(
            titleInfo.talent && titleInfo.talent.cast,
            () => <span className="modal__overview modal__overview--cast">
                Cast: { titleInfo.talent.cast.map(actor => `${actor.talent_first_name} ${actor.talent_last_name}`).join(", ") }
            </span>
          )}
        </p>
        <p className="modal__info">
          {Maybe(
            copyright,
            () => <span className="modal__overview modal__overview--cast">Copyright: { copyright }</span>
          )}  
        </p>
      </div>
    );
  }
}

export default ModalDetails;
