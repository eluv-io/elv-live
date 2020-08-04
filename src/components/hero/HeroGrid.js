import React from "react";
import {inject, observer} from "mobx-react";
import Slider from "react-slick";
import HeroView from "./HeroView";

// function SampleNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", marginRight: "5rem"}}
//       onClick={onClick}
//     />
//   );
// }

// function SamplePrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", marginLeft: "5rem", zIndex:"100" }}
//       onClick={onClick}
//     />
//   );
// }


@inject("rootStore")
@inject("siteStore")
@observer
class HeroGrid extends React.Component {

  render() {
    var settings = {
      dots: false,
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
      <Slider {...settings} className="hero-grid-container">
        {
          this.props.titles.map((title) => {
            return (
              <HeroView
                key = {`title-grid-title-${title}`}
                title = {title}
                
              />
            );
          })
        }
      </Slider>
    );
  }
}

export default HeroGrid;
