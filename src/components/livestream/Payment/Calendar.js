import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import Logo from "../../../assets/images/logo/darkLogo.png";
import axios from "axios";
import AsyncComponent from "../../utils/AsyncComponent";
import Navigation from "../../home/Navigation";
import AddToCalendar from 'react-add-to-calendar';

@inject("rootStore")
@inject("siteStore")
@observer
class Calendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      sessionId: ""
    };
  }

  render() {
    // if (!this.props.match.params.id) {
    //   return null;
    // }
    const sessionId = this.props.match.params.id;
    const sessionEmail = this.props.match.params.email;

    let calendarEvent = {
      title: 'Rita Ora - Live From The Eiffel Tower',
      description: 'Rita Ora will be making history on February 28th with a global live stream from the legendary Paris landmark, the Eiffel Tower, to celebrate the release of her third studio album: RO3.',
      location: 'Paris, France (Virtual)',
      startTime: '2021-02-28T20:15:00-04:00',
      endTime: '2021-02-28T21:45:00-04:00'
  };
    
    return (
        <div className="success-container">
          <Navigation/>
  
          <div className="success-root">
            <div className="summary">
              <div className="payment-overview">
                <h1 className="payment-overview-title">Thanks for your order!</h1>
                <h2 className="payment-overview-p"> If you have questions on how to access the event or would like more details, please visit our FAQ. </h2>
              </div>

              <div className="back-btn-container">
                {/* <Link to="/d457a576/rita-ora" className="eventBTN">Back to Event</Link> */}
                <AddToCalendar event={calendarEvent}/>
              </div>

            </div>
          </div>
        </div>
      );
  }
}


export default Calendar;
