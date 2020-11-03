import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";
import Select from 'react-select';

import ViewStream from "./ViewStream";
import AsyncComponent from "../../support/AsyncComponent";
import StreamTabs from './StreamTabs';

const options = [
  { value: '0', label: 'MULTIVIEW 1' },
  { value: '1', label: 'MULTIVIEW 2' },
  { value: '2', label: 'MULTIVIEW 3' },
  { value: 'all', label: 'ALL VIEWS' },
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
  };

  renderFeed(selectedOption) {
    if (selectedOption.value == 'all') {
      console.log(this.props.siteStore.showFeed);
      return (
        // TODO: For 'all' multiview, make all the streams play at the same time
        <div className={this.props.siteStore.showFeed ? "stream-container__streamBox--feedGrid" : "hide"}>
          <ViewStream feedOption={0} classProp = "stream-container__streamBox--video1" mutedOption = {true}/>
          <ViewStream feedOption={1} classProp = "stream-container__streamBox--video2" mutedOption = {true}/>
          <ViewStream feedOption={2} classProp = "stream-container__streamBox--video3" mutedOption = {true}/>
        </div>
      );
    } else {
      return (
        <ViewStream feedOption={selectedOption.value} classProp = "stream-container__streamBox--video" mutedOption = {false}/>
      );
    }
  }

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

    return (
      <AsyncComponent
        Load={async () => {
          // await this.props.siteStore.LoadStreamSite("iq__b2Qah6AMaP8ToZbouDh8nSEKARe", this.props.match.params.writeToken);
          await this.props.siteStore.SetFeed(eventInfo, eventInfo2, eventInfo3);
        }}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="stream-container">
              <div className="stream-container__streamBox">
                <div className="stream-container__streamBox--nav">
                  <ImageIcon className="stream-container__streamBox--nav__logo" icon={this.props.siteStore.logoUrl} label="Eluvio" />
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

                {this.renderFeed(selectedOption)}

                <div className="stream-container__streamBox--info">
                  <h2 className="stream-container__streamBox--info__subtitle">
                    Madison Beer
                  </h2>
                  <h1 className="stream-container__streamBox--info__title">
                    Live At Madison Square Garden
                  </h1>
                </div> 
              </div>

              <StreamTabs />
            </div>
          );
        }}
      />
    );
  }
}

export default Stream;