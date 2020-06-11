import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class ModalOverview extends React.Component {

  render() {
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
    const rating = "86%";
    const runtime = titleInfo.runtime;
    const release_date = titleInfo.release_date;
    const creator = titleInfo.creator;
    const copyright = titleInfo.copyright;
    
    const Maybe = (value, render) => value ? render() : null;

    return (
      <React.Fragment>
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

          <p className="modal__info">
            {Maybe(
              creator,
              () => <span>Created by: { creator }</span>
            )}
          </p>

          {/* <p className="modal__episode">
                  {featuredTitle.number_of_episodes
                    ? ' Episodes: ' + featuredTitle.number_of_episodes
                    : ''}
                  {featuredTitle.number_of_seasons
                    ? ' Seasons: ' + featuredTitle.number_of_seasons
                    : ''}
                </p> */}

          {Maybe(
            synopsis,
            () => <p className="modal__overview">{ synopsis }</p>
          )}
          <button onClick={() => {this.props.playTitle(featuredTitle); this.props.modalClose();}} className={`btnPlay btnPlay__modal ${this.props.showPlay === true ? "" : "hide"}`}>
            {/* <PlayIcon className="modal__btn--icon" /> */}
            Play
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default ModalOverview;
