import React from "react";
import {inject, observer} from "mobx-react";
import AddToCalendar from "react-add-to-calendar";

@inject("rootStore")
@inject("siteStore")
@observer
class CalendarButton extends React.Component {

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
      <div className="back-btn-container">
        <AddToCalendar event={calendarEvent}/>
      </div>
    );
  }
}


export default CalendarButton;
