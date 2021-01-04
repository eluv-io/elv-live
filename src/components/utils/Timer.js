import React, { Component } from "react";
import {inject, observer} from "mobx-react";
import { FaRegClock} from "react-icons/fa";
import { IconContext } from "react-icons";

@inject("rootStore")
@inject("siteStore")
@observer
export default class Timer extends Component {
    state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      premiere: false
    }

    renderClock(days, hours, minutes, seconds) {
      if(days < 10) {
        days = "0" + days.toString();
      }
      if(hours < 10) {
        hours = "0" + hours.toString();
      }
      if(minutes < 10) {
        minutes = "0" + minutes.toString();
      }
      if(seconds < 10) {
        seconds = "0" + seconds.toString();
      }
      return (

        <IconContext.Provider value={{ className: this.props.classProp }}>
          <div>
            <FaRegClock />
            <span >
              {days}:{hours}:{minutes}:{seconds}
            </span>
          </div>
        </IconContext.Provider>
      );
    }

    componentDidMount() {
      // let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");
      let premiereTime = new Date(this.props.premiereTime);
      let currentTime = new Date().getTime();
      let showTime = premiereTime - currentTime;
      
      if(showTime > 0) {
        // get total seconds between the times
        let showSeconds = Math.round(showTime / 1000); 

        // calculate (and subtract) whole days
        let showDays = Math.floor(showSeconds / 86400);
        showSeconds -= showDays * 86400;

        // calculate (and subtract) whole hours
        let showHours = Math.floor(showSeconds / 3600) % 24;
        showSeconds -= showHours * 3600;

        // calculate (and subtract) whole minutes
        let showMinutes = Math.floor(showSeconds / 60) % 60;
        showSeconds -= showMinutes * 60;

        // what's left is seconds
        showSeconds = showSeconds % 60;  // in theory the modulus is not required
        this.setState({
          days: showDays,
          hours: showHours,
          minutes: showMinutes,
          seconds: showSeconds
        });
      }

      if(!this.state.premiere) {
        this.myInterval = setInterval(() => {
          const { seconds, minutes, hours, days } = this.state;

          if(seconds > 0) {
            this.setState(({ seconds }) => ({
              seconds: seconds - 1
            }));
          }

          if(seconds === 0) {
            if(minutes === 0) {
              if(hours === 0) {
                if(days === 0) {
                  this.setState(() => ({
                    premiere: true
                  }));
                  clearInterval(this.myInterval);
                } else {
                  this.setState(({ days }) => ({
                    days: days - 1,
                    hours: 24
                  }));
                }
              } else {
                this.setState(({ hours }) => ({
                  hours: hours - 1,
                  minutes: 60
                }));
              } 
            } else {
              this.setState(({ minutes }) => ({
                minutes: minutes - 1,
                seconds: 59
              }));
            }
          } 
        }, 1000);
      }
    }

    componentWillUnmount() {
      clearInterval(this.myInterval);
    }

    render() {
      const { days, hours, minutes, seconds, premiere } = this.state;

      return (
        <div className={this.props.divProp}>
          { premiere
            ? <span>Streaming Now!</span>
            : this.renderClock(days, hours, minutes, seconds)
          }
        </div>
      );
    }
}