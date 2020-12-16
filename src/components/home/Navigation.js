import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import LightLogo from "../../static/images/logo/lightLogo.png";
import DarkLogo from "../../static/images/logo/darkLogo.png";
import NavyLogo from "../../static/images/logo/navyLogo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Navigation extends React.Component {

  render() {
    // console.log(this.props.location.pathname);
    return (
      <div className="navigation">
        <div className="main-nav">
          <h1 className="main-nav--logoTitle"> Eluvio Live </h1>

          {/* <ImageIcon className="main-nav--logo" icon={DarkLogo} label="Eluvio" /> */}
          
          <div className="main-nav__link-group">
            {/* <a href="https://eluv.io/register" target="_blank" className="btn2 btn2--white main-nav--event">
              Create Event
            </a> */}
            <NavLink to="/d457a576/rita-ora" activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Event
            </NavLink>
            <NavLink to="/d457a576/support" activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Support
            </NavLink>
            <NavLink to="/d457a576/code" activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Redeem Ticket 
            </NavLink>
           
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Navigation);

