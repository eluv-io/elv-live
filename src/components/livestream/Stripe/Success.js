import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './normalize.css';
import './global.css';
import Logo from "../../../static/images/Logo.png";
import background from "../../../static/images/livestream/artist1.png";
import {ImageIcon} from "elv-components-js";

const Success = () => {
  const location = useLocation();
  const sessionId = location.search.replace('?session_id=', '');

  return (
    <div className="live-container">
      <div className="live-nav">
        <ImageIcon className="live-nav__container--logo" icon={Logo} label="Eluvio" />
      </div>

      <div className="sr-root">
        <div className="sr-main2">
          <div className="sr-payment-summary">
            <h1 className="title">Your purchase was successful!</h1>
            <h2 className="subtitle">
              Thanks for your order.
            </h2>
          </div>
          
          <div className="sr-section completed-view">
            <Link to="/stream" className="btn2 btn2--white buttonguy">View Stream</Link>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default Success;
