import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class ConcertOverview extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    const title = this.props.title;
    const titleInfo = title.info || {};
    let eventInfo = this.props.siteStore.eventAssets.get(this.props.name);

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`event-container`}>
        {/* <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        /> */}

        <div className="event-container__info">
          <h1 className="event-container__info__h1Props">{ eventInfo.description }</h1>

          <div className="event-container__info__synopsis">
          PRIOR TO SIGNING WITH EPIC RECORDS LATE LAST YEAR, MADISON BEER ACHIEVED UNPRECEDENTED SUCCESS AS AN INDEPENDENT ARTIST WITH HER PARTNER FIRST ACCESS ENTERTAINMENT. HER DEBUT EP AS SHE PLEASES BOASTS OVER 950 MILLION STREAMS AND MADE HER THE FIRST INDEPENDENT FEMALE SOLO ARTIST TO BREAK INTO THE TOP 20 US POP RADIO CHARTS, AFTER HAVING DEBUTED IN THE TOP 5 ON ITUNES IN 18 COUNTRIES AND IN THE TOP 10 IN 42 COUNTRIES WORLDWIDE. GLOBALLY, BEER HAS OVER 2 BILLION STREAMS ACROSS HER CATALOGUE.
          </div>
          <div className="event-container__info__synopsis">
          SHE’S ATTRACTED THE ENDORSEMENT OF TIME, ROLLING STONE, NME, V MAGAZINE AND BILLBOARD WHO NAMED HER AMONG ITS COVETED “21 UNDER 21” LIST, AND HAS A SOCIAL FOLLOWING THAT REACHES AN AUDIENCE OF OVER 20 MILLION ON INSTAGRAM AND 3 MILLION ON TWITTER. .
          </div>
          <div className="event-container__info__synopsis">
          HER LATEST SINGLE “BABY” WAS INCLUDED ON PAPER’S “10 NEW SONGS YOU NEED TO HEAR NOW” AND MTV’S “SONGS WE LOVE” LIST, WITH THE VIDEO AMASSING OVER 4 MILLION VIEWS ON YOUTUBE WITHIN ITS FIRST WEEK OF RELEASE. EARLIER THIS YEAR, FEVERISH FANS MOBILIZED AND LEFT THOUSANDS OF COMMENTS ON EPIC’S INSTAGRAM PAGE TO DEMAND THE RELEASE OF “STAINED GLASS,” MADISON’S MOST PERSONAL SONG TO DATE, AFTER SHE TEASED IT DURING AN INSTAGRAM LIVE SESSION. CONTINUING ON HER HOT STREAK, MADISON HAS CONSISTENTLY BEATEN HER DAILY BEST STREAMING NUMBERS WITH “SELFISH,” HER FASTEST EVER US GOLD CERTIFIED RECORD.
          </div>
        </div>
      </div>
    );
  }
}

export default ConcertOverview;