import React from "react";
import SwiperGrid from "../SwiperGrid";
import {inject, observer} from "mobx-react";
import { Dropdown } from "semantic-ui-react";
import AsyncComponent from "../../../AsyncComponent";
import SearchGrid from "../SearchGrid";

@inject("rootStore")
@inject("siteStore")
@observer
class ModalEpisodes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0
    };
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
          if(this.props.siteStore.assets[season.versionHash]) {
            return;
          }

          await this.props.siteStore.LoadAsset(season.baseLinkPath);
        }}
        render={() => (
          <SwiperGrid
            name=""
            titles={episodes}
            modalClose={this.props.modalClose}
            modalOpen={this.props.modalOpen}
            playTitle={this.props.playTitle}
            trailers={true}
            shouldPlay={true}
            isEpisode={true}
          />
        )}
      />
    );
  }

  render() {
    const featuredTitle = this.props.title;
    const dropdownStyle = {
      width: "20rem",
      marginLeft: "6rem",
      marginTop: "4rem",
    };

    const seasons = this.Seasons()
      .map((season, i) => ({
        key: `season-${i}`,
        text: season.displayTitle,
        value: i
      }));

    if(seasons.length === 0) { return null; }

    return (
      <div className={`modal__container ${this.props.showTab === "Episodes" ? "" : "hide"}`}>
        <h1 className="modal__title">
          {featuredTitle.displayTitle}
        </h1>
        
        { this.Episodes() }
        <Dropdown
          fluid
          selection
          options={seasons}
          value={this.state.selected}
          style={dropdownStyle}
          onChange={(_, data) => this.setState({selected: parseInt(data.value)})}
        />
      </div>
    );
  }
}

export default ModalEpisodes;