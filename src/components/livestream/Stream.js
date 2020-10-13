import React from "react";
import {inject, observer, Provider} from "mobx-react";
import Logo from "../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";
import LiveChat from "./LiveChat";
import ViewStream from "./ViewStream";

import {Redirect, Switch, withRouter} from "react-router";
import AsyncComponent from "../AsyncComponent";

import Select from 'react-select';

const options = [
  { value: '0', label: 'MULTIVIEW 1' },
  { value: '1', label: 'MULTIVIEW 2' },
  { value: '2', label: 'ALL VIEWS' },
];

@inject("rootStore")
@inject("siteStore")
@observer
class Stream extends React.Component {
  state = {
    selectedOption: options[0],
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    if(!this.props.rootStore.client || (this.props.match.params.siteId && !this.props.rootStore.accessCode)) {
      return <Redirect to={`/code`} />;
    }

    const { selectedOption } = this.state;

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    let eventInfo = this.props.siteStore.eventAssets.get("madison-beer");
    let eventInfo2 = this.props.siteStore.eventAssets.get("liam-payne");
    let eventInfo3 = this.props.siteStore.eventAssets.get("brandi-carlile");

    // const title = eventInfo.stream;

    return (
      <AsyncComponent
        Load={async () => {
          // await this.props.siteStore.LoadStreamSite("iq__b2Qah6AMaP8ToZbouDh8nSEKARe", this.props.match.params.writeToken);
          await this.props.siteStore.SetFeed(eventInfo.stream, eventInfo2.stream, eventInfo3.stream);
        }}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="stream-container">
              <div className="stream-container__streamBox">
                <div className="stream-container__streamBox--nav">
                  <ImageIcon className="stream-container__streamBox--nav__logo" icon={Logo} label="Eluvio" />
                  <Select
                    className="stream-container__streamBox--nav__dropdown"
                    value={selectedOption}
                    onChange={this.handleChange}
                    defaultValue={options[0]}
                    options={options}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={false}
                    isSearchable={false}
                    autoFocus={false}
                  />
                </div>

                <ViewStream feedOption={selectedOption}/>
                
                <div className="stream-container__streamBox--info">
                  <h2 className="stream-container__streamBox--info__subtitle">
                    Madison Beer
                    {/* Fox Broadcasting Company */}
                  </h2>
                  <h1 className="stream-container__streamBox--info__title">
                    Live At Madison Square Garden
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