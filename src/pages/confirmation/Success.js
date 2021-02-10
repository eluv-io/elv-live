import React from "react";
import {inject, observer} from "mobx-react";
import AddToCalendar from "react-add-to-calendar";

@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {
  render() {
    let calendarData = this.props.siteStore.calendarEvent;
    let calendarEvent = {
      title: calendarData.title,
      description: calendarData.description,
      location: calendarData.location,
      startTime: calendarData.start_time,
      endTime: calendarData.end_time
    };

    return (
      <div className="page-container success-container">
        <div className="main-content-container success-root">
          <div className="summary">
            <div className="payment-overview">
              <h1 className="payment-overview-title">Thanks for your order!</h1>
              <h2 className="payment-overview-p">We've received your order and are proccessing your payment! Your digital ticket will be sent to {this.props.match.params.email} shortly. </h2>
            </div>
          </div>

          <div className="confirmation-number">
            <div className="line-item confirm">
              <p className="confirm-label">Confirmation #</p>
              <p className="confirm-price">{this.props.match.params.id}</p>
            </div>
          </div>

          <AddToCalendar
            event={calendarEvent}
            buttonLabel="Add to Calendar"
            rootClass="calendar-button-container"
            buttonWrapperClass="calendar-button"
            buttonClassOpen="open"
            dropdownClass="calendar-button-dropdown"
          />
        </div>
      </div>
    );
  }
}


export default Success;
