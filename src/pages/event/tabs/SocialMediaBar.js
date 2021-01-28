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
  render() {
    // TODO: Hide links without URLs and componentize these links
    return (
      <div className="overview-social-box">
        <a
          href={this.props.siteStore.socialLinks.spotify}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider
            value={{ className: "social-icon",
              color: "black",

              // color: "#1DB954"
            }}
          >
            <div>
              <FaSpotify />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.soundcloud}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider
            value={{ className: "social-icon",
              color: "black",

              // color: "#ff7700"
            }}
          >
            <div>
              <FaSoundcloud />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.apple_music}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider
            value={{ className: "social-icon social-icon-apple" }}
          >
            <div>
              <FaApple />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.youtube}
          target="_blank"
          className="info-social-link__first"
        >
          <IconContext.Provider
            value={{
              className: "social-icon social-icon-yt",
              //color: " #c4302b",
              color: "black",

            }}
          >
            <div>
              <FaYoutube />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.instagram}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider
            value={{
              className: "social-icon social-icon-insta",
              //color: " #c4302b",
              color: "black",

            }}
          >
            <div>
              <FaInstagram />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.twitter}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider
            value={{ className: "social-icon",
              color: "black",
              // color: "#1DA1F2"
            }}
          >
            <div>
              <FaTwitter />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.facebook}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider
            value={{ className: "social-icon",
              color: "black",

              // color: "#4267B2"
            }}
          >
            <div>
              <FaFacebookSquare />
            </div>
          </IconContext.Provider>
        </a>
        <a
          href={this.props.siteStore.socialLinks.website}
          target="_blank"
          className="info-social-link"
        >
          <IconContext.Provider value={{ className: "social-icon" }}>
            <div>
              <FaDesktop />
            </div>
          </IconContext.Provider>
        </a>
      </div>

    );
  }
}

export default SocialMediaBar;
