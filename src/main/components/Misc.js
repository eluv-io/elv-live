import React, {useState, useEffect, useRef} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import ImageIcon from "./ImageIcon";
import Modal from "./Modal";
import {Action, Button} from "./Actions";
import SwiperCore, {Lazy, Pagination} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import {mainStore, uiStore} from "../stores/Main";
import {observer} from "mobx-react";
import {InitializeEluvioPlayer, EluvioPlayerParameters} from "@eluvio/elv-player-js/lib/index";
import EluvioConfiguration from "EluvioConfiguration";
import {InfoIcon, MinusIcon, PlusIcon, XIcon} from "../static/icons/Icons";
import UrlJoin from "url-join";

SwiperCore.use([Lazy, Pagination]);

export const RichText = ({richText, children, className=""}) => {
  return (
    <div className={`rich-text ${className}`}>
      { children }
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: props => <Action {...props} to={props.href} />
        }}
      >
        { DOMPurify.sanitize(richText) }
      </ReactMarkdown>
    </div>
  );
};

export const Video = observer(({
  versionHash,
  videoMetadata,
  clientOptions={},
  sourceOptions={},
  playoutParameters={},
  playerOptions={},
  autoAspectRatio=true,
  className=""
}) => {
  const [player, setPlayer] = useState(undefined);
  const [videoDimensions, setVideoDimensions] = useState(undefined);
  const client = mainStore.client;

  useEffect(() => {
    return () => player?.Destroy();
  }, [mainStore.client, player]);

  if(!videoMetadata && !versionHash) {
    return <div className="player-container player-container--loading" />;
  }

  if(!versionHash) {
    if(videoMetadata["/"]) {
      versionHash = videoMetadata["/"].split("/").find(element => element.startsWith("hq__"));
    } else if(videoMetadata["."] && videoMetadata["."].source) {
      versionHash = videoMetadata["."].source;
    }
  }

  if(!versionHash) {
    // eslint-disable-next-line no-console
    console.warn("Unable to determine playout hash for video");
    return null;
  }

  return (
    <div className={`player-container ${player ? "player-container--loaded" : "player-container--loading"} ${className}`}>
      <div
        className="player-container__player"
        style={
          !autoAspectRatio ? {} :
            {aspectRatio: `${videoDimensions?.width || 16} / ${videoDimensions?.height || 9}`}
        }
        ref={element => {
          if(!element || player) { return; }

          InitializeEluvioPlayer(
            element,
            {
              clientOptions: {
                client,
                network: EluvioPlayerParameters.networks[EluvioConfiguration.network === "main" ? "MAIN" : "DEMO"],
                ...clientOptions
              },
              sourceOptions: {
                protocols: [EluvioPlayerParameters.protocols.HLS],
                ...sourceOptions,
                playoutParameters: {
                  versionHash,
                  ...playoutParameters
                },
                contentInfo: {
                  posterImage: UrlJoin(mainStore.staticUrl, "q", versionHash, "meta", "public", "display_image")
                }
              },
              playerOptions: {
                watermark: EluvioPlayerParameters.watermark.OFF,
                muted: EluvioPlayerParameters.muted.OFF,
                autoplay: EluvioPlayerParameters.autoplay.OFF,
                controls: EluvioPlayerParameters.controls.AUTO_HIDE,
                loop: EluvioPlayerParameters.loop.OFF,
                ...playerOptions
              }
            }
          ).then(player => {
            setPlayer(player);
            player.controls.RegisterVideoEventListener("canplay", event => {
              setVideoDimensions({width: event.target.videoWidth, height: event.target.videoHeight});
            });
          });
        }}
      />
    </div>
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
              {links.map(({text, to, href, icon, includeArrow=true, target}, index) =>
                <Button
                  icon={icon}
                  to={to}
                  href={href}
                  target={target}
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

export const TabbedInfoBox = ({tabs, dark=false, noBackgroundStyling=false, className=""}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(Math.max(tabs.findIndex(tab => tab?.default), 0));

  const classNames = [
    "curved-box tabbed-info-box",
    noBackgroundStyling ? "" : dark ? "dark" : "light",
    className
  ].filter(item => item)
    .join(" ");

  return (
    <div className={classNames}>
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


export const Carousel = ({children, slidesPerView="auto", pagination=true, lazy=true, className=""}) => {
  if(!Array.isArray(children)) {
    children = children.props.children;
  }

  return (
    <div className={`carousel ${className}`}>
      <Swiper
        className="carousel__swiper"
        slidesPerView={slidesPerView}
        lazy={!lazy ? undefined :
          {
            enabled: true,
            loadPrevNext: true,
            loadOnTransitionStart: true
          }
        }
        pagination={pagination ? { clickable: true } : undefined}
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

export const AccordionGroup = ({header, children}) => {
  return (
    <div className="accordion-group curved-box info-box light">
      {
        header &&
        <div className="info-box__content">
          <div className="info-box__text">
            <h3 className="info-box__header">{ header }</h3>
          </div>
        </div>
      }
      { children }
    </div>
  );
};

export const Accordion = ({
  title,
  subtitle = "",
  titleDescription,
  description,
  className = "",
  openIcon = PlusIcon,
  closeIcon = MinusIcon,
  defaultOpen=false,
  children,
  triggerText,
  hasHeader=true,
  id
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion ${className}`}>
      <Action className={`accordion__header left-align ${hasHeader ? "" : "accordion__header--no-header-title"}`} onClick={() => setIsOpen(prevState => !prevState)} title={isOpen ? "Collapse" : "Expand"}>
        <div className="accordion__header-container" id={id || ""}>
          <div className="accordion__header-subtitle">{subtitle}</div>
          <div className={`accordion__header__title ${hasHeader ? "accordion__header__title--purple" : ""}`}>{title}</div>
          <div className="accordion__header-title-description">{titleDescription}</div>
        </div>

        {triggerText && <div className="accordion__trigger-text">{triggerText}</div> }
        {
          !triggerText &&
          <ImageIcon icon={isOpen ? closeIcon : openIcon} className="accordion__header__icon"/>
        }
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

export const Tooltip = ({className, content}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const HandleClickOutside = (event) => {
      if(ref.current && !ref.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", HandleClickOutside);

    return () => {
      document.removeEventListener("mousedown", HandleClickOutside);
    };
  }, [ref]);

  return (
    <div className={`tooltip ${className}`}>
      <Action ref={ref} icon={InfoIcon} className="tooltip__icon" onClick={() => setShowTooltip(prevState => !prevState)} />
      {
        showTooltip && <div className="tooltip__content">
          {content}
        </div>
      }
    </div>
  );
};

export const TabsPanel = ({
  tabs,
  activeTabIndex,
  className,
  children,
  mobile
}) => {
  const mediaContent = (
    <>
      {
        tabs[activeTabIndex].content?.image &&
        <div className="tabs__panel__media-container">
          <ImageIcon icon={tabs[activeTabIndex].content.image} className="tabs__panel__image" />
        </div>
      }
      {
        tabs[activeTabIndex].content?.video &&
        <div className="tabs__panel__media-container">
          <video
            className="tabs__panel__video"
            src={tabs[activeTabIndex].content?.video}
            loop
            muted
            playsInline
            autoPlay
          />
        </div>
      }
    </>
  );
  return (
    <div className={`tabs__panel ${className}`}>
      { mobile && mediaContent}
      {
        tabs[activeTabIndex].content?.subtitle &&
        <div className="tabs__panel__subtitle">
          {
            tabs[activeTabIndex].content.subtitle
          }
        </div>
      }
      {
        tabs[activeTabIndex].content?.title &&
        <div className="tabs__panel__title">
          {
            tabs[activeTabIndex].content.title
          }
        </div>
      }
      {
        tabs[activeTabIndex].content?.description &&
        <div className="tabs__panel__description">
          {
            tabs[activeTabIndex].content?.description
          }
        </div>
      }
      { !mobile && mediaContent }
    </div>
  );
};

export const TabsList = ({
  tabs=[],
  className,
  darkMode=false,
  activeTabIndex,
  setActiveTabIndex,
  orientation="horizontal",
  wrap=true
}) => {
  const isActive = (index) => {
    if(activeTabIndex === index) { return true; }
  };

  const containerClassNames=["tabs", className].filter(e => !!e).join(" ");

  return (
    <div className={containerClassNames}>
      <div className={`tabs__list ${orientation} ${wrap ? "wrap" : ""}`}>
        {
          tabs.map((tab, i) => {
            const buttonClassNames = [
              "tabs__button",
              darkMode ? "tabs__button--dark" : "tabs__button--light",
              isActive(i) ? "active" : "inactive",
              orientation === "horizontal" ? "horizontal" : "vertical"
            ]
              .filter(e => !!e).join(" ");

            return (
              <Button
                key={tab.title}
                className={buttonClassNames}
                onClick={() => setActiveTabIndex(i)}
              >
                {tab.title}
                <ImageIcon icon={PlusIcon} height={10} width={10} style={isActive(i) ? {transform: "rotate(45deg)"} : null}/>
              </Button>
            );
          })
        }
      </div>
    </div>
  );
};
