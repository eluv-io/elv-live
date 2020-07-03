import React from "react";
import {inject, observer} from "mobx-react";
import Swiper from "swiper";
import HeroView from "./HeroView";

@inject("rootStore")
@inject("siteStore")
@observer
class SwiperHeroGrid extends React.Component {
  componentDidMount(){
    this.swiper = new Swiper(".swiper-container", {
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  render() {
    const noTitles = (!this.props.titles || this.props.titles.length === 0);
    if(!this.props.noTitlesMessage && noTitles) { return null; }

    return (
      <React.Fragment>
        
        <div className="hero-swiper-container">
          <h1 className="swiper-heading"> 
            { this.props.name } 
          </h1>
          <div className="swiper-wrapper">
            {/* {
              this.props.titles.map((title) => {
                return (
                  <HeroView
                    title = {title}
                    modalClose= {this.props.modalClose} 
                    modalOpen= {this.props.modalOpen} 
                    playTitle= {this.props.playTitle}
                  />
                );
              })
            } */}
            {/* <HeroView title={this.props.siteStore.siteInfo.assets.titles[4]} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/> */}
            <HeroView title={this.props.siteStore.siteInfo.assets.titles[4]} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/>

          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </React.Fragment>

    );
  }
}

export default SwiperHeroGrid;
