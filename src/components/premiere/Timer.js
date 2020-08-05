import React, { Component } from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
export default class Timer extends Component {
    state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    renderClock(days, hours, minutes, seconds) {
      return (
        <React.Fragment>
          <h1 className="bigtext">Premiering in: </h1>
          <div id="clockdiv" >
            <div>
              <span className="days"> {days} </span>
              <div className="smalltext">Days</div>
            </div>
            <div>
              <span className="hours"> {hours} </span>
              <div className="smalltext">Hours</div>
            </div>
            <div>
              <span className="minutes"> {minutes}</span>
              <div className="smalltext">Minutes</div>
            </div>
            <div>
              <span className="seconds"> {seconds} </span>
              <div className="smalltext">Seconds</div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    componentDidMount() {
      let premiereTime = this.props.siteStore.premiere.premieresAt;
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

      if(!this.props.siteStore.premiereCountdown) {
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
                  clearInterval(this.myInterval);
                  this.props.siteStore.setPremiereCountdown();
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
      const { days, hours, minutes, seconds } = this.state;
      return (
        <div className="premiere-view-container__timer">
          { this.props.siteStore.premiereCountdown
            ? <h1 className="bigtext">Premiering Now!</h1>
            : this.renderClock(days, hours, minutes, seconds)
          }
        </div>
      );
    }
}