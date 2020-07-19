import React from "react";
import {inject, observer} from "mobx-react";
import { Dropdown } from "semantic-ui-react";
import AsyncComponent from "../AsyncComponent";
import TitleGrid from "../grid/TitleGrid";

@inject("rootStore")
@inject("siteStore")
@observer
class ModalEpisodes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0
    };

    this.PageContent = this.PageContent.bind(this);
  }

  Seasons() {
    return (this.props.siteStore.assets[this.props.title.versionHash] || {assets: {}}).assets.seasons || [];
  }

  Episodes() {
    const season = this.Seasons()[this.state.selected];
    const episodes = (this.props.siteStore.assets[season.versionHash] || {assets: {}}).assets.episodes || [];
    return (
      <AsyncComponent
        key={`episode-list-${this.state.selected}`}
        Load={async () => {
          // Load season to resolve episode info
          if(this.props.siteStore.assets[season.versionHash]) {
            return;
          }

          await this.props.siteStore.LoadAsset(season.baseLinkPath);
        }}
        render={() => (
          <TitleGrid
            name=""
            titles={episodes}
            trailers={true}
            shouldPlay={true}
            isEpisode={true}
            isPoster={false}
          />
        )}
      />
    );
  }

  PageContent() {
    const seasons = this.Seasons()
      .map((season, i) => ({
        key: `season-${i}`,
        text: season.displayTitle,
        value: i
      }));

    return (
      <React.Fragment>
        <div className={`modal__container ${this.props.showTab === "Episodes" ? "" : "hide"}`}>
          <h1 className="modal__title">
            {this.props.title.displayTitle}
          </h1>

          {this.Episodes()}
        </div>
        <div className={`modal__dropdown ${this.props.showTab === "Episodes" ? "" : "hide"}`}>
          <Dropdown
            fluid
            selection
            options={seasons}
            value={this.state.selected}
            onChange={(_, data) => this.setState({selected: parseInt(data.value)})}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <AsyncComponent
        Load={async () => {
          // Load series to resolve season info
          if(this.props.siteStore.assets[this.props.title.versionHash]) {
            return;
          }

          await this.props.siteStore.LoadAsset(this.props.title.baseLinkPath);
        }}
        render={this.PageContent}
      />
    );
  }
}

export default ModalEpisodes;
