import React from "react";
import {inject, observer} from "mobx-react";
import AddToCalendar from "react-add-to-calendar";

@inject("rootStore")
@inject("cartStore")
@inject("siteStore")
@observer
class Success extends React.Component {
  componentDidMount() {
    this.props.cartStore.OrderComplete(this.props.match.params.id);
  }

  render() {
    let calendarEvent;
    if(this.props.cartStore.purchasedTicketStartDate) {
      try {
        const startDate = new Date(this.props.cartStore.purchasedTicketStartDate);
        const endDate = this.props.cartStore.purchasedTicketEndDate ? new Date(this.props.cartStore.purchasedTicketEndDate) : undefined;

        const calendarData = this.props.siteStore.calendarEvent;
        calendarEvent = {
          title: calendarData.title,
          description: calendarData.description,
          location: calendarData.location,
          startTime: startDate,
          // End time just set to an hour from start
          endTime: endDate || new Date(startDate.getTime() + 60 * 60 * 1000)
        };
      } catch(error) {
        // eslint-disable-next-line no-console
        console.error("Error determining calendar date", this.props.cartStore.purchasedTicketStartDate, this.props.cartStore.purchasedTicketEndDate);
      }
    }

    return (
      <div className="page-container success-container">
        <div className="main-content-container success-root">
          <div className="summary">
            <div className="payment-overview">
              <h1 className="payment-overview-title">Thanks for your order!</h1>
              <h2 className="payment-overview-p">We've received your order and are processing your payment! Your digital ticket will be sent to {this.props.cartStore.email} shortly. </h2>
            </div>
          </div>

          <div className="confirmation-number">
            <div className="line-item confirm">
              <p className="confirm-label">Confirmation #</p>
              <p className="confirm-price">{this.props.match.params.id}</p>
            </div>
          </div>

          {
            calendarEvent ?
              <AddToCalendar
                event={calendarEvent}
                buttonLabel="Add to Calendar"
                rootClass="calendar-button-container"
                buttonWrapperClass="calendar-button"
                buttonClassOpen="open"
                dropdownClass="calendar-button-dropdown"
              /> : null
          }
        </div>
      </div>
    );
  }
}


export default Success;
