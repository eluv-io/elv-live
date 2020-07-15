import React from "react";
import {inject, observer} from "mobx-react";
import Slider from "react-slick";
import BoxFeature from "./BoxFeature";
import Swiper from "swiper";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block"}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

@inject("rootStore")
@inject("siteStore")
@observer
class BoxGrid extends React.Component {

  // componentDidMount(){
  //   this.swiper = new Swiper(".swiper-container", {
  //     slidesPerView: 1,
  //     spaceBetween: 0,
  //     slidesPerGroup: 1,
  //     navigation: {
  //       nextEl: ".swiper-button-next",
  //       prevEl: ".swiper-button-prev",
  //     }
  //   });
  // }

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // autoplay: true,
      // autoplaySpeed: 10000,
      cssEase: "linear",
      // nextArrow: <SampleNextArrow />,
      // prevArrow: <SamplePrevArrow />
    };

    return (
      // <div className="swiper-container">
      //   <div className="swiper-wrapper">
      //     {
      //       this.props.titles.map((title) => {
      //         return (
      //           <BoxFeature
      //           key = {`box-feature-${title}`} 
      //           title={title} 
      //           modalClose={this.TurnOffToggle} 
      //           modalOpen={this.TurnOnToggle} 
      //           playTitle={this.PlayTitle} 
      //           trailers={false} 
      //           shouldPlay={false} 
      //           isEpisode={false} 
      //         />
      //         );
      //       })
      //     }
      //   </div> 
      //   <div className="swiper-button-next"></div>
      //   <div className="swiper-button-prev"></div>
      // </div>
      
      <Slider {...settings}>
        {
          this.props.titles.map((title) => {
            return (
              <BoxFeature
                key = {`box-feature-${title}`} 
                title={title} 
                modalClose={this.TurnOffToggle} 
                modalOpen={this.TurnOnToggle} 
                playTitle={this.PlayTitle} 
                trailers={false} 
                shouldPlay={false} 
                isEpisode={false} 
              />
            );
          })
        }
      </Slider>
    );
  }
}

export default BoxGrid;
