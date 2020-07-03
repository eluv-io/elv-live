import React from "react";
import {inject, observer} from "mobx-react";
import Slider from "react-slick";
import HeroGridView from "./HeroGridView";
import HeroView from "./HeroView";
import styled from 'styled-components';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", marginRight: "5rem"}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", marginLeft: "5rem", zIndex: "12021" }}
      onClick={onClick}
    />
  );
}

@inject("rootStore")
@inject("siteStore")
@observer
class HeroGrid extends React.Component {

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };

    return (
      <Slider {...settings} className="hero-grid-container">
        
          {
            this.props.titles.map((title) => {
              return (
                <HeroGridView
                  title = {title}
                  modalClose= {this.props.modalClose} 
                  modalOpen= {this.props.modalOpen} 
                  playTitle= {this.props.playTitle}
                />
              );
            })
          }
          {/* <HeroGridView title={this.props.siteStore.siteInfo.assets.titles[4]} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/>
          <HeroGridView title={this.props.siteStore.siteInfo.assets.titles[4]} modalClose={this.TurnOffToggle} modalOpen={this.TurnOnToggle} playTitle={this.PlayTitle}/> */}
      </Slider>
    );
  }
}

export default HeroGrid;
