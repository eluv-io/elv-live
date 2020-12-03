import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import { parse } from 'query-string';
import Logo from "../../../static/images/Logo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {

  render() {
    let sessionId, sessionIdShort;
    let parsed = parse(this.props.location.search);

    if (parsed.session_id) {
      sessionId = parsed.session_id;
      sessionIdShort = sessionId.substr(sessionId.length - 8);
    }
    
    return (
      <div className="success-container">
        <div className="live-nav">
          <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
        </div>

        <div className="success-root">
          <div className="payment-overview">
            <h1 className="payment-overview-title">Thank you for your order!</h1>
            <h2 className="payment-overview-p">We've received your order and are proccessing your payment! An email with your digital ticket will be sent to you shortly. </h2>
          </div>
          <div className="code-reveal">
            <div className="code-reveal__ticket">
              <h2 className="payment-overview-order">ORDER CONFIRMATION #</h2>
              <h2 className="payment-overview-order2">{sessionIdShort}</h2>
              <Link to="/rita-ora/d457a576" className="btn2 btn2--black">Back to Event</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Success;
