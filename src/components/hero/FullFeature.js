import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class FullFeature extends React.Component {

  render() {    
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
    const rating = "86%";
    const runtime = titleInfo.runtime;
    const release_date = titleInfo.release_date;
    const creator = titleInfo.creator;

    const Maybe = (value, render) => value ? render() : null;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `url(${thumbnail})`
    };

    return (
        <div
          style={backgroundStyle}
          className= "feature__container"
        >
          <h1 className="feature__title">
            {featuredTitle.displayTitle}
          </h1>
          <p className="feature__info">
            {Maybe(
              rating,
              () => <span className="feature__rating">Rating: { rating }</span>
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

          <p className="feature__info">
            {Maybe(
              creator,
              () => <span>Created by: { creator }</span>
            )}
          </p>

          {Maybe(
            synopsis,
            () => <p className="feature__overview">{ synopsis }</p>
          )}
          <button onClick={() => this.props.playTitle(featuredTitle)} className={"btnPlay"}>
            {/* <PlayIcon className="modal__btn--icon" /> */}
            Play
          </button>
        </div>
    );
  }
}

export default FullFeature;