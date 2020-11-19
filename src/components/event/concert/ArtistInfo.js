import React from "react";
import {inject, observer} from "mobx-react";
import rita1 from "../../../static/images/ritaora/ritaConcert.jpg";
import rita2 from "../../../static/images/ritaora/ritaProf1.jpg";
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Feed from "react-instagram-authless-feed";

@inject("rootStore")
@inject("siteStore")
@observer
class ArtistInfo extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    const title = this.props.title;
    const titleInfo = title.info || {};
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.name);

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={"profile-container"}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}
        <div className="info-group">
          <div className="profile-box">
            {/* <div className="profile-title">{ eventInfo.name }</div> */}
            <div className="info-title">Bio</div>

            <div className="profile-bio">
              On early singles like “Hot Right Now” with DJ Fresh and her own 2012 smash “How We Do (Party),” Rita Ora exudes the headstrong confidence and swagger of an artist who knows exactly what she’s about. She also knows what she can do with a voice that fits just as well with lovelorn ballads as it does with full tilt party-starters.             </div>
            <div className="profile-bio">
              That combination of positivity and versatility has helped make Ora—born Rita Sahatçiu in Prishtina in the former Yugoslavia, in 1990—one of the most successful British female solo artists ever. And even though her troubles with her first record label led to a long delay for the follow-up to her 2012 debut Ora, she filled the gap with feature appearances on tracks by Iggy Azalea, Charli XCX, and Avicii, along with a stream of UK Top 10 singles such as the dreamy “Anywhere” and “For You,” a duet with Liam Payne for the soundtrack of Fifty Shades Freed.
            </div>
          </div>

          <div className="image-box">
            <div className="info-title">Photo Gallery</div>
            <div className="photo-group">
              <img
                  src={rita1}
                  className= "photo-group__profPhoto"
                />     
                <img
                  src={rita2}
                  className= "photo-group__profPhoto2"
                />      
            </div>
          </div>   
        </div>

        <div className="info-group">
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
        </div>
      </div>
    );
  }
}

export default ArtistInfo;