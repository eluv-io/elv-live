import React from "react";
import {inject, observer} from "mobx-react";

import Copy from "./copy/Copy.yaml";
import {NavLink} from "react-router-dom";

/*
Eluvio LIVE and our partners have an incredible line up of artists and events to bring to you in upcoming weeks. Keep an eye on this site as we formally open ticket sales.

If you would like to create an event with us, find out more about our offerings,
or sign up for our newsletter please complete [this form] (link to GoLive)

Contact
Email: events@live.eluv.io.
HQ Address: Eluvio, Inc. - HQ at 918 Parker Street Berkeley, CA 94710
Twitter - @EluvioLIVE (https://twitter.com/EluvioLIVE)
Instagram - eluviolive (https://www.instagram.com/eluviolive/)
Facebook - @EluvioLIVE (https://www.facebook.com/EluvioLIVE)
 */

@inject("siteStore")
@observer
class Next extends React.Component {
  render() {
    return (
      <div className="page-content next-page">
        <h1 className="next-page__header">What's Next?</h1>
        <h2 className="next-page__subheader">{ Copy.next.subheader }</h2>
        <h2 className="next-page__subheader">{ Copy.next.subheader2 }<NavLink to="/contact">this form</NavLink></h2>
        <div className="next-page__contact">
          <h3 className="next-page__contact-header">Contact</h3>
          <div className="next-page__contact-details">
            <label>Email</label> <div className="next-page__label-value">events@live.eluv.io</div>
            <label>HQ Address</label> <div className="next-page__label-value">Eluvio, Inc. - HQ at 918 Parker Street Berkeley, CA 94710</div>
            <label>Instagram</label> <div className="next-page__label-value"><a href="https://www.instagram.com/eluviolive" target="_blank">eluviolive</a></div>
            <label>Twitter</label> <div className="next-page__label-value"><a href="https://twitter.com/EluvioLIVE" target="_blank">@EluvioLIVE</a></div>
            <label>Facebook</label> <div className="next-page__label-value"><a href="https://www.facebook.com/EluvioLIVE" target="_blank">@EluvioLIVE</a></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Next;
