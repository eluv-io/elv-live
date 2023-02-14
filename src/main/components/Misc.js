import React, {useState, useEffect} from "react";
import {createRoot} from "react-dom/client";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import ImageIcon from "./ImageIcon";
import Modal from "./Modal";
import {Action, Button} from "./Actions";
import SwiperCore, {Lazy, Pagination} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import {uiStore} from "../stores/Main";
import {observer} from "mobx-react";
import EluvioPlayer, {EluvioPlayerParameters} from "@eluvio/elv-player-js";
import EluvioConfiguration from "EluvioConfiguration";
import {PlusIcon} from "../static/icons/Icons";

SwiperCore.use([Lazy, Pagination]);

export const RichText = ({richText, children, className=""}) => {
  const [reactRoot, setReactRoot] = useState(undefined);

  return (
    <div
      className={`rich-text ${className}`}
      ref={element => {
        if(!element) { return; }

        const root = reactRoot || createRoot(element);
        setReactRoot(root);

        root.render(
          <>
            { children }
            <ReactMarkdown
              linkTarget="_blank"
              rehypePlugins={[rehypeRaw]}
              components={{
                a: props => <Action {...props} target={["https:", "mailto:"].find(prefix => props.href?.startsWith(prefix)) ? "_blank" : ""} />
              }}
            >
              { DOMPurify.sanitize(richText) }
            </ReactMarkdown>
          </>
        );
      }}
    />
  );
};

export const Video = observer(({versionHash, videoMetadata, className=""}) => {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => () => player?.Destroy(), []);

  if(!videoMetadata) { return null; }

  if(!versionHash) {
    if(videoMetadata["/"]) {
      versionHash = videoMetadata["/"].split("/").find(element => element.startsWith("hq__"));
    } else if(videoMetadata["."] && videoMetadata["."].source) {
      versionHash = videoMetadata["."].source;
    }
  }

  return (
    <div
      ref={element => {
        if(!element || player) { return; }

        setPlayer(
          new EluvioPlayer(
            element,
            {
              clientOptions: {
                network: EluvioPlayerParameters.networks[EluvioConfiguration.network === "main" ? "MAIN" : "DEMO"]
              },
              sourceOptions: {
                playoutParameters: {
                  versionHash
                }
              }
            }
          )
        );
      }}
      className={`player-container ${className}`}
    />
  );
});

export const ExpandableImage = ({image, caption, className="", imageClassName="", captionClassName="", expandable}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <>
      <figure onClick={expandable ? () => setShowFullScreen(true) : undefined} className={`captioned-image ${expandable ? "captioned-image--expandable" : ""} ${className}`}>
        <ImageIcon icon={image} className={`captioned-image__image ${imageClassName}`} />
        {
          !caption ? null :
            <figcaption className={`captioned-image__caption ${captionClassName}`}>
              {caption}
            </figcaption>
        }
      </figure>
      {
        showFullScreen ?
          <Modal
            active
            Close={() => setShowFullScreen(false)}
            className="captioned-image__modal dark"
          >
            <ExpandableImage
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

export const InfoBox = ({header, subheader, content, icon, links, dark=false, className=""}) => {
  return (
    <div className={`curved-box info-box ${dark ? "dark" : "light"} ${className}`}>
      { subheader ? <h5 className="info-box__subheader">{ subheader }</h5> : null }
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
              {links.map(({text, to, icon, includeArrow=true}, index) =>
                <Button
                  icon={icon}
                  to={to}
                  includeArrow={includeArrow}
                  className={`${dark ? "dark" : "light"} secondary info-box__link`}
                  key={`info-box-link-${index}`}
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

export const TabbedInfoBox = ({tabs, dark=false, noBackgroundStyling=false}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(Math.max(tabs.findIndex(tab => tab?.default), 0));

  return (
    <div className={`curved-box tabbed-info-box ${noBackgroundStyling ? "" : dark ? "dark" : "light"}`}>
      <div className="tabbed-info-box__tabs">
        { tabs.map(({icon, title}, index) =>
          <Button
            icon={icon}
            iconLabel={title}
            onClick={() => setActiveTabIndex(index)}
            className={`${dark ? "dark" : "light"} tabbed-info-box__tab ${index === activeTabIndex ? "secondary active" : "ghost inactive"}`}
            key={`tab-${title}`}
          >
            <div className="tabbed-info-box__tab-text">
              { title }
            </div>
          </Button>
        )}
      </div>
      <div className="tabbed-info-box__content">
        { tabs[activeTabIndex].content }
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

export const Accordion = ({title, description, className="", icon=PlusIcon, children}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion ${className}`}>
      <Action className="accordion__header" onClick={() => setIsOpen(prevState => !prevState)} title={isOpen ? "Collapse" : "Expand"}>
        <div className="accordion__header__title">{ title }</div>
        <ImageIcon icon={icon} />
      </Action>
      {
        isOpen &&
        <div className="accordion__content">
          {
            description &&
            <div className="accordion__description">
              {description}
            </div>
          }
          {children}
        </div>
      }
    </div>
  );
};
