import React from 'react';
import ViewStream from "./ViewStream";

const MultiView = ({ config, handleViewOpen, handleViewClose, isOpen }) => {

    return (
      <div className="feedGrid" style={{ gridTemplateColumns: config["grid"]["columns"],gridTemplateRows: config["grid"]["rows"]}} >
        {isOpen ?           
          <div id={`exitExpand`} className="video-close" onClick={handleViewClose}>
            <span className="video-close-span">All Views</span>
          </div> 
          : null}

       {Object.entries(config["streams"]).map(([key, value]) => (
          <div key={key} id={`videobox${key}`} className={`videobox`} style={{ gridArea: value.gridArea}} onClick={handleViewOpen}>
            <ViewStream feedOption={value.feedOption} classProp = "stream-video" mutedOption = {false} showControls = {false}/>
            <h4 className="video-heading">
              <span className="video-heading-span">{value.title}</span>
            </h4>
          </div>
        ))}
      </div>
    );
};

export default MultiView;
