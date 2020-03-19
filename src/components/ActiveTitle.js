import React from "react";
import HLSPlayer from "hls.js";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import BackIcon from "../static/icons/back.svg";
import {DateTime} from "luxon";
import FallbackIcon from "../static/icons/video.svg";

@inject("siteStore")
@observer
class ChannelSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startIndex: props.currentIndex || 0,
      visible: 5
    };
  }

  ProgramIcon(program, index) {
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const thumbnail = this.props.siteStore.CreateLink(
      this.props.siteStore.activeTitle.baseLinkUrl,
      `channel_info/schedule/daily_schedules/${this.props.date}/${index}/program_image/thumbnail`,
      { height: Math.floor(vh / 2) }
    );

    const visible = index >= this.state.startIndex
      && index < this.state.startIndex + this.state.visible;

    const startTime = DateTime.fromMillis(program.start_time_epoch).toLocaleString(DateTime.TIME_SIMPLE);

    return (
      <div
        key={`title-${index}-${program.title}`}
        className={`title ${visible ? "" : "hidden-title"}`}
      >
        <div className="ar-container">
          { index === this.props.currentIndex ? <div className="current-program-indicator" /> : null }
          <div className="title-vignette" />
          <ImageIcon
            className="title-image"
            icon={thumbnail}
            alternateIcon={FallbackIcon}
          />
        </div>
        <h4>{program.title} - {startTime}</h4>
      </div>
    );
  }

  render() {
    if(!this.props.schedule) { return null; }

    const showLeft = this.state.startIndex !== 0;
    const showRight = this.state.startIndex + this.state.visible < this.props.schedule.length;

    return (
      <div className="title-reel-container channel-schedule-reel">
        <h3 className="title-reel-header">Schedule</h3>
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
            { this.props.schedule.map((program, i) => this.ProgramIcon(program, i)) }
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

@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      poster: props.siteStore.CreateLink(
        this.props.siteStore.activeTitle.baseLinkUrl,
        "images/main_slider_background_desktop/default"
      ),
      showControls: false
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentWillUnmount() {
    if(this.player) {
      this.player.destroy();
    }
  }

  Schedule() {
    const channel = this.props.siteStore.activeTitle;
    const date = DateTime.local().toFormat("yyyyLLdd");

    if(!channel.channel_info || !channel.channel_info.schedule || !channel.channel_info.schedule.daily_schedules) {
      return { date };
    }

    const schedule = channel.channel_info.schedule.daily_schedules[date];

    const now = DateTime.local().ts;
    const currentIndex = schedule.findIndex(program =>
      program.start_time_epoch <= now &&
      (program.start_time_epoch + program.duration_sec * 1000) >= now
    );

    return {
      schedule,
      currentIndex: currentIndex >= 0 ? currentIndex : undefined,
      date
    };
  }

  InitializeVideo(element) {
    if(!element) {
      return;
    }

    if(this.player) {
      this.player.destroy();
    }

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));

      const playoutMethods = this.props.siteStore.activeTitle.playoutOptions.hls.playoutMethods;
      // Prefer AES playout
      const playoutUrl = (playoutMethods["aes-128"] || playoutMethods.clear).playoutUrl;

      const player = new HLSPlayer();

      player.loadSource(playoutUrl);
      player.attachMedia(element);

      this.player = player;

      element.scrollIntoView(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    if(!this.props.siteStore.activeTitle || !this.props.siteStore.activeTitle.playoutOptions) { return null; }

    const { schedule, currentIndex, date } = this.Schedule();

    let title = this.props.siteStore.activeTitle.display_title;
    let synopsis = this.props.siteStore.activeTitle.info.synopsis;
    if(currentIndex !== undefined) {
      const program = schedule[currentIndex];
      title = program.title || title;
      synopsis = program.description !== undefined ? program.description : synopsis;
    }

    return (
      <div className="active-title">
        <video
          ref={this.InitializeVideo}
          autoPlay
          poster={this.state.poster}
          controls={this.state.showControls}
        />
        <h4>
          <ImageIcon
            className="back-button"
            title="Back"
            icon={BackIcon}
            onClick={this.props.siteStore.ClearActiveTitle}
          />
          { title }
        </h4>
        <div className="synopsis">
          { synopsis }
        </div>
        <ChannelSchedule
          schedule={schedule}
          date={date}
          currentIndex={currentIndex}
        />
      </div>
    );
  }
}

export default ActiveTitle;
