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

class SocialMediaBar extends React.Component {
  SocialButton(href, Icon, name) {
    if(!href) { return null; }

    return (
      <a href={href} target="_blank" rel="noopener" className="info-social-link">
        <IconContext.Provider value={{ className: `social-icon ${name}`, color: "black"}}>
          { Icon }
        </IconContext.Provider>
      </a>
    );
  }

  render() {
    const color = this.props.siteStore.darkMode ? "#FFFFFF" : "#000000";

    if(!Object.values(this.props.siteStore.socialLinks).find(link => link)) { return null; }

    return (
      <div className="overview-social-box">
        { this.SocialButton(this.props.siteStore.socialLinks.spotify, <FaSpotify color={color} />, "spotify") }
        { this.SocialButton(this.props.siteStore.socialLinks.soundcloud, <FaSoundcloud color={color} />, "soundcloud") }
        { this.SocialButton(this.props.siteStore.socialLinks.apple_music, <FaApple color={color} />, "apple_music") }
        { this.SocialButton(this.props.siteStore.socialLinks.youtube, <FaYoutube color={color} />,"youtube", ) }
        { this.SocialButton(this.props.siteStore.socialLinks.instagram, <FaInstagram color={color} />,"instagram") }
        { this.SocialButton(this.props.siteStore.socialLinks.twitter, <FaTwitter color={color} />,"twitter", ) }
        { this.SocialButton(this.props.siteStore.socialLinks.facebook, <FaFacebookSquare color={color} />,"facebook") }
        { this.SocialButton(this.props.siteStore.socialLinks.website, <FaDesktop color={color} />,"website" ) }
      </div>
    );
  }
}

export default inject("rootStore")(inject("siteStore")(observer(SocialMediaBar)));
