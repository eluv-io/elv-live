import React from "react";
import {inject, observer} from "mobx-react";
import Collapsible from "react-collapsible";

import Footer from "Layout/Footer";

const FAQ = [
  {
    "answer": "One must go directly to the artist's page to purchase a ticket. You can find these links directly from an artist's social media pages.",
    "question": "Where do I go to buy a ticket?"
  },
  {
    "answer": "No. Simply click the Enter Event button in your ticket email and you will be instantly brought into the experience.",
    "question": "Do I have to make an account in order to watch a livestream?"
  },
  {
    "answer": "Yes! The Eluvio Live app is available on Apple TV and Roku (link to app) where you can enter your unique ticket code and associated email to watch the event. Otherwise, you can also cast it to your TV with Airplay.",
    "question": "Can I watch the livestream on my TV?"
  },
  {
    "answer": "We currently support all versions of Chrome, Safari, Firefox, and Edge on both Mobile, iPad, and Desktop devices. Currently we do not support Internet Explorer Browsers.",
    "question": "Can my device handle a livestream?"
  },
  {
    "answer": "Please check your inbox for a ticket email, which includes an Enter Event button. Clicking this will take you directly into the experience. You can also manually enter your ticket code and associated email on the ticket redemption page or the Apple TV app to join the livestream. If you have not received an email, refer to the question and answer below.",
    "question": "I purchased a ticket. How do I attend the livestream?"
  },
  {
    "answer": "Please make sure to check your Promotions Tab (if in Gmail), junk, or spam for the ticket email. If you still cannot find the ticket, please reach out to us at help@eluv.io.",
    "question": "I have purchased a ticket, but haven’t received a ticket email. What do I do?"
  },
  {
    "answer": "We accept all forms of credit cards in over 135 currencies as available through Stripe. We also support payment by Google Pay, Apple Pay, and PayPal.",
    "question": "What forms of payment are available? What currencies?"
  }
];

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {
  componentDidMount() {
    document.body.scrollIntoView();
  }

  render() {
    return (
      <div className="page-container support-page">
        <div className="main-content-container support-container">
          <div className="support-header">
            <h1 className="support-header--title">FAQ</h1>
          </div>
          <div className="support-body">
            {FAQ.map((obj, index) =>
              <Collapsible transitionTime={150} trigger={obj.question} key={index}>
                <p>{obj.answer}</p>
              </Collapsible>
            )}
          </div>
        </div>
        <Footer/>
      </div>

    );
  }
}


export default Support;
