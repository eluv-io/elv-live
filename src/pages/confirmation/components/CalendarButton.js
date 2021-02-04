import React from "react";
import {inject, observer} from "mobx-react";
import AddToCalendar from "@culturehq/add-to-calendar";

@inject("rootStore")
@inject("siteStore")
@observer
class CalendarButton extends React.Component {
  render() {
    let calendarData = this.props.siteStore.calendarEvent;
    let calendarEvent = {
      name: calendarData.title,
      details: calendarData.description,
      location: calendarData.location,
      startsAt: calendarData.start_time,
      endsAt: calendarData.end_time
    };

    return (
      <div className="back-btn-container">
        <AddToCalendar
          event={calendarEvent}
          buttonLabel="Add to Calendar"
          rootClass="calendar-button-root"
          buttonWrapperClass="calendar-button"
          buttonClassOpen="open"
          dropdownClass="calendar-button-dropdown"
        />
      </div>
    );
  }
}


export default CalendarButton;
