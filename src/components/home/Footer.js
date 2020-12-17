import React from "react";
import {inject, observer} from "mobx-react";

import loreal from "../../static/images/sponsor/loreal.png";
import mercedes from "../../static/images/sponsor/mercedes.png";
import kerastase from "../../static/images/sponsor/keraAd.png";
import {ImageIcon} from "elv-components-js";
import DarkLogo from "../../static/images/logo/darkLogo.png";
import NavyLogo from "../../static/images/logo/navyLogo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Footer extends React.Component {

  render() {
    
    return (
      <div className="live-footer">
      <div className="footer-container">
       <div className="footer-info">
          <h3 className="live-footer__title">
            Eluvio Live
          </h3>
          {/* <h3 className="live-footer__title">
            eluv.io Live
          </h3> */}
          {/* <ImageIcon className="live-footer__logo" icon={DarkLogo} label="Eluvio" /> */}

          <h3 className="live-footer__p">
           Purchase tickets and stream the most iconic concerts, premieres, and broadcasts. 
          </h3>
          
        </div>
          <div className="sponsor-container-footer"> 
            <span className="sponsor-title-footer ">
              In Partnership With
            </span>
            {/* <img src={loreal} className="big-sponsor-img" /> */}
            <div className="sponsor-img-container-footer"> 
                <img src={loreal} className="big-sponsor-img-footer" />
            </div>
          </div>
        
        
      </div>
 
    </div>

    );
  }
}


export default Footer;
