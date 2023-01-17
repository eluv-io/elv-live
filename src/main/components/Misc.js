import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import ReactMarkdown from "react-markdown";
import SanitizeHTML from "sanitize-html";
import ImageIcon from "./ImageIcon";
import Modal from "./Modal";
import {Button} from "./Actions";
import SwiperCore, {Lazy, Pagination} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import {uiStore} from "../stores/Main";
import {observer} from "mobx-react";

SwiperCore.use([Lazy, Pagination]);

export const RichText = ({richText, className=""}) => {
  const [reactRoot, setReactRoot] = useState(undefined);

  return (
    <div
      className={`rich-text ${className}`}
      ref={element => {
        if(!element) { return; }

        const root = reactRoot || createRoot(element);
        setReactRoot(root);

        root.render(
          <ReactMarkdown linkTarget="_blank" allowDangerousHtml >
            { SanitizeHTML(richText) }
          </ReactMarkdown>,
        );
      }}
    />
  );
};

export const CaptionedImage = ({image, caption, className="", imageClassName="", captionClassName="", expandable}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <>
      <figure onClick={expandable ? () => setShowFullScreen(true) : undefined} className={`captioned-image ${expandable ? "captioned-image--expandable" : ""} ${className}`}>
        <ImageIcon icon={image} className={`captioned-image__image ${imageClassName}`} />
        <figcaption className={`captioned-image__caption ${captionClassName}`}>
          { caption }
        </figcaption>
      </figure>
      {
        showFullScreen ?
          <Modal
            active
            Close={() => setShowFullScreen(false)}
            className="captioned-image__modal dark"
          >
            <CaptionedImage
              image={image}
              caption={caption}
              className={`${className} captioned-image--expanded`}
              captionClassName={captionClassName}
            />
          </Modal> :
          null
      }
    </>
  );
};

export const InfoBox = ({header, subheader, content, icon, links, dark=false}) => {
  return (
    <div className={`info-box ${dark ? "dark" : "light"}`}>
      { subheader ? <h4 className="info-box__subheader">{ subheader }</h4> : null }
      <div className="info-box__content">
        {
          !icon ? null :
            <div className="info-box__icon-container">
              <ImageIcon icon={icon} className="info-box__icon" title={header} />
            </div>
        }
        <div className="info-box__text">
          <h3 className="info-box__header">{header}</h3>
          {
            !content ? null :
              typeof content === "string" ?
                <RichText richText={content} className="info-box__text-content info-box__text-content--rich-text" /> :
                <div className="info-box__text-content">{content}</div>
          }
        </div>
        {
          !links || links.length === 0 ? null :
            <div className="info-box__links">
              {links.map(({text, to, icon}) =>
                <Button
                  icon={icon}
                  to={to}
                  className={`${dark ? "dark" : "light"} secondary info-box__link`}
                  key={`info-box-link-${text}`}
                >
                  { text }
                </Button>
              )}
            </div>
        }
      </div>
    </div>
  );
};


export const Carousel = ({children, slidesPerView="auto", className=""}) => {
  if(!Array.isArray(children)) {
    children = children.props.children;
  }

  return (
    <div className={`carousel ${className}`}>
      <Swiper
        className="carousel__swiper"
        slidesPerView={slidesPerView}
        lazy={{
          enabled: true,
          loadPrevNext: true,
          loadOnTransitionStart: true
        }}
        pagination={{
          clickable: true
        }}
        updateOnWindowResize
      >
        { children.map((element, index) =>
          <SwiperSlide className="carousel__slide" key={`slide-${index}`}>
            { element }
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

// Show a grid of items on desktop and a carousel on mobile
export const GridCarousel = observer(({children, cutOff=600, className="", classNameGrid="", classNameCarousel=""}) => {
  if(uiStore.pageWidth <= cutOff) {
    return (
      <Carousel slidesPerView={1} className={`${className} ${classNameCarousel}`}>
        { children }
      </Carousel>
    );
  }

  return (
    <div className={`grid ${className} ${classNameGrid}`}>
      { children }
    </div>
  );
});
