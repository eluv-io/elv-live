import React from "react";
import {inject, observer} from "mobx-react";
import { Link, withRouter } from "react-router-dom";


@inject("rootStore")
@inject("siteStore")
@observer
class Footer extends React.Component {

  render() {
    let sponsorInfo = this.props.siteStore.eventSites[this.props.siteStore.eventSlug]["sponsor"][0];
    return (
      <div className="live-footer">
        <div className="footer-container">
          <div className="footer-info">
          <Link to={`${this.props.siteStore.basePath}/support`}  className="footer-item">
              Support FAQ
            </Link>
              {/* <Link  className="footer-item">
              Contact
            </Link>
            <Link className="footer-item">
              About
            </Link> */}
   
          </div>
          <div className="sponsor-container-footer"> 
            {/* <span className="sponsor-title-footer">
              {sponsorInfo.footer_text}
            </span> */}
            <div className="sponsor-img-container-footer"> 
              <img src={this.props.siteStore.sponsorImage} className="big-sponsor-img-footer" />
            </div>
          </div>
        </div>
      </div>  

    );
  }
}


export default Footer;
