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
  SocialButton(href, Icon, name) {
    if(!href) { return null; }

    return (
      <a href={href} target="_blank" className="info-social-link">
        <IconContext.Provider value={{ className: `social-icon ${name}`, color: "black"}}>
          { Icon }
        </IconContext.Provider>
      </a>
    );
  }

  render() {
    return (
      <div className="overview-social-box">
        { this.SocialButton(this.props.siteStore.socialLinks.spotify, <FaSpotify/>, "spotify") }
        { this.SocialButton(this.props.siteStore.socialLinks.soundcloud, <FaSoundcloud/>, "soundcloud") }
        { this.SocialButton(this.props.siteStore.socialLinks.apple_music, <FaApple/>, "apple_music") }
        { this.SocialButton(this.props.siteStore.socialLinks.youtube, <FaYoutube/>,"youtube", ) }
        { this.SocialButton(this.props.siteStore.socialLinks.instagram, <FaInstagram/>,"instagram") }
        { this.SocialButton(this.props.siteStore.socialLinks.twitter, <FaTwitter/>,"twitter", ) }
        { this.SocialButton(this.props.siteStore.socialLinks.facebook, <FaFacebookSquare/>,"facebook") }
        { this.SocialButton(this.props.siteStore.socialLinks.website, <FaDesktop/>,"website" ) }
      </div>
    );
  }
}

export default SocialMediaBar;
