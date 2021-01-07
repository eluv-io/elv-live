import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import DarkLogo from "Images/logo/darkLogo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Navigation extends React.Component {

  render() {
    return (
      <div className="navigation">
        <div className="main-nav">
          <ImageIcon className="main-nav--logo" icon={DarkLogo} label="Eluvio" />

          <div className="main-nav__link-group">
            <NavLink to="/rita-ora" activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Event
            </NavLink>
            <NavLink to="/support" activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Support
            </NavLink>
            <NavLink to="/code" activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Redeem Ticket 
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Navigation);

