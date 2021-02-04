import React from "react";
import {inject, observer} from "mobx-react";
import Navigation from "Layout/Navigation";
import CalendarButton from "Confirmation/components/CalendarButton";

@inject("rootStore")
@inject("siteStore")
@observer
class Calendar extends React.Component {

  render() {
    let calendarData = this.props.siteStore.currentSite["calendar"][0];
    let calendarEvent = {
      title: calendarData["title"],
      description: calendarData["description"],
      location: calendarData["location"],
      startTime: calendarData["start_time"],
      endTime: calendarData["end_time"]
    };

    return (
      <div className="page-container success-container">
        <Navigation/>

        <div className="success-root">
          <div className="summary">
            <div className="payment-overview">
              <h1 className="payment-overview-title">Thanks for your order!</h1>
              <h2 className="payment-overview-p"> If you have questions on how to access the event or would like more details, please visit our FAQ. </h2>
            </div>

            <CalendarButton />


          </div>
        </div>
      </div>
    );
  }
}


export default Calendar;
