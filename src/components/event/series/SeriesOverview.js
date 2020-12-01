import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class SeriesOverview extends React.Component {

  render() {
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.title);
    // const featuredTitle = eventInfo.title;
    const title = this.props.title;
    const titleInfo = title.info || {};
    let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");;

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`tabs__container`}>
        {/* <ImageIcon 
          icon={eventInfo.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="tabs__container__poster" 
          title="Poster" 
        /> */}

        <div className="tabs__container__info">
          <h1 className="h1Props">{ eventInfo.name }</h1>

          {Maybe(
            titleInfo.synopsis,
            () => <div className="tabs__container__info__synopsis">{ eventInfo.description }</div>
          )}
          <div className="tabs__container__info__details-section">
            {Maybe(
              titleInfo.talent && titleInfo.talent.cast,
              () => <div className="tabs__container__info__detail">
                <label>Cast: </label>
                {/* &nbsp; */}
                { titleInfo.talent.cast.slice(0, 5).map(actor => `${actor.talent_first_name} ${actor.talent_last_name}`).join(", ") }
              </div>
            )}
            {Maybe(
              titleInfo.runtime,
              () => <div className="tabs__container__info__detail">
                <label>Runtime: </label>
                {/* &nbsp; */}
                { titleInfo.runtime } minutes
              </div>
            )}
            {/* {Maybe(
              titleInfo.release_date,
              () => <div className="tabs__container__info__detail">
                <label>Release Date</label>
                { new Date(titleInfo.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"}) }
              </div>
            )} */}
            {Maybe(
              titleInfo.creator,
              () => <div className="tabs__container__info__detail">
                <label>Creators: </label>
                {/* &nbsp; */}
                { titleInfo.creator }
              </div>
            )}
          </div>
          {Maybe(
            titleInfo.copyright,
            () => <div className="tabs__container__info__copyright">
              { titleInfo.copyright.toString().startsWith("©") ? "" : "©" } { titleInfo.copyright.toString() }
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SeriesOverview;