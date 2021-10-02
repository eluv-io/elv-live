import React, {useState} from "react";
import useResizeObserver from "@react-hook/resize-observer";

const MIN_WIDTH=400;
const MAX_WIDTH=1200;
const SPREAD = MAX_WIDTH - MIN_WIDTH;

const Carousel = ({elements=[], startIndex=0, minVisible=2, maxVisible=5, className="", placeholderClassname=""}) => {
  const target = React.useRef(null);
  const [index, setIndex] = useState(startIndex);
  const [visible, setVisible] = useState(maxVisible);

  // Automatically set num visible between max and min based on width
  useResizeObserver(target, entry => {
    const newVisible = Math.min(maxVisible, Math.max(minVisible, Math.floor(maxVisible * Math.max(entry.contentRect.width - MIN_WIDTH, 0) / SPREAD)));

    if(visible !== newVisible) {
      setVisible(newVisible);
      setIndex(startIndex);
    }
  });

  const CarouselButton = ({type, content, value, visible}) => {
    return (
      <div className={`carousel__button-container carousel__button-container-${type}`}>
        {
          !visible ? null :
            <button className="carousel__button" onClick={event => { event.preventDefault(); setIndex(value); }}>
              {content}
            </button>
        }
      </div>
    );
  };

  const visibleElements = elements.slice(index, index + visible);
  const placeholders = visible - visibleElements.length;

  return (
    <div className={`carousel ${elements.length > maxVisible ? "carousel-scrollable" : ""} ${className}`} ref={target}>
      <CarouselButton type="prev" content="❮" value={index - 1} visible={index > 0} />
      { visibleElements }
      { [...new Array(placeholders)].map((_, i) => <div key={`carousel-placeholder-${i}`} className={`carousel__placeholder ${placeholderClassname}`} /> ) }
      <CarouselButton type="next" content="❯" value={index + 1} visible={index + visible < elements.length} />
    </div>
  );
};

export default Carousel;
