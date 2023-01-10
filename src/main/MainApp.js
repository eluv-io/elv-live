import React from "react";
import "Styles/main-app.scss";

//import ScrollToTop from "Common/ScrollToTop";
import {render} from "react-dom";
import {Provider} from "mobx-react";
import * as Stores from "./stores/Main.js";

const MainApp = () => {
  return (
    <div className="main">
      Main
    </div>
  );
};


render(
  (
    <Provider {...Stores}>
      <MainApp />
    </Provider>
  ),
  document.getElementById("app")
);

export default MainApp;
