import React from "react";
import {inject, observer} from "mobx-react";
import Navigation from "Layout/Navigation";
import CalendarButton from "Confirmation/components/CalendarButton";

@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {
  render() {
    const sessionId = this.props.match.params.id;
    const sessionEmail = this.props.match.params.email;

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
                <p className="confirm-price">{sessionId}</p>
              </div>
            </div>

            <CalendarButton />
          </div>
        </div>
      </div>
    );
  }
}


export default Success;
