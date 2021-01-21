import React from "react";
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";


@inject("rootStore")
@inject("siteStore")
@observer
class Footer extends React.Component {

  render() {
    return (
      <div className="live-footer">
        <div className="footer-container">
          <div className="footer-info">
            <Link to={`${this.props.siteStore.basePath}/support`}  className="footer-item">
              Support FAQ
            </Link>
          </div>
          <div className="sponsor-container-footer"> 
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
