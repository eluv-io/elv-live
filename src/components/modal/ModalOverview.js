import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class ModalOverview extends React.Component {

  afterSubscribe() {
    return (
      <button onClick={() => {this.props.siteStore.PlayTitle(this.props.title); this.props.siteStore.OffModalTitle();}} className={`btnPlay btnPlay__modal ${this.props.showPlay === true ? "" : "hide"}`}>
        {/* <PlayIcon className="modal__btn--icon" /> */}
        Play Now
      </button>
    );
  }
  
  render() {
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
    const rating = "86%";
    const runtime = titleInfo.runtime;
    const release_date = titleInfo.release_date;
    const creator = titleInfo.creator;
    
    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`modal__container ${this.props.showTab === "Overview" ? "" : "hide"}`}>
        <h1 className="modal__title">
          {featuredTitle.displayTitle}
        </h1>
        <p className="modal__info">
          {Maybe(
            rating,
            () => <span className="modal__rating">Rating: { rating }</span>
          )}
          {Maybe(
            release_date,
            () => <span> | Release Date: { release_date }</span>
          )}
          {Maybe(
            runtime,
            () => <span> | Runtime: { runtime } minutes</span>
          )}
        </p>

        <p className="modal__info modal__creator">
          {Maybe(
            creator,
            () => <span>Created by: { creator }</span>
          )}
        </p>

        {Maybe(
          synopsis,
          () => <p className="modal__overview">{ synopsis }</p>
        )}
        { this.props.siteStore.boughtSubscription ? this.afterSubscribe() : null}

      </div>
    );
  }
}

export default ModalOverview;
