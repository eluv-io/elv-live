import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import Collapsible from 'react-collapsible';

import Navigation from "./Navigation";

import Logo from "../../static/images/Logo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {

  render() {
    
    return (
        <div className="support-page">
          <Navigation/>
  
          <div className="support-container">
            <div className="support-header">
              <h1 className="support-header--title">Fan FAQ</h1>
            </div>
            <div className="support-body">
              <Collapsible transitionTime={150} trigger="Where do I go to buy a ticket?" >
                <p>One must go directly to artist's page to purchase a ticket. You can find these links directly from an artist's social media pages.</p>
              </Collapsible>
              <Collapsible transitionTime={150} trigger="Do I have to make an account in order to watch an Event?" >
                <p>No. Simply click the Redeem Ticket button in your ticket email and you will be instantly brought into the experience.</p>
              </Collapsible>
              <Collapsible transitionTime={150} trigger="Can my device handle an Event?" >
                <p>We currently support all versions of Chrome, Safari, Firefox, and Edge on both Mobile, iPad, and Desktop devices. Currently we do not support Internet Explorer Browsers.</p>
              </Collapsible>
              <Collapsible transitionTime={150} trigger="Is Airplay available?" >
                <p>Airplay is available through the correct corresponding devices browsers and devices. Airplay is enabled through mirroring to your TV on iPhones and iPads.</p>
              </Collapsible>
              <Collapsible transitionTime={150} trigger="I purchased a ticket. How do I attend the Event?" >
                <p>Please check your inbox for a ticket email, which includes an Enter Event button. Clicking this will take you directly into the experience. If you have not received an email, refer to the question and answer below.</p>
              </Collapsible>
              <Collapsible transitionTime={150} trigger="I have purchased a ticket, but haven’t received a ticket email. What do I do?" >
                <p>You can create an account as a fan by signing up and verifying your account. Please make sure to check your Promotions Tab (if in Gmail), junk, or spam for the ticket email. If you still cannot find the ticket, please reach out to us at help@momenthouse.com.</p>
              </Collapsible>
            </div>
          </div>
        </div>

    );
  }
}


export default Support;
