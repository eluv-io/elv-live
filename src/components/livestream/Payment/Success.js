import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import AsyncComponent from "../../support/AsyncComponent";

import "../../../static/stylesheets/base/paymentGlobal.css";
import Logo from "../../../static/images/Logo.png";


@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {

  render() {
    const params = window.location.href;
    let sessionId = params.substr(params.length - 66); // => "Tabs1"
    let sessionIdShort = params.substr(params.length - 16); // => "Tabs1"

    console.log(sessionId);
    return (
      <AsyncComponent
        Load={async () => {
          await this.props.rootStore.CreateOTP();
        }}
        render={() => {
          return (
            <div className="live-container">
              <div className="live-nav">
                <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
              </div>

              <div className="sr-root">
                {/* <div className="success-root">
                  <h1 className="payment-overview-title">Thank you for your order</h1>

                  <div className="payment-overview">
                    <h1 className="payment-overview-title">ORDER CONFIRMATION </h1>
                    <p className="payment-overview-p">We've received your order and are proccessing your payment! We will send an email with your digital tickets to [USER EMAIL] within the next 30 minutes.</p>
                  </div>

                  <div className="event-container__info__schedule">
                    <div className="event-container__info__schedule__ticket">
                      <h1 className="event-container__info__schedule__ticket__ticketdetail">Ticket Code:</h1>
                      <h2 className="event-container__info__schedule__ticket__ticketdetail2">8BC128 </h2>
                      <div className="sr-section completed-view">
                        <Link to="/code" className="btn2 btn2--white buttonguy">Redeem Ticket</Link>
                      </div>
                    </div>
                  </div>
            
                </div> */}


                <div className="success-root">
                  <div className="payment-overview">
                    <h1 className="payment-overview-title">Thank you for your order!</h1>
                    <h2 className="payment-overview-p">We've received your order and are proccessing your payment! An email with your digital ticket will be sent to you shortly. </h2>
                  </div>
                  <div className="code-reveal">
                    <div className="code-reveal__ticket">
                      <h2 className="payment-overview-order">ORDER CONFIRMATION #:</h2>
                      <h2 className="payment-overview-order2">{sessionIdShort}</h2>
                      <h1 className="code-reveal__ticket__ticketdetail">Ticket Code:</h1>
                      <h2 className="code-reveal__ticket__ticketdetail2">{this.props.rootStore.OTPCode} </h2>
                      <div className="sr-section completed-view">
                        <Link to="/code" className="btn2 btn2--white buttonguy">Redeem Ticket</Link>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
            </div>
          );
        }}
      />
    );
  }
}

export default Success;
