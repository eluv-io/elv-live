import React from "react";
import {inject, observer} from "mobx-react";
import { IconContext } from "react-icons";
import {
  FaDesktop,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
  FaSoundcloud,
  FaApple,
  FaSpotify
} from "react-icons/fa";

@inject("rootStore")
@inject("siteStore")
@observer
class SocialMediaBar extends React.Component {
  SocialButton(href, Icon) {
    if(!href) { return null; }

    return (
      <a href={href} target="_blank" className="info-social-link">
        <IconContext.Provider value={{ className: "social-icon", color: "black"}}>
          { Icon }
        </IconContext.Provider>
      </a>
    );
  }

  render() {
    return (
      <div className="overview-social-box">
        { this.SocialButton(this.props.siteStore.socialLinks.spotify, <FaSpotify/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.soundcloud, <FaSoundcloud/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.apple_music, <FaApple/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.youtube, <FaYoutube/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.instagram, <FaInstagram/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.twitter, <FaTwitter/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.facebook, <FaFacebookSquare/>) }
        { this.SocialButton(this.props.siteStore.socialLinks.website, <FaDesktop/>) }
      </div>
    );
  }
}

export default SocialMediaBar;
