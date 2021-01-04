import React from "react";
import {inject, observer} from "mobx-react";
import Navigation from "../../components/layout/Navigation";
import AddToCalendar from 'react-add-to-calendar';

@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      calendarData: this.props.siteStore.eventSites["rita-ora"]["calendar"][0],
    };
  }

  render() {

    const sessionId = this.props.match.params.id;
    const sessionEmail = this.props.match.params.email;
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
                <h2 className="payment-overview-p">We've received your order and are proccessing your payment! Your digital ticket will be sent to <b className="boldText">{sessionEmail}</b> shortly. </h2>
              </div>

              <div className="header">
                <div className="line-item confirm">
                  <p className="confirm-label">Confirmation #</p>
                  <p className="confirm-price">{sessionId.substring(10,22)}</p>
                </div>
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


export default Success;
