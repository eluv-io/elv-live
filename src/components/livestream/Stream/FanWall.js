import React from "react";
import {inject, observer} from "mobx-react";
import fan1 from "../../../static/images/fanWall/wall1.jpg";
import fan2 from "../../../static/images/fanWall/wall2.jpg";
import fan3 from "../../../static/images/fanWall/wall3.jpg";
import fan4 from "../../../static/images/fanWall/wall4.jpg";

@inject("siteStore")
@inject("rootStore")
@observer
class FanWall extends React.Component {


  render() {

    return (
      <div className="stream-container__tabs--wall">
        <div className="stream-container__tabs--fanHeading" >
          <h1 className="stream-container__tabs--fanHeading--fanTitle" >
            Virtual Fan Wall
          </h1>

          <button className="stream-container__tabs--fanHeading--fanButton btnFan btn2--white">
            Join Now
          </button>
        </div>

        <img src={fan1} className="stream-container__tabs--fan" />
        <img src={fan2} className="stream-container__tabs--fan" />
        <img src={fan3} className="stream-container__tabs--fan" />
        <img src={fan4} lassName="stream-container__tabs--fan" />
        <img src={fan1} className="stream-container__tabs--fan" />
        <img src={fan2} className="stream-container__tabs--fan" />
  
      </div>
    );
  }
}

export default FanWall;