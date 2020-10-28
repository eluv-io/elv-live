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
                <div className="sr-main2">
                  <div className="sr-payment-summary">
                    <h1 className="title">Your purchase was successful!</h1>
                    <h2 className="subtitle">Thanks for your order!</h2>
                  </div>
                  <div className="event-container__info__schedule">
                    <div className="event-container__info__schedule__ticket">
                      <h1 className="event-container__info__schedule__ticket__ticketdetail">Ticket Code:</h1>
                      <h2 className="event-container__info__schedule__ticket__ticketdetail2">{this.props.rootStore.OTPCode} </h2>
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
