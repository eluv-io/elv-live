import React from "react";
import {inject, observer} from "mobx-react";
import NewTitleIcon from "./NewTitleIcon";
import PlayTitleIcon from "./PlayTitleIcon";
import Swiper from "swiper";

@inject("siteStore")
@observer
class SwiperGrid extends React.Component {

  componentDidMount(){
    this.swiper = new Swiper(".swiper-container", {
      slidesPerView: 5,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      // slidesPerView: 3,
    });
  }

  render() {
    const noTitles = (!this.props.titles || this.props.titles.length === 0);
    if(!this.props.noTitlesMessage && noTitles) { return null; }
    
    let RightIcon;
    if(this.props.shouldPlay) {
      RightIcon = PlayTitleIcon;
    } else {
      RightIcon = NewTitleIcon;
    }
    return (
      <div className={this.props.trailers === true ? "swiper-container__trailer" : "swiper-container"}>
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
                  modalClose= {this.props.modalClose} 
                  modalOpen= {this.props.modalOpen} 
                  playTitle= {this.props.playTitle}
                  episode= {index}
                  isEpisode = {this.props.isEpisode}
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