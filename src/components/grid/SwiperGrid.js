import React from "react";
import {inject, observer} from "mobx-react";
import SwiperTitleIcon from "./SwiperTitleIcon";
import PlayTitleIcon from "./PlayTitleIcon";
import Swiper from "swiper";
import {ImageIcon} from "elv-components-js";
import FallbackIcon from "../../static/icons/video.svg";

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


  renderPoster() {

    return (
      <div className="swiper-wrapper">
        {
          this.props.titles.map((title, index) => {
            return (
              <SwiperTitleIcon
                key = {`title-grid-title-${this.props.name}-${index}`}
                large = {false}
                title = {title}
                visible
                modalClose= {this.props.modalClose} 
                modalOpen= {this.props.modalOpen} 
                playTitle= {this.props.playTitle}
                episode= {index}
                isEpisode = {this.props.isEpisode}
                isPoster = {this.props.isPoster}
              />
            );
          })
        }   
      </div>
    ); 
  }

  //Hardcoded Netflix Posters to showcase poster grid 
  renderPosterNetflix() {
    function importAll(r) {
      return r.keys().map(r);
    }

    const images = importAll(require.context("../../static/images/posters", false, /\.(png|jpe?g|svg)$/));

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    return (
      <div className="swiper-wrapper">
        {
          images.map(thumbnail => {
            const photo = this.props.siteStore.CreateLink(
              thumbnail,
              "",
              { height: Math.max(150, Math.floor(vh / 3)) }
            );
            return (
              <React.Fragment>
                <div className="swiper-slide swiper-slide__poster">
                  <ImageIcon
                    className="swiper-slide__image"
                    icon={photo || FallbackIcon}
                    alternateIcon={FallbackIcon}
                  />
                </div>
              </React.Fragment>
            );
          })
        }   
      </div>
    ); 
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
      <div className={this.props.trailers ? "swiper-container__trailer" : "swiper-container"}>
        <h1 className="swiper-heading"> 
          { this.props.name } 
        </h1>
        {/* Added Logic for Netflix Originals --- WILL TAKE OUT SOON */}
        {this.props.name === "Netflix Originals" ? this.renderPosterNetflix() : (this.props.isPoster ? this.renderPoster() : 
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
                    isPoster = {this.props.isPoster}
                  />
                );
              })
            }
          </div> )}

        
        

        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    );
  }
}


export default SwiperGrid;
