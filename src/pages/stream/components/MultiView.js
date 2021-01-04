import React from "react";
import BitmovinPlayer from "../player/BitmovinPlayer";
import CloseIcon from "../../../assets/icons/x.svg";
import {ImageIcon} from "elv-components-js";

const MultiView = ({ config, setStream, activeStream, isOpen }) => {
  
  // For 6 views, 0-5: individual views, 6: mosaic view

  return (
    <div className="feedGrid" style={{ gridTemplateColumns: config["grid"]["columns"],gridTemplateRows: config["grid"]["rows"]}} >
      {/* {(isOpen) && activeStream != 6 ?           
          <ImageIcon
            key={`back-icon-Close Modal`}
            className={"back-button-stream"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => setStream(6)}
          />
        : null} */}

      {Object.entries(config["streams"]).map(([key, value]) => (
        <div key={key} id={`videobox${key}`} className={activeStream === value.feedOption ? "singleVideoBox" : activeStream === 6 ? "videobox" : "hideVideoBox"} style={{ gridArea: value.gridArea}} onClick={() => setStream(value.feedOption)}>
          <BitmovinPlayer feed={value.feedOption} activeStream={activeStream} />
          {/* {activeStream === 6 ? <h4 className="video-heading">
            <span className="video-heading-span">{value.title}</span>
      </h4> : null} */}
        </div>
      ))}
    </div>
  );
};

export default MultiView;

