import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Footer extends React.Component {

  render() {
    let sponsorInfo = this.props.siteStore.eventSites["rita-ora"]["sponsor"][0];
    return (
      <div className="live-footer">
        <div className="footer-container">
          {/* <div className="footer-info">
            <h3 className="live-footer__title">
              Eluvio Live
            </h3>
            <h3 className="live-footer__p">
            Purchase tickets and stream the most iconic concerts, premieres, and broadcasts. 
            </h3>
          </div> */}
            <div className="sponsor-container-footer"> 
              <span className="sponsor-title-footer">
                {sponsorInfo.footer_text}
              </span>
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
