import React from "react";
import CircleLoader from "react-spinners/CircleLoader";

export const PageLoader = () => {
  return (
    <div className="loader page-loader page-container">
      <div className="main-content-container circle-loader">
        <CircleLoader size={100} />
      </div>
    </div>
  );
};
