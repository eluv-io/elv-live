import React from "react";
import {observer} from "mobx-react";
import UrlJoin from "url-join";
import {mainStore} from "../../stores/Main";
import {InfoBox} from "../../components/Misc";
import {FormatDate} from "../../utils/Utils";

import {NewsIcon} from "../../static/icons/Icons";

const News = observer(() => {
  const newsItems = mainStore.mainSite?.news || [];

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>News</h1>
      </div>
      <div className="news__list">
        {
          newsItems.map(({title, date, slug, external_link}, index) => {
            return (
              <InfoBox
                className="news__list-item"
                key={`news-item-${slug || index}`}
                header={title}
                subheader={FormatDate(date)}
                links={[
                  {
                    to: external_link || UrlJoin("/news", slug || index.toString()),
                    text: "Read More",
                    icon: NewsIcon
                  }
                ]}
              />
            );
          })
        }
      </div>
    </div>
  );
});

export default News;
