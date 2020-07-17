import React from "react";
import {inject, observer} from "mobx-react";
import styled from "styled-components";

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
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    
    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

    

    const BoxContainer = styled.div`
      background-image: url(${thumbnail});
      margin-top: 7rem;
      object-position: left center;
    }
    `;

    const ColorContainer = styled.div`
      background: linear-gradient(90deg, ${this.props.backgroundColor} 50%, transparent);
      border-radius: 25px;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      padding-left: 5rem;
      width: 70%;
    }
    `;

    return (
      <BoxContainer
        className= "box-feature"
      >
        <ColorContainer>
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
            <button onClick={() => this.props.siteStore.PlayTitle(featuredTitle)} className={"btnPlay btnPlay__feature"}>
              {/* <PlayIcon className="modal__btn--icon" /> */}
                Play Now
            </button>

            <button onClick={() => this.props.siteStore.SetModalTitle(featuredTitle)} className="btnDetails btnDetails__feature">
                View Details
            </button>
          </div>
        </ColorContainer>
      </BoxContainer>
    );
  }
}

export default BoxFeature;