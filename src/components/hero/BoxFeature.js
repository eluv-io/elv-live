import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class BoxFeature extends React.Component {

  render() {    
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
    const rating = "86%";
    const runtime = titleInfo.runtime;
    const release_date = titleInfo.release_date;

    const Maybe = (value, render) => value ? render() : null;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `url(${thumbnail})`,
      marginTop: "7rem",
    };

    return (
      <div
        style={backgroundStyle}
        className= "box-feature"
      >
        <div className={featuredTitle.displayTitle === "Elephants Dream" ? "box-feature__container-elephant" : "box-feature__container"}>
          <h1 className="box-feature__title">
            {featuredTitle.displayTitle}
          </h1>
          <p className="box-feature__info">
            {Maybe(
              rating,
              () => <span className="box-feature__rating">Rating: { rating }</span>
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

          {Maybe(
            synopsis,
            () => <p className="box-feature__overview">{ synopsis }</p>
          )}
          <div className="box-feature__button">   
            <button onClick={() => this.props.playTitle(featuredTitle)} className={"btnPlay btnPlay__feature"}>
              {/* <PlayIcon className="modal__btn--icon" /> */}
                Play Now
            </button>

            <button onClick={() => this.props.modalOpen(featuredTitle)} className="btnDetails btnDetails__feature">
                View Details
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default BoxFeature;