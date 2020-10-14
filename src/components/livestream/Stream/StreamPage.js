import React from "react";
import {inject, observer, Provider} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import ViewStream from "./ViewStream";
import AsyncComponent from "../../AsyncComponent";
import Select from 'react-select';
import StreamTabs from './StreamTabs';
import {Redirect} from "react-router";

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
    console.log(`Option selected:`, selectedOption);
  };

  renderFeed(selectedOption) {
    if (selectedOption.value == 'all') {
      return (
        <div className="stream-container__streamBox--feedGrid">
          <ViewStream feedOption={0} classProp = "stream-container__streamBox--video1"/>
          <ViewStream feedOption={1} classProp = "stream-container__streamBox--video2"/>
          <ViewStream feedOption={2} classProp = "stream-container__streamBox--video3"/>
        </div>
      );
    } else {
      return (
        // <ViewStream title = {this.props.siteStore.feeds[selectedOption.value]} classProp = "stream-container__streamBox--video"/>
        <ViewStream feedOption={selectedOption.value} classProp = "stream-container__streamBox--video"/>
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
                    // styles={colourStyles}

                    // theme={(theme) => ({
                    //   ...theme,
                    //   colors: {
                    //   ...theme.colors,
                    //     text: 'black',
                    //     primary25: 'rgba(0, 0, 0, 0.3)',
                    //     primary: '#030b30',
                    //   },
                    // })}
                  />
                </div>

                {this.renderFeed(selectedOption)}

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

              <StreamTabs />
            </div>
          );
        }}
      />
    );
  }
}

export default Stream;