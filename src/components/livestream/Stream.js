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
    if(!this.props.rootStore.client || (this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode)) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
    }

    return (
      <AsyncComponent
        Load={async () => await this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          this.props.siteStore.PlayTitle(this.props.siteStore.premiere.title);

          return (
            <div className="live-container">
              {/* Stream */}
              <div className="stream-container">
                <div className="stream-container__streamBox">
                  <div className="stream-container__streamBox--nav">
                    <ImageIcon className="stream-container__streamBox--nav__container--logo" icon={Logo} label="Eluvio" />
                  </div>

                  <ViewStream />

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
        }}
      />
      
    );
  }
}

export default Stream;