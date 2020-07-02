import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import FallbackIcon from "../static/icons/video.svg";

@inject("rootStore")
@inject("siteStore")
@observer
class SwiperTitleIcon extends React.Component {
  render() {

    //Getting metadata: thumbnail
    const title = this.props.title;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const thumbnail = this.props.siteStore.CreateLink(
      title.landscapeUrl || title.imageUrl,
      "",
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    return (
      <React.Fragment>
        <div className="swiper-slide" onClick={() => this.props.modalOpen(title)}>
          <ImageIcon
            className="swiper-slide__image"
            icon={thumbnail || FallbackIcon}
            alternateIcon={FallbackIcon}
          />
          <h3 className="swiper-slide__title">{ title.displayTitle }</h3>
        </div>
      </React.Fragment>
    );
  }
}

SwiperTitleIcon.propTypes = {
  title: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired
};

export default SwiperTitleIcon;
