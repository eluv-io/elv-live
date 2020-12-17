import React from "react";
import {inject, observer} from "mobx-react";

import loreal from "../../static/images/sponsor/loreal.png";
import mercedes from "../../static/images/sponsor/mercedes.png";
import kerastase from "../../static/images/sponsor/keraAd.png";

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
          <h3 className="live-footer__p">
          Purchase tickets and stream the most iconic concerts, premieres, and broadcasts. 
          </h3>
          
        </div>
          <div className="sponsor-container-footer"> 
            <span className="sponsor-title-footer ">
              Proud Partnership With
            </span>
            {/* <img src={loreal} className="big-sponsor-img" /> */}
            <div className="sponsor-img-container-footer"> 
              <img src={mercedes} className="sponsor-img1-footer" />
                <img src={loreal} className="big-sponsor-img-footer" />
              <img src={kerastase} className="sponsor-img2-footer" />
            </div>
          </div>
        
        
      </div>
 
    </div>

    );
  }
}


export default Footer;
