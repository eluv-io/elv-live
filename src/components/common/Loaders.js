import React from "react";

export const PageLoader = ({className=""}) => {
  return (
    <div className={`loader page-loader page-container ${className}`}>
      <div className="main-content-container circle-loader">
        <div className="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};


export const Loader = ({className=""}) => {
  return (
    <div className={`loader ${className}`}>
      <div className="circle-loader">
        <div className="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

