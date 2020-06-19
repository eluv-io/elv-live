import React from "react";
import HLSPlayer from "../../../node_modules/hls.js/dist/hls";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {DateTime} from "luxon";

import FallbackIcon from "../../static/icons/video.svg";

@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
      activeTab: "Video",
      tabs: ["Video", "Details", "Metadata"]
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.player) {
      this.player.destroy ? this.player.destroy() : this.player.reset();
    }
  }

  Tabs() {
    return (
      <nav className="tabs">
        {
          this.state.tabs.map(tab =>
            <button
              key={`active-title-tab-${tab}`}
              className={tab === this.state.activeTab ? "active-tab" : ""}
              onClick={() => {
                this.setState({activeTab: tab});
                if(this.video) {
                  this.video.pause();
                }
              }}
            >
              { tab }
            </button>
          )
        }
      </nav>
    );
  }

  Schedule() {
    return {};
  }

  InitializeVideo(element) {
    if(!element) { return; }

    this.DestroyPlayer();

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));

      const offering = this.props.siteStore.activeTitle.currentOffering;
      let playoutOptions = this.props.siteStore.activeTitle.playoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

      playoutOptions = playoutOptions[offering];

      let player;
      if(this.props.siteStore.dashSupported && playoutOptions.dash) {
        // DASH

        player = DashJS.MediaPlayer().create();

        const playoutUrl = (playoutOptions.dash.playoutMethods.widevine || playoutOptions.dash.playoutMethods.clear).playoutUrl;
        if(playoutOptions.dash.playoutMethods.widevine) {
          const widevineUrl = playoutOptions.dash.playoutMethods.widevine.drms.widevine.licenseServers[0];

          player.setProtectionData({
            "com.widevine.alpha": {
              "serverURL": widevineUrl
            }
          });
        }

        player.initialize(element, playoutUrl);
      } else {
        // HLS

        // Prefer AES playout
        const playoutUrl = (playoutOptions.hls.playoutMethods["aes-128"] || playoutOptions.hls.playoutMethods.clear).playoutUrl;

        if(!HLSPlayer.isSupported()) {
          element.src = playoutUrl;
          return;
        }

        const player = new HLSPlayer();
        player.loadSource(playoutUrl);
        player.attachMedia(element);
      }

      this.player = player;
      this.video = element;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  Offerings() {
    const availableOfferings = this.props.siteStore.activeTitle.availableOfferings;

    if(!availableOfferings || Object.keys(availableOfferings).length < 2) {
      return null;
    }

    return (
      <select
        className="active-title-offerings"
        onChange={event => this.props.siteStore.LoadActiveTitleOffering(event.target.value)}
      >
        {Object.keys(availableOfferings).map(offeringKey =>
          <option key={`offering-${offeringKey}`} value={offeringKey}>
            { availableOfferings[offeringKey].display_title || offeringKey }
          </option>
        )}
      </select>
    );
  }

  MetadataPage() {
    const title = this.props.siteStore.activeTitle;

    return (
      <div className={`active-title-metadata ${this.state.activeTab === "Metadata" ? "" : "hidden"}`}>
        <h2>{ title.displayTitle.toString() } - Metadata</h2>
        <div className="metadata-path">{title.isSearchResult ? "" : this.props.siteStore.siteInfo.name + " - "}{title.baseLinkPath}</div>
        <pre>
          { JSON.stringify(title.metadata, null, 2)}
        </pre>
      </div>
    );
  }

  DetailsPage() {
    const title = this.props.siteStore.activeTitle;

    const titleInfo = title.info || {};

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`active-title-details-page ${this.state.activeTab === "Details" ? "" : "hidden"}`}>
        <ImageIcon icon={title.portraitUrl || title.imageUrl || title.landscapeUrl || FallbackIcon} alternateIcon={FallbackIcon} className="active-title-detail-image" title="Poster" />
        <div className="active-title-details">
          <h2>{ title.displayTitle.toString() }</h2>
          {Maybe(
            titleInfo.synopsis,
            () => <div className="synopsis">{ titleInfo.synopsis.toString() }</div>
          )}
          <div className="details-section">
            {Maybe(
              titleInfo.talent && titleInfo.talent.cast,
              () => <div className="detail">
                <label>Cast</label>
                { titleInfo.talent.cast.map(actor => `${actor.talent_first_name} ${actor.talent_last_name}`).join(", ") }
              </div>
            )}
            {Maybe(
              titleInfo.runtime,
              () => <div className="detail">
                <label>Runtime</label>
                { titleInfo.runtime } minutes
              </div>
            )}
            {Maybe(
              titleInfo.release_date,
              () => <div className="detail">
                <label>Release Date</label>
                { new Date(titleInfo.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"}) }
              </div>
            )}
            {Maybe(
              titleInfo.creator,
              () => <div className="detail">
                <label>Creator</label>
                { titleInfo.creator }
              </div>
            )}
          </div>
          {Maybe(
            titleInfo.copyright,
            () => <div className="copyright">
              { titleInfo.copyright.toString().startsWith("©") ? "" : "©" } { titleInfo.copyright.toString() }
            </div>
          )}
        </div>
      </div>
    );
  }

  VideoPage() {
    const { schedule, currentIndex, date } = this.Schedule();

    const title = this.props.siteStore.activeTitle;

    let displayTitle = title.displayTitle;
    let synopsis = (title.info || {}).synopsis || "";
    if(currentIndex !== undefined) {
      const program = schedule[currentIndex];
      displayTitle = program.title || displayTitle;
      synopsis = program.description !== undefined ? program.description : synopsis;
    }

    const poster = this.props.siteStore.activeTitle.landscapeUrl || this.props.siteStore.activeTitle.imageUrl;

    // Include poster image to pre-load it for details page
    return (
      <div className={`active-title-video-page ${this.state.activeTab === "Video" ? "" : "hidden"}`}>
        <ImageIcon icon={title.portraitUrl || title.imageUrl || title.landscapeUrl} className="hidden" />
        <video
          key={`active-title-video-${title.titleId}-${title.currentOffering}`}
          ref={this.InitializeVideo}
          autoPlay
          poster={poster}
          controls={this.state.showControls}
        />
        <div className="video-info">
          <h4>
            { displayTitle.toString() }
            { this.Offerings() }
          </h4>
          <div className="synopsis">
            { synopsis.toString() }
          </div>

        </div>
      </div>
    );
  }

  render() {
    if(!this.props.siteStore.activeTitle) { return null; }

    return (
      <div className="active-title">
        { this.Tabs() }
        { this.VideoPage() }
        { this.DetailsPage() }
        { this.MetadataPage() }
      </div>
    );
  }
}

export default ActiveTitle;
