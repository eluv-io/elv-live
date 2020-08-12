import React from "react";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";

@inject("rootStore")
@inject("siteStore")
@observer
class PremiereOverview extends React.Component {

  render() {
    const title = this.props.title;
    const titleInfo = title.info || {};

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`premiereTabs__container ${this.props.showTab === "Title Overview" ? "" : "hide"}`}>
        <ImageIcon 
          icon={title.portraitUrl || title.imageUrl || title.landscapeUrl } 
          className="premiereTabs__container__poster" 
          title="Poster" 
        />

        <div className="premiereTabs__container__info">
          <h1>{ title.displayTitle.toString() }</h1>

          {Maybe(
            titleInfo.synopsis,
            () => <div className="premiereTabs__container__info__synopsis">{ titleInfo.synopsis.toString() }</div>
          )}
          <div className="premiereTabs__container__info__details-section">
            {Maybe(
              titleInfo.talent && titleInfo.talent.cast,
              () => <div className="premiereTabs__container__info__detail">
                <label>Cast</label>
                { titleInfo.talent.cast.map(actor => `${actor.talent_first_name} ${actor.talent_last_name}`).join(", ") }
              </div>
            )}
            {Maybe(
              titleInfo.runtime,
              () => <div className="premiereTabs__container__info__detail">
                <label>Runtime</label>
                { titleInfo.runtime } minutes
              </div>
            )}
            {Maybe(
              titleInfo.release_date,
              () => <div className="premiereTabs__container__info__detail">
                <label>Release Date</label>
                { new Date(titleInfo.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"}) }
              </div>
            )}
            {Maybe(
              titleInfo.creator,
              () => <div className="premiereTabs__container__info__detail">
                <label>Creator</label>
                { titleInfo.creator }
              </div>
            )}
          </div>
          {Maybe(
            titleInfo.copyright,
            () => <div className="premiereTabs__container__info__copyright">
              { titleInfo.copyright.toString().startsWith("©") ? "" : "©" } { titleInfo.copyright.toString() }
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PremiereOverview;