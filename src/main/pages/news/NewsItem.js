import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import {useParams} from "react-router";
import {ExpandableImage, RichText, Video} from "../../components/Misc";
import {Action} from "../../components/Actions";
import {FormatDate} from "../../utils/Utils";
import {PageLoader} from "../../components/Loader";
import {runInAction} from "mobx";

const NewsItem = observer(() => {
  useEffect(() => {
    runInAction(() => mainStore.LoadNews());
  }, []);

  const params = useParams();

  const newsItem = mainStore.newsItems?.find(item => item.slug === params.slug);

  if(!newsItem) { return <PageLoader />; }

  const { title, full_title, date, text, images, videos } = newsItem;

  return (
    <div className="page light">
      <div className="page__header-container">
        <Action to="/about/news" className="page__header-back">← { mainStore.l10n.news.back }</Action>
        <h1>{ mainStore.l10n.news.title }</h1>
      </div>

      <div className="news__header-container">
        <h4 className="news__date">{FormatDate(date)}</h4>
        <h2 className="news__title">{full_title || title}</h2>
      </div>
      <div className="news__content">
        {
          !videos || videos.length === 0 ? null :
            videos.map(({video, caption}, index) =>
              <figure className="news__video-container" key={`video-${index}`}>
                <Video videoMetadata={video} className="news__video" />
                { caption ? <figcaption className="news__video-caption">{ caption }</figcaption> : null }
              </figure>
            )
        }

        <RichText richText={text} className="news__text">
          {
            images?.length > 0 ?
              <div className="news__images">
                {images.map(({image, caption}, index) =>
                  <ExpandableImage expandable image={image?.url} key={`image-${index}`} caption={caption} className="news__image" />
                )}
              </div> : null
          }
        </RichText>
      </div>
    </div>
  );
});

export default NewsItem;
