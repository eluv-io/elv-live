import React from "react";
import PropTypes from "prop-types";
import HLSPlayer from "hls.js";
import {inject, observer} from "mobx-react";
import {ImageIcon, LoadingElement} from "elv-components-js";
import BackIcon from "../static/icons/back.svg";

@inject("siteStore")
@observer
class Title extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.PlayTitle = this.PlayTitle.bind(this);
    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  async PlayTitle() {
    this.setState({loading: true});

    await this.props.siteStore.LoadPlayoutOptions({
      playlistIndex: this.props.title.playlistIndex,
      titleIndex: this.props.title.titleIndex
    });
    this.props.siteStore.SetActiveTitle({
      playlistIndex: this.props.title.playlistIndex,
      titleIndex: this.props.title.titleIndex
    });

    this.setState({loading: false});
  }

  InitializeVideo(element) {
    if(!element) { return; }

    try {
      const playoutMethods = this.props.title.playoutOptions.hls.playoutMethods;
      // Prefer AES playout
      const playoutUrl = (playoutMethods["aes-128"] || playoutMethods.clear).playoutUrl;

      const player = new HLSPlayer();

      player.loadSource(playoutUrl);
      player.attachMedia(element);

      element.scrollIntoView({behavior: "smooth"});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    if(
      this.props.siteStore.activeTitle.titleIndex === undefined ||
      this.props.siteStore.activeTitle.playlistIndex !== this.props.title.playlistIndex
    ) {
      // No active title in playlist- Show title thumbnail
      const thumbnail = this.props.siteStore.CreateLink(
        this.props.title.baseLinkUrl,
        "images/thumbnail/default"
      );

      return (
        <div className="title" onClick={this.PlayTitle}>
          <div className="loading-icon">
            <LoadingElement loading={this.state.loading} render={() => null} />
          </div>
          <div className="ar-container">
            <img
              src={thumbnail}
            />
          </div>
          <h4>{ this.props.title.display_title }</h4>
        </div>
      );
    }

    // Hide unless this title is the active title in the playlist
    if(
      this.props.siteStore.activeTitle.playlistIndex === this.props.title.playlistIndex &&
      this.props.siteStore.activeTitle.titleIndex !== this.props.title.titleIndex
    ) {
      return null;
    }

    // Active title

    return (
      <div className="title">
        <h4>
          <ImageIcon
            className="back-button"
            label="Back"
            icon={BackIcon}
            onClick={this.props.siteStore.ClearActiveTitle}
          />
          { this.props.title.display_title }
        </h4>
        <video
          ref={this.InitializeVideo}
          autoPlay
          controls
        />
      </div>
    );
  }
}

Title.propTypes = {
  title: PropTypes.object.isRequired
};

export default Title;
