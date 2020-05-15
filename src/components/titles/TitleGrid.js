import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import TitleIcon from "./TitleIcon";

import ClearSearchIcon from "../../static/icons/clear.svg";
import {IconButton, LoadingElement} from "elv-components-js";

@inject("siteStore")
@observer
class TitleGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searching: false
    };

    this.HandleSearchChange = this.HandleSearchChange.bind(this);
  }

  // Debounce filter input
  HandleSearchChange(event) {
    const value = event.target.value;

    if(this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    this.setState({
      search: value,
      searching: true,
      searchTimeout: setTimeout(
        async () => {
          const initialSearch = this.state.search;
          try {
            await this.props.siteStore.SearchTitles({query: this.state.search});
          } finally {
            // Don't clear indicator if search query has changed
            if(this.state.search === initialSearch) {
              this.setState({searching: false});
            }
          }
        }, 1000
      )
    });
  }

  Search() {
    return (
      <div className="title-search">
        <input value={this.state.search} onChange={this.HandleSearchChange} placeholder="Filter titles..."/>
        <IconButton icon={ClearSearchIcon} className="clear-search" title="Clear" onClick={() => this.HandleSearchChange({target: { value: "" }})} />
      </div>
    );
  }

  render() {
    const playlist = this.props.playlistIndex !== undefined && this.props.siteStore.playlists[this.props.playlistIndex];
    const reelTitle = playlist && playlist.name || this.props.channels && "Channels" || "All Titles";
    const hasSearch = reelTitle === "All Titles" && this.props.siteStore.siteInfo.indexHash;

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
        <h3 className="title-grid-header">{ reelTitle } {hasSearch ? this.Search() : null}</h3>
        <LoadingElement loading={this.state.searching} loadingClassname="loading-indicator">
          <div className="title-grid-titles">
            {
              titles.map((title, index) => {
                if(hasSearch && this.state.search && !this.props.siteStore.filteredTitles.includes(title.objectId)) {
                  return null;
                }

                return (
                  <TitleIcon
                    key={`title-grid-title-${index}-${this.props.playlistIndex}`}
                    title={title}
                    visible
                  />
                );
              })
            }
          </div>
        </LoadingElement>
      </div>
    );
  }
}

TitleGrid.propTypes = {
  channels: PropTypes.bool,
  playlistIndex: PropTypes.number
};

export default TitleGrid;
