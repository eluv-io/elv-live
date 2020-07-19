import React from "react";
import {inject, observer} from "mobx-react";
import SwiperTitleIcon from "./SwiperTitleIcon";
import PlayTitleIcon from "./PlayTitleIcon";
import Swiper from "swiper";

@inject("siteStore")
@observer
class SwiperGrid extends React.Component {

  componentDidMount(){
    this.swiper = new Swiper(".swiper-container", {
      slidesPerView: 5,
      spaceBetween: 10,
      slidesPerGroup: 5,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        100: {
          slidesPerView: 2,
          spaceBetween: 10,
          slidesPerGroup: 2
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 10,
          slidesPerGroup: 3
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 10,
          slidesPerGroup: 4
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 5
        },
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
      <div className={this.props.trailers ? "trailer-container" : "swiper-container"}>
        <h1 className="swiper-heading">
          { this.props.name }
        </h1>
        <div className="swiper-wrapper">
          {
            this.props.titles.map((title, index) => {
              return (
                <RightIcon
                  key = {`title-grid-title-${this.props.name}-${index}`}
                  large = {false}
                  title = {title}
                  visible                  
                  episode= {index}
                  isEpisode = {this.props.isEpisode}
                  isPoster = {this.props.isPoster}
                />
              );
            })
          }
        </div> 
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    );
  }
}

export default SwiperGrid;
