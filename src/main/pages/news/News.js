import React, {useEffect} from "react";
import {observer} from "mobx-react";
import UrlJoin from "url-join";
import {mainStore} from "../../stores/Main";
import {InfoBox} from "../../components/Misc";
import {FormatDate} from "../../utils/Utils";

import {NewsIcon} from "../../static/icons/Icons";
import {PageLoader} from "../../components/Loader";
import {runInAction} from "mobx";

const News = observer(() => {
  useEffect(() => {
    runInAction(() => mainStore.LoadNews());
  }, []);

  if(!mainStore.newsItems) { return <PageLoader />; }

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{ mainStore.l10n.news.title }</h1>
      </div>
      <div className="news__list">
        {
          mainStore.newsItems.map(({title, date, slug, external_link}, index) => {
            return (
              <InfoBox
                className="news__list-item"
                key={`news-item-${slug || index}`}
                header={title}
                subheader={FormatDate(date)}
                links={[
                  {
                    to: external_link || UrlJoin("/about/news", slug || index.toString()),
                    text: mainStore.l10n.actions.read_more,
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
