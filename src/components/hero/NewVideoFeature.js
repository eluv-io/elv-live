import React from "react";
import {inject, observer} from "mobx-react";
import SubscriptionPayment from "../payment/SubscriptionPayment";
import {ImageIcon} from "elv-components-js";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";

@inject("rootStore")
@inject("siteStore")
@observer
class NewVideoFeature extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  async componentDidMount() {
    await this.props.siteStore.SetVideoFeature(this.props.title);
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

      player.updateSettings({
        "streaming": {
          "abr": {
            "limitBitrateByPortal": true
          }
        }
      });
      
      this.player = player;
      this.video = element;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  preSubscribe() {
    return <SubscriptionPayment isNav={false} isFeature={true}/>;
  }

  afterSubscribe() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.title)} className={"btnPlay btnPlay__feature"}>
        {/* <PlayIcon className="modal__btn--icon" /> */}
        WATCH NOW
      </button>
    );
  }
  
  render() {    
    const featuredTitle = this.props.title;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    
    const poster = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: Math.max(500, Math.floor(vh)) }
    );


    const customLogo = this.props.siteStore.CreateLink(
      featuredTitle.logoUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

  
    const backgroundStyle = {
      backgroundSize: "cover",
      marginTop: "7rem",

    };
    
    return (
      <div
        style={backgroundStyle}
        className= "mgm-feature"
      >
        {/* <div className="mgm-feature__image" >
          <img src={thumbnail} />
        </div> */}
        <div className={"mgm-feature__video"}>
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

        <div className="mgm-feature__container">
          { customLogo ? <ImageIcon className="mgm-feature__titleIcon" icon={customLogo} label="logo"/> : <h1 className="mgm-feature__title"> {featuredTitle.displayTitle} </h1>}

          {/* {Maybe(
            synopsis,
            () => <p className="mgm-feature__overview">{ synopsis }</p>
          )} */}
          <div className="mgm-feature__button">
            { this.props.siteStore.boughtSubscription ? this.afterSubscribe() : this.preSubscribe()}

            <button onClick={() => this.props.siteStore.SetModalTitle(featuredTitle)} className="btnDetails btnDetails__featureDetail">
                VIEW DETAILS
            </button>
          </div>
        </div>

      </div>

    );
  }
}

export default NewVideoFeature;