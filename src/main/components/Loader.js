import React from "react";

export const Loader = ({className=""}) => {
  return (
    <div className={`loader ${className}`} aria-label="Loading Indicator">
      <div className="loader__element loader__element-1" />
      <div className="loader__element loader__element-2" />
      <div className="loader__element loader__element-3" />
      <div className="loader__element loader__element-4" />
    </div>
  );
};

export const PageLoader = ({className="", loaderClassName=""}) => {
  return (
    <div className={`page-loader ${className}`}>
      <Loader className={loaderClassName} />
    </div>
  );
};
