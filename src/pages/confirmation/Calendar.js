import React from "react";
import {inject, observer} from "mobx-react";
import Navigation from "../../components/layout/Navigation";
import AddToCalendar from 'react-add-to-calendar';

@inject("rootStore")
@inject("siteStore")
@observer
class Calendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      calendarData: this.props.siteStore.eventSites["rita-ora"]["calendar"][0]
    };
  }

  render() {
    let calendarData = this.state.calendarData;
    let calendarEvent = {
      title: calendarData["title"],
      description: calendarData["description"],
      location: calendarData["location"],
      startTime: calendarData["start_time"],
      endTime: calendarData["end_time"]
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
                <AddToCalendar event={calendarEvent}/>
              </div>

            </div>
          </div>
        </div>
      );
  }
}


export default Calendar;
