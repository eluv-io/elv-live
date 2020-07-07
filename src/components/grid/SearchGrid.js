import React from "react";
import {inject, observer} from "mobx-react";
import SwiperTitleIcon from "./SwiperTitleIcon";
import PlayTitleIcon from "./PlayTitleIcon";
import Swiper from "swiper";

/// SAME THING AS TITLE GRID BUT WITH DIFFERENT CLASSNAME
/// TODO: Might get rid of Carousel effect for the Search Grid

@inject("siteStore")
@observer
class SearchGrid extends React.Component {
  componentDidMount(){
    this.swiper = new Swiper(".swiper-container", {
      slidesPerView: 5,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }
    });
  }

  render() {
    const noTitles = (!this.props.titles || this.props.titles.length === 0);
    if(!this.props.noTitlesMessage && noTitles) { return null; }
    
    let RightIcon;
    if(this.props.shouldPlay) {
      RightIcon = PlayTitleIcon;
    } else {
      RightIcon = SwiperTitleIcon;
    }
    return (
      <div className={this.props.trailers === true ? "swiper-container__trailer" : "swiper-container__search"}>
        <h1 className="swiper-heading"> 
          { this.props.name } 
        </h1>
        <div className="swiper-wrapper">
          {
            this.props.titles.map((title, index) => {
              return (
                <RightIcon
                  key={`title-grid-title-${this.props.name}-${index}`}
                  large = {false}
                  title={title}
                  visible
                  modalClose={this.props.modalClose} 
                  modalOpen={this.props.modalOpen} 
                  playTitle={this.props.playTitle}
                  episode= {index}
                  isEpisode = {this.props.isEpisode}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}


export default SearchGrid;