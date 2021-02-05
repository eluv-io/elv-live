import React from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Navigation from "Layout/Navigation";

export const PageLoader = () => {
  return (
    <div className="loader page-loader page-container">
      <Navigation />
      <div className="circle-loader">
        <CircleLoader size={100} />
      </div>
    </div>
  );
};
