import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import TitleIcon from "./TitleIcon";

@inject("siteStore")
@observer
class TitleGrid extends React.Component {
  render() {
    const playlist = this.props.playlistIndex !== undefined && this.props.siteStore.playlists[this.props.playlistIndex];
    const reelTitle = playlist && playlist.name || this.props.channels && "Channels" || "All Titles";

    let titles;
    if(playlist) {
      titles = playlist.titles;
    } else if(this.props.channels) {
      titles = this.props.siteStore.channels;
    } else {
      titles = this.props.siteStore.titles;
    }

    if(titles.length === 0) {
      return null;
    }

    return (
      <div className="title-grid-container">
        <h3 className="title-grid-header">{ reelTitle }</h3>
        <div className="title-grid-titles">
          {
            titles.map((title, index) => (
              <TitleIcon
                key={`title-grid-title-${index}-${this.props.playlistIndex}`}
                title={title}
                visible
              />
            ))
          }
        </div>
      </div>
    );
  }
}

TitleGrid.propTypes = {
  channels: PropTypes.bool,
  playlistIndex: PropTypes.number
};

export default TitleGrid;
