import React from "react";
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Footer extends React.Component {
  Sponsors() {
    return (
      this.props.siteStore.sponsors.map((sponsor, index) =>
        <div className={"sponsor-img-container-footer"} key={`footer-sponsor-${index}`}>
          <img src={sponsor.image_url} className="big-sponsor-img-footer" alt={sponsor.name} />
        </div>
      )
    );
  }

  render() {
    const hasSponsors = this.props.siteStore.sponsors && this.props.siteStore.sponsors.length > 0;
    return (
      <div className="live-footer">
        <div className="footer-container">
          <div className="footer-info">
            <Link to={this.props.siteStore.SitePath("support")} className="footer-item">
              Support FAQ
            </Link>
          </div>
          <div className="sponsor-container-footer">
            { hasSponsors ? <div className="sponsor-message">Sponsored By</div> : null }
            <div className="sponsor-logos">
              { hasSponsors ? this.Sponsors() : null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
