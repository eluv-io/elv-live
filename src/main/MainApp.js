import React from "react";
import "Styles/main-app.scss";

import ScrollToTop from "Common/ScrollToTop";
import {render} from "react-dom";
import {Provider} from "mobx-react";

const MainApp = () => {
  return (
    <div className="main">
      Main
    </div>
  );
};


render(
  (
    <MainApp />
  ),
  document.getElementById("app")
);

export default MainApp;
