import React, { Component } from 'react'
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
export default class Timer extends Component {
    state = {
      minutes: 0,
      seconds: 5,
    }

    componentDidMount() {
      this.myInterval = setInterval(() => {
          const { seconds, minutes } = this.state

          if (seconds > 0) {
            this.setState(({ seconds }) => ({
              seconds: seconds - 1
            }))
          }
          if (seconds === 0) {
            if (minutes === 0) {
              clearInterval(this.myInterval)
              this.props.siteStore.setPremiereCountdown();
            } else {
              this.setState(({ minutes }) => ({
                minutes: minutes - 1,
                seconds: 59
            }))
          }
        } 
      }, 1000);
    };

    componentWillUnmount() {
      clearInterval(this.myInterval);
    };

    render() {
      const { minutes, seconds } = this.state;
      return (
        <div>
          { minutes === 0 && seconds === 0
            ? <h1>Premiering Now!</h1>
            : <h1>Premiering in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
          }
        </div>
      );
    }
}