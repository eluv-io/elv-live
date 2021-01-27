import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import {inject, observer} from "mobx-react";
import Logo from "Images/logo/darkEluvioLiveLogo.png";

@inject("rootStore")
@inject("siteStore")
@observer
class Navigation extends React.Component {

  render() {
    return (
      <div className="navigation">
        <div className="main-nav">
          <NavLink to={`${this.props.siteStore.basePath}/${this.props.siteStore.siteSlug}`}  className="main-nav--logo">
            <img src={Logo} className="main-nav--logo" />
          </NavLink>

          <div className="main-nav__link-group">
            <NavLink to={`${this.props.siteStore.basePath}/${this.props.siteStore.siteSlug}/code`} activeStyle={{fontWeight: "bold", color: "black"}} className="link-item">
              Redeem Ticket
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Navigation);

