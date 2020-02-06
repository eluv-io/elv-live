import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {ImageIcon, LoadingElement} from "elv-components-js";
import FallbackIcon from "../static/icons/video.svg";

@inject("siteStore")
@observer
class TitleReel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingIndex: undefined,
      startIndex: 0,
      visible: 5
    };

    this.PlayTitle = this.PlayTitle.bind(this);
    this.TitleIcon = this.TitleIcon.bind(this);
  }

  async PlayTitle(title, index) {
    this.setState({loadingIndex: index});

    try {
      await this.props.siteStore.LoadPlayoutOptions({
        playlistIndex: title.playlistIndex,
        titleIndex: title.titleIndex
      });

      this.props.siteStore.SetActiveTitle({
        playlistIndex: title.playlistIndex,
        titleIndex: title.titleIndex
      });
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.setState({loadingIndex: undefined});
    }
  }

  TitleIcon(title, index) {
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const thumbnail = this.props.siteStore.CreateLink(
      title.baseLinkUrl,
      "images/main_slider_background_desktop/thumbnail",
      { height: Math.floor(vh / 2) }
    );

    const visible = index >= this.state.startIndex
      && index < this.state.startIndex + this.state.visible;

    return (
      <div
        className={`title ${visible ? "" : "hidden-title"}`}
        onClick={() => this.PlayTitle(title, index)}
      >
        <div className="ar-container">
          <LoadingElement
            loadingClassname="title-loading-indicator"
            loading={index === this.state.loadingIndex}
            render={() => null}
          />
          <div className="title-vignette" />
          <ImageIcon
            className="title-image"
            icon={thumbnail}
            alternateIcon={FallbackIcon}
          />
        </div>
        <h4>{title.display_title}</h4>
      </div>
    );
  }

  render() {
    const playlist = this.props.playlistIndex !== undefined && this.props.siteStore.playlists[this.props.playlistIndex];
    const reelTitle = playlist && playlist.name || "All Titles";
    const titles = playlist ? playlist.titles : this.props.siteStore.titles;

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
            { titles.map(this.TitleIcon) }
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
  playlistIndex: PropTypes.number
};

export default TitleReel;
