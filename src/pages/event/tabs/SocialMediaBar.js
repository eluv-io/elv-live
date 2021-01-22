import React from "react";
import {inject, observer} from "mobx-react";
import { FaDesktop, FaYoutube, FaInstagram,FaTwitter,FaFacebookSquare,FaSoundcloud, FaApple, FaSpotify} from "react-icons/fa";
import { IconContext } from "react-icons";

@inject("rootStore")
@inject("siteStore")
@observer
class SocialMediaBar extends React.Component {

  render() {
    let artistInfo  = this.props.siteStore.eventSites[this.props.name]["artist_info"][0];

    return (
        <div className="overview-social-box">
          <a
            href={artistInfo["social_media_links"][0]["spotify"]}
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
            href={artistInfo["social_media_links"][0]["soundcloud"]}
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
            href={artistInfo["social_media_links"][0]["applemusic"]}
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
            href={artistInfo["social_media_links"][0]["youtube"]}
            target="_blank"
            className="info-social-link__first"
          >
            <IconContext.Provider
              value={{
                className: "social-icon social-icon-yt",
                color: " #c4302b",
                color: "black",

              }}
            >
              <div>
                <FaYoutube />
              </div>
            </IconContext.Provider>
          </a>
          <a
            href={artistInfo["social_media_links"][0]["instagram"]}
            target="_blank"
            className="info-social-link"
          >
            <IconContext.Provider
              value={{
                className: "social-icon social-icon-insta",
                color: " #c4302b",             
                color: "black",

              }}
            >
              <div>
                <FaInstagram />
              </div>
            </IconContext.Provider>
          </a>
          <a
            href={artistInfo["social_media_links"][0]["twitter"]}
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
            href={artistInfo["social_media_links"][0]["facebook"]}
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
            href={artistInfo["social_media_links"][0]["website"]}
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