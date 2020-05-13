import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import TitleIcon from "./TitleIcon";

@inject("siteStore")
@observer
class TitleReel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startIndex: 0,
      visible: 5
    };
  }

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

    const showLeft = this.state.startIndex !== 0;
    const showRight = this.state.startIndex + this.state.visible < titles.length;

    return (
      <div className="title-reel-container">
        <h3 className="title-reel-header">{ reelTitle }</h3>
        <div className="title-reel">
          <div
            className={`reel-arrow reel-arrow-left ${showLeft ? "" : "hidden"}`}
            onClick={event => {
              event.stopPropagation();
              this.setState({startIndex: this.state.startIndex - 1});
            }}
          >
            ➢
          </div>

          <div className="title-reel-titles">
            {
              titles.map((title, index) => (
                <TitleIcon
                  key={`title-reel-title-${index}-${this.props.playlistIndex}`}
                  title={title}
                  visible={index >= this.state.startIndex && index < this.state.startIndex + this.state.visible}
                />
              ))
            }
          </div>

          <div
            className={`reel-arrow reel-arrow-right ${showRight ? "" : "hidden"}`}
            onClick={event => {
              event.stopPropagation();
              this.setState({startIndex: this.state.startIndex + 1});
            }}
          >
            ➢
          </div>
        </div>
      </div>
    );
  }
}

TitleReel.propTypes = {
  channels: PropTypes.bool,
  playlistIndex: PropTypes.number
};

export default TitleReel;
