import React, {useState} from "react";
import useResizeObserver from "@react-hook/resize-observer";

const MIN_WIDTH=500;
const MAX_WIDTH=1200;
const SPREAD = MAX_WIDTH - MIN_WIDTH;

const Carousel = ({elements=[], minVisible=2, maxVisible=5, className=""}) => {
  const target = React.useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const [visible, setVisible] = useState(maxVisible);

  // Automatically set num visible between max and min based on width
  useResizeObserver(target, entry => {
    const newVisible = Math.min(maxVisible, Math.max(minVisible, Math.floor(maxVisible * Math.max(entry.contentRect.width - MIN_WIDTH, 0) / SPREAD)));

    if(visible !== newVisible) {
      setVisible(newVisible);
      setStartIndex(0);
    }
  });

  const CarouselButton = ({type, content, value, visible}) => {
    return (
      <div className={`carousel__button-container carousel__button-container-${type}`}>
        {
          !visible ? null :
            <button className="carousel__button" onClick={event => { event.preventDefault(); setStartIndex(value); }}>
              {content}
            </button>
        }
      </div>
    );
  };

  return (
    <div className={`carousel ${className}`} ref={target}>
      <CarouselButton type="prev" content="❮" value={startIndex - 1} visible={startIndex > 0} />
      { elements.slice(startIndex, startIndex + visible) }
      <CarouselButton type="next" content="❯" value={startIndex + 1} visible={startIndex + visible < elements.length} />
    </div>
  );
};

export default Carousel;
