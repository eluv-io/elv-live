import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import Logo from "Images/logo/eluvioLive.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Navigation extends React.Component {

  render() {
    return (
      <div className="navigation">
        <div className="main-nav">
        <NavLink to={`${this.props.siteStore.basePath}/${this.props.siteStore.eventSlug}`}  className="main-nav--logo">
        <ImageIcon className="main-nav--logo" icon={Logo} label="Eluvio" />
            </NavLink>

          <div className="main-nav__link-group">
            {/* <NavLink to={`${this.props.siteStore.basePath}/${this.props.siteStore.eventSlug}`} activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Event
            </NavLink>
            <NavLink to={`${this.props.siteStore.basePath}/support`} activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Support
            </NavLink> */}
            <NavLink to={`${this.props.siteStore.basePath}/code`} activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Redeem Ticket 
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Navigation);

