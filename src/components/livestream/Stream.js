import React from "react";
import {inject, observer, Provider} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import LiveChat from "./LiveChat";
import ViewStream from "./ViewStream";
import RTMP from "./RTMP";

import {Redirect, Switch, withRouter} from "react-router";
import AsyncComponent from "../AsyncComponent";

@inject("rootStore")
@inject("siteStore")
@observer
class Stream extends React.Component {

  render() {
    // if(!this.props.rootStore.client || (this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode)) {
    //   return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
    // }
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    return (
      <AsyncComponent
        Load={async () => await this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }
          this.props.siteStore.PlayTitle(this.props.siteStore.stream.title);

          return (
            <div className="stream-container">
              <div className="stream-container__streamBox">
                <div className="stream-container__streamBox--nav">
                  <ImageIcon className="stream-container__streamBox--nav__container--logo" icon={Logo} label="Eluvio" />
                </div>

                <RTMP />

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
          );
        }}
      />
      
    );
  }
}

export default Stream;