import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import LiveChat from "./LiveChat";

@inject("rootStore")
@inject("siteStore")
@observer
class Stream extends React.Component {

  render() {

    return (
      <div className="live-container">
        {/* Stream */}
        <div className="stream-container">
          <div className="stream-container__streamBox">
            <div className="stream-container__streamBox--nav">
              <ImageIcon className="stream-container__streamBox--nav__container--logo" icon={Logo} label="Eluvio" />
            </div>

            <iframe src='https://www.youtube.com/embed/8JV12x-qeS4?autoplay=1'
              frameborder='0'
              allow='autoplay; encrypted-media'
              allowfullscreen
              title='video'
              className="stream-container__streamBox--video"
            />

            <div className="stream-container__streamBox--info">
              <h2 className="stream-container__streamBox--info__subtitle">
                Liam Payne
              </h2>
              <h1 className="stream-container__streamBox--info__title">
                The LP Show: Act 2
              </h1>
            </div> 
          </div>
          <div className="stream-container__chat">
            <LiveChat /> 
          </div>
        </div>
      </div>
    );
  }
}

export default Stream;