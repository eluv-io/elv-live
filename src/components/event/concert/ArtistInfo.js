import React from "react";
import {inject, observer} from "mobx-react";
import rita1 from "../../../static/images/ritaora/ritaConcert.jpg";
import rita2 from "../../../static/images/ritaora/ritaProf1.jpg";
import rita3 from "../../../static/images/ritaora/ritaProf1.jpg";

import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Feed from "react-instagram-authless-feed";
import { FaDesktop, FaYoutube, FaInstagram,FaTwitter,FaFacebookSquare,FaSoundcloud, FaApple, FaSpotify} from "react-icons/fa";
import { IconContext } from "react-icons";

@inject("rootStore")
@inject("siteStore")
@observer
class ArtistInfo extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.name);

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={"artist-profile-container"}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}
        {/* <div className="info-group"> */}
          <div className="profile-box">
            {/* <div className="profile-title">{ eventInfo.name }</div> */}
            <div className="info-title">Rita Ora</div>

            <div className="profile-bio">
              On early singles like “Hot Right Now” with DJ Fresh and her own 2012 smash “How We Do (Party),” Rita Ora exudes the headstrong confidence and swagger of an artist who knows exactly what she’s about. She also knows what she can do with a voice that fits just as well with lovelorn ballads as it does with full tilt party-starters.             </div>
            <div className="profile-bio">
              That combination of positivity and versatility has helped make Ora—born Rita Sahatçiu in Prishtina in the former Yugoslavia, in 1990—one of the most successful British female solo artists ever. And even though her troubles with her first record label led to a long delay for the follow-up to her 2012 debut Ora, she filled the gap with feature appearances on tracks by Iggy Azalea, Charli XCX, and Avicii, along with a stream of UK Top 10 singles such as the dreamy “Anywhere” and “For You,” a duet with Liam Payne for the soundtrack of Fifty Shades Freed.
            </div>
          </div>

          <div className="info-box">
            <div className="info-title">Bio</div>
            <p className="profile-facts__first">
              <span className="profile-facts__bold">Full Name: </span> Rita Sahatçiu Ora
            </p>
            <p className="profile-facts">
              <span className="profile-facts__bold">Age: </span> 30 (November 26, 1990)
            </p>
            <p className="profile-facts">
              <span className="profile-facts__bold">Gender: </span> Female
            </p>
            <p className="profile-facts">
              <span className="profile-facts__bold">Birth Place: </span> Pristina, SFR Yugoslavia
            </p>
            <p className="profile-facts">
              <span className="profile-facts__bold">Nationality: </span> British
            </p>
            <p className="profile-facts">
              <span className="profile-facts__bold">Trivia: </span> She worked with artists such as Drake and Kanye West on her debut album and became the artist with the most U.K. #1 singles of 2012.
            </p>
          </div>   
        {/* </div> */}

        {/* <div className="info-group"> */}
          <div className="info-box">
            <div className="info-title">Spotify</div>
            <iframe className="info-music" src="https://open.spotify.com/embed/playlist/37i9dQZF1DWW1gMUqCDV0K" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          </div>   
          <div className="info-box">
            <div className="info-title">Instagram</div>
            <Feed userName="ritaora" className="info-insta" classNameLoading="Loading" limit="8"/>
          </div>

          <div className="info-box">
            <div className="info-title">Twitter</div>
            <div className="info-twitter">
              
            <TwitterTimelineEmbed
                sourceType="profile"
                screenName="RitaOra"
                options={{height: 339, width: '100%' }}
                noFooter = {true}
                theme= 'dark'
              />
            </div>
          </div>   
        {/* </div> */}

        {/* <div className="info-group"> */}
          
          <div className="info-box-socLARGE">

              <div className="info-title">Social</div>
              <div className="info-social-box">


    
    
              <a href="https://www.youtube.com/user/ritaora" target="_blank" className="info-social__first">
                
              <IconContext.Provider value={{ className: 'social-icon',color: " #c4302b" }}>
                  <div>
                  <FaYoutube />
                  <span className="info-social-title">Youtube</span> 

                  </div>
                </IconContext.Provider>

              </a>
              <a href="https://www.instagram.com/ritaora/?hl=en" target="_blank" className="info-social">

              <IconContext.Provider value={{ className: 'social-icon social-icon-insta',color: " #c4302b" }}>
                  <div>
                  <FaInstagram />
                <span className="info-social-title">Instagram</span> 

                  </div>
                </IconContext.Provider>

              </a>
              <a href="https://twitter.com/RitaOra" target="_blank" className="info-social">

              <IconContext.Provider value={{ className: 'social-icon', color: '#1DA1F2' }}>
                  <div>
                  <FaTwitter />
                <span className="info-social-title">Twitter</span> 

                  </div>
                </IconContext.Provider>
              </a>
              <a href="https://www.how-to-be-lonely-digital.co.uk/" target="_blank" className="info-social">
                <IconContext.Provider value={{ className: 'social-icon' }}>
                  <div>
                    <FaDesktop />
                    <span className="info-social-title">Website</span> 

                  </div>
                </IconContext.Provider>
              </a>
              <a href="https://www.facebook.com/RitaOra" target="_blank" className="info-social">

              <IconContext.Provider value={{ className: 'social-icon', color: "#4267B2" }}>
                  <div>
                  <FaFacebookSquare />
                <span className="info-social-title">Facebook</span> 

                  </div>
                </IconContext.Provider>

              </a>
              <a href="https://soundcloud.com/ritaora" target="_blank" className="info-social">

              <IconContext.Provider value={{ className: 'social-icon', color: "#ff7700" }}>
                  <div>
                  <FaSoundcloud />
                <span className="info-social-title">SoundCloud</span> 

                  </div>
                </IconContext.Provider>

              </a>
              <a href="https://music.apple.com/us/artist/rita-ora/355898104" target="_blank" className="info-social">

                <IconContext.Provider value={{ className: 'social-icon social-icon-apple' }}>
                    <div>
                    <FaApple />
                  <span className="info-social-title">Apple Music</span> 

                    </div>
                  </IconContext.Provider>

              </a>
              <a href="https://open.spotify.com/artist/5CCwRZC6euC8Odo6y9X8jr" target="_blank" className="info-social">

              <IconContext.Provider value={{ className: 'social-icon', color: "#1DB954" }}>
                  <div>
                    <FaSpotify />
                    <span className="info-social-title">Spotify</span> 
                  </div>
                </IconContext.Provider>

              </a>
            </div>   
          </div>

          <div className="image-box">
            <div className="info-title">Photo Gallery</div>
            <div className="photo-group">
              <img
                  src={rita1}
                  className= "photo-group__photo-box"
                />     
                <img
                  src={rita2}
                  className= "photo-group__photo-box"
                />      
                {/* <img
                  src={rita1}
                  className= "photo-group__photo-box"
                />         */}
            </div>
          </div>


        {/* </div> */}
      </div>
    );
  }
}

export default ArtistInfo;