import React from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import {ImageIcon} from "elv-components-js";
import Select from 'react-select';

import ViewStream from "./ViewStream";
import AsyncComponent from "../../support/AsyncComponent";
import StreamTabs from './StreamTabs';
import Timer from "../Payment/Timer";

const options = [
  { value: '0', label: 'MULTIVIEW 1' },
  { value: '1', label: 'MULTIVIEW 2' },
  { value: '2', label: 'MULTIVIEW 3' },
  { value: 'all', label: 'ALL VIEWS' },
];

@inject("rootStore")
@inject("siteStore")
@observer
class StreamBox extends React.Component {
  state = {
    selectedOption: options[0],
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  renderFeed(selectedOption) {
    if (selectedOption.value == 'all') {
      return (
        // TODO: For 'all' multiview, make all the streams play at the same time
        <div className={this.props.siteStore.showFeed ? "stream-container__streamBox--feedGrid" : "hide"}>
          <ViewStream feedOption={0} classProp = "stream-container__streamBox--video1" mutedOption = {true}/>
          {/* <ViewStream feedOption={1} classProp = "stream-container__streamBox--video2" mutedOption = {true}/>
          <ViewStream feedOption={2} classProp = "stream-container__streamBox--video3" mutedOption = {true}/> */}
        </div>
      );
    } else {
      return (
        <ViewStream feedOption={selectedOption.value} classProp = "stream-container__streamBox--video" mutedOption = {false}/>
      );
    }
  }

  render() {
    if(!this.props.rootStore.client || (!this.props.rootStore.accessCode && !this.props.rootStore.chatClient)) {
      return <Redirect to={`/code`} />;
    }
    const { selectedOption } = this.state;
    console.log(this.props.feedOption);
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    return (
      <AsyncComponent
        Load={async () => {

        }}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="stream-container">

              <div className="stream-container__streamBox">
                <div className="stream-container__streamBox--video ">
                  <Timer classProp="ticket-icon-clock" divProp="stream-countdown"/>
                </div>

                <div className="stream-container__streamBox--info">
                  <h2 className="stream-container__streamBox--info__subtitle">
                    Rita Ora 
                  </h2>
                  <h1 className="stream-container__streamBox--info__title">
                    RO3 World Tour - Eiffel Tower
                  </h1>
                </div> 
              </div>
            </div>
          );
        }}
      />
    );
  }
}

export default StreamBox;