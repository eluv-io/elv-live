import React from "react";
import {inject, observer, Provider} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import LiveChat from "./LiveChat";
import ViewStream from "./ViewStream";

import {Redirect, Switch, withRouter} from "react-router";
import AsyncComponent from "../AsyncComponent";

@inject("rootStore")
@inject("siteStore")
@observer
class Stream extends React.Component {

  render() {
    if(!this.props.rootStore.client || (this.props.match.params.siteId && !this.props.rootStore.accessCode)) {
      return <Redirect to={`/code`} />;
    }
    
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    let eventInfo = this.props.siteStore.eventAssets.get("madison-beer");
    const title = eventInfo.stream;

    return (
      <AsyncComponent
        Load={async () => {
          // await this.props.siteStore.LoadStreamSite("iq__b2Qah6AMaP8ToZbouDh8nSEKARe", this.props.match.params.writeToken);
          await this.props.siteStore.PlayTitle(title);
        }}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="stream-container">
              <div className="stream-container__streamBox">
                <div className="stream-container__streamBox--nav">
                  <ImageIcon className="stream-container__streamBox--nav__container--logo" icon={Logo} label="Eluvio" />
                </div>

                <ViewStream />
                
                <div className="stream-container__streamBox--info">
                  <h2 className="stream-container__streamBox--info__subtitle">
                    Liam Payne
                    {/* Fox Broadcasting Company */}
                  </h2>
                  <h1 className="stream-container__streamBox--info__title">
                    The LP Show: Act 2
                    {/* The Masked Singer */}
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