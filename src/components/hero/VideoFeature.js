import React from "react";
import {inject, observer} from "mobx-react";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";

@inject("rootStore")
@inject("siteStore")
@observer
class VideoFeature extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});

      // Clicked 'title' is actually a collection
      if(["site", "series", "season"].includes(this.props.title.title_type)) {
        this.props.siteStore.LoadSite(this.props.title.objectId);
      } else {
        await this.props.siteStore.SetVideoFeature(this.props.title);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.setState({loading: false});
    }
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.player) {
      this.player.destroy ? this.player.destroy() : this.player.reset();
    }
  }

  InitializeVideo(element) {
    if(!element) { return; }

    this.DestroyPlayer();

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));

      const offering = this.props.title.currentOffering;
      let playoutOptions = this.props.title.playoutOptions;

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

  render() {    
    const featuredTitle = this.props.title;
    const titleInfo = featuredTitle.info || {};
    const synopsis = titleInfo.synopsis;
    const poster = featuredTitle.landscapeUrl || featuredTitle.imageUrl;

    const Maybe = (value, render) => value ? render() : null;

    // const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    // const thumbnail = this.props.siteStore.CreateLink(
    //   featuredTitle.landscapeUrl || featuredTitle.imageUrl,
    //   "",
    //   { height: Math.max(150, Math.floor(vh / 3)) }
    // );

    const backgroundStyle = {
      backgroundSize: "cover",
      marginTop: "7rem",
      // backgroundImage: `url(${thumbnail})`,
      // opacity: ".1"
    };

    return (
      <div
        style={backgroundStyle}
        className= "video-feature"
      >
        <div className={"video-feature__video"}>
          <video
            id="background-video" 
            loop
            autoPlay
            muted={true}
            key={`active-title-video-${featuredTitle.titleId}-${featuredTitle.currentOffering}`}
            ref={this.InitializeVideo}
            poster={poster}
            controls={this.state.showControls}
          />
        </div>

        <div className="video-feature__container">
          <h1 className="video-feature__title">
            {featuredTitle.displayTitle}
          </h1>
          <div className="video-feature__button">   
            <button onClick={() => this.props.playTitle(featuredTitle)} className={"btnPlay btnPlay__feature"}>
              {/* <PlayIcon className="modal__btn--icon" /> */}
                Play Now
            </button>

            <button onClick={() => this.props.modalOpen(featuredTitle)} className="btnDetails btnDetails__feature">
                View Details
            </button>
          </div>

          {Maybe(
            synopsis,
            () => <p className="video-feature__overview">{ synopsis }</p>
          )}
            
        </div>
          
      </div>
    );
  }
}

export default VideoFeature;