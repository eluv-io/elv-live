import React from "react";
import {inject, observer} from "mobx-react";
import rita1 from "../../../assets/images/ritaora/hero4.jpg";
import rita2 from "../../../assets/images/ritaora/hero2.jpg";

import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { FaDesktop, FaYoutube, FaInstagram,FaTwitter,FaFacebookSquare,FaSoundcloud, FaApple, FaSpotify} from "react-icons/fa";
import { IconContext } from "react-icons";
import { artistInfo } from "../../../assets/data/event";

@inject("rootStore")
@inject("siteStore")
@observer
class ArtistInfo extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    // let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");;
    // const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={"artist-info-container"}>
        <div className="profile-box">
          <div className="info-title">Rita Ora</div>
          {artistInfo["intro"].map((text, index) =>
            <div className="profile-bio" key={index}>
              {text}
            </div>
            )}
        </div>
  
        <div className="info-box">
          <div className="info-title">Bio</div>
          <p className="profile-facts__first">
            <span className="profile-facts__bold">Full Name: </span> 
            {artistInfo["bio"]["full-name"]}
          </p>
          <p className="profile-facts">
            <span className="profile-facts__bold">Age: </span> 
            {artistInfo["bio"]["age"]} ({artistInfo["bio"]["birth-date"]})
          </p>
          <p className="profile-facts">
            <span className="profile-facts__bold">Gender: </span>            
            {artistInfo["bio"]["gender"]}
          </p>
          <p className="profile-facts">
            <span className="profile-facts__bold">Birth Place: </span>            
            {artistInfo["bio"]["birth-place"]}
          </p>
          <p className="profile-facts">
            <span className="profile-facts__bold">Nationality: </span>            
            {artistInfo["bio"]["nationality"]}
          </p>
          <p className="profile-facts">
            <span className="profile-facts__bold">Trivia: </span>            
            {artistInfo["bio"]["trivia"]}
          </p>
        </div>
  
        <div className="info-box">
          <div className="info-title">Social</div>
          <div className="info-social-box">
            <a
              href={artistInfo["social-media"]["youtube"]}
              target="_blank"
              className="info-social-link__first"
            >
              <IconContext.Provider
                value={{
                  className: "social-icon social-icon-yt",
                  color: " #c4302b",
                }}
              >
                <div>
                  <FaYoutube />
                  <span className="info-social-link-title">Youtube</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["instagram"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{
                  className: "social-icon social-icon-insta",
                  color: " #c4302b",
                }}
              >
                <div>
                  <FaInstagram />
                  <span className="info-social-link-title">Instagram</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["twitter"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon", color: "#1DA1F2" }}
              >
                <div>
                  <FaTwitter />
                  <span className="info-social-link-title">Twitter</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["website"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider value={{ className: "social-icon" }}>
                <div>
                  <FaDesktop />
                  <span className="info-social-link-title">Website</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["facebook"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon", color: "#4267B2" }}
              >
                <div>
                  <FaFacebookSquare />
                  <span className="info-social-link-title">Facebook</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["soundcloud"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon", color: "#ff7700" }}
              >
                <div>
                  <FaSoundcloud />
                  <span className="info-social-link-title">SoundCloud</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["apple-music"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon social-icon-apple" }}
              >
                <div>
                  <FaApple />
                  <span className="info-social-link-title">Apple Music</span>
                </div>
              </IconContext.Provider>
            </a>
            <a
              href={artistInfo["social-media"]["spotify"]}
              target="_blank"
              className="info-social-link"
            >
              <IconContext.Provider
                value={{ className: "social-icon", color: "#1DB954" }}
              >
                <div>
                  <FaSpotify />
                  <span className="info-social-link-title">Spotify</span>
                </div>
              </IconContext.Provider>
            </a>
          </div>
        </div>

        <div className="info-box">
          <div className="info-title">Spotify</div>
          <iframe
            className="info-music"
            src={artistInfo["spotify-embed"]}
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          />
        </div>

        <div className="info-box">
          <div className="info-title">Twitter</div>
          <div className="info-twitter">
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName={artistInfo["twitter-handle"]}
              options={{ height: 385, width: "100%", tweetLimit: 4 }}
              noFooter={true}
              theme="dark"
              placeholder="Loading Tweets"
            />
          </div>
        </div>
  
        <div className="image-box">
          <div className="info-title">Photo Gallery</div>
          <div className="photo-group">
           {artistInfo["photo-gallery"].map((img, index) =>
            <img src={img} className="photo-group__photo-box" key={index}/>
            )}

          </div>
        </div>
  
      </div>
    );
  }
}

export default ArtistInfo;