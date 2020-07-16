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
        
        {Maybe(
          creator,
          () => <p className="modal__overview">Created by: { creator }</p>
        )}

      
        {Maybe(
          titleInfo.talent && titleInfo.talent.cast,
          () => <p className="modal__overview">
              Cast: { titleInfo.talent.cast.map(actor => `${actor.talent_first_name} ${actor.talent_last_name}`).join(", ") }
          </p>
        )}

      
        {Maybe(
          copyright,
          () => <p className="modal__overview">Copyright: { copyright }</p>
        )}  
      </div>
    );
  }
}

export default ModalDetails;
