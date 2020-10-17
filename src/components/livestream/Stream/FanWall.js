import React from "react";
import {inject, observer} from "mobx-react";


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
          <button 
            onClick={() => window.open(
              `https://video-app-7593-8841-dev.twil.io/?passcode=04009275938841&feed=false&name=${this.props.rootStore.name}`, 
              "Virtual Fan Wall",
              "toolbar=no, location=no, status=no, menubar=no, scrollbars=1, resizable=0, width=500, height=700, ")} 
            className="stream-container__tabs--fanHeading--fanButton btnFan btn2--white"
          >
            Join Now
          </button>
        </div>

        <iframe 
          src={`https://video-app-7593-8841-dev.twil.io/?passcode=04009275938841&feed=true&name=${this.props.rootStore.name}`}
          className="stream-container__tabs--twilio"
          frameborder="0"
          allowfullscreen 
          sandbox 
        />
  
      </div>
    );
  }
}

export default FanWall;