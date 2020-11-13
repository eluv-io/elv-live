import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {Link} from "react-router-dom";
import mad1 from "../../../static/images/1MAD.jpg";
import mad2 from "../../../static/images/2MAD.jpg";

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
      <div className={"event-container"}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}
        <div className="event-container__info__ticketGroup">

        <div className="event-container__info">
          <div className="event-container__info__h1Props">
            <div>{ eventInfo.name }</div>
          </div>

            <div className="event-container__info__synopsis">
            Prior to signing with epic records late last year, madison beer achieved unprecedented success as an independent artist with her partner first access entertainment. Her debut ep as she pleases boasts over 950 million streams and made her the first independent female solo artist to break into the top 20 us pop radio charts, after having debuted in the top 5 on itunes in 18 countries and in the top 10 in 42 countries worldwide. Globally, beer has over 2 billion streams across her catalogue.
                </div>
            <div className="event-container__info__synopsis">
            She’s attracted the endorsement of time, rolling stone, nme, v magazine and billboard who named her among its coveted “21 under 21” list, and has a social following that reaches an audience of over 20 million on instagram and 3 million on twitter. .
            </div>
          </div>
          <iframe className="event-container__info__music" src="https://open.spotify.com/embed/album/5boeEaUtj7gHXFxKtFFlzL" width="400" height="350" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    

      </div>
      <div className="event-container__info__ticketGroup">
        <img
              src={mad1}
              className= "event-container__info__photo2"
            />     
               <img
              src={mad2}
              className= "event-container__info__photo2"
            />     


        </div>
      </div>
    );
  }
}

export default ArtistInfo;