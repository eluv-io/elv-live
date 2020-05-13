import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {ImageIcon, LoadingElement} from "elv-components-js";
import FallbackIcon from "../../static/icons/video.svg";

@inject("siteStore")
@observer
class TitleIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.PlayTitle = this.PlayTitle.bind(this);
  }

  async PlayTitle(title) {
    try {
      this.setState({loading: true});

      await this.props.siteStore.SetActiveTitle({
        channel: this.props.channels,
        playlistIndex: title.playlistIndex,
        titleIndex: title.titleIndex
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.setState({loading: false});
    }
  }

  render() {
    const title = this.props.title;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // TODO: Switch all to regular image links
    const images =  title.images || {};
    let thumbnail;
    if(images.landscape) {
      thumbnail = this.props.siteStore.CreateLink(
        title.baseLinkUrl,
        "images/landscape/thumbnail",
        { height: Math.floor(vh / 2) }
      );
    } else if(images.main_slider_background_desktop) {
      thumbnail = this.props.siteStore.CreateLink(
        title.baseLinkUrl,
        "images/main_slider_background_desktop/thumbnail",
        { height: Math.floor(vh / 2) }
      );
    } else {
      thumbnail = title.imageUrl;
    }

    return (
      <div
        className={`title ${this.props.visible ? "" : "hidden-title"}`}
        onClick={() => this.PlayTitle(title)}
      >
        <div className="ar-container">
          <LoadingElement
            loadingClassname="title-loading-indicator"
            loading={this.state.loading}
            render={() => null}
          />
          <div className="title-vignette" />
          <ImageIcon
            className="title-image"
            icon={thumbnail || FallbackIcon}
            alternateIcon={FallbackIcon}
          />
        </div>
        <h4>{title.display_title}</h4>
      </div>
    );
  }
}

TitleIcon.propTypes = {
  title: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired
};

export default TitleIcon;
