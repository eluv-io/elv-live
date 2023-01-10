import React from "react";
import "Styles/main-app.scss";

//import ScrollToTop from "Common/ScrollToTop";
import {createRoot} from "react-dom/client";
import {Provider} from "mobx-react";
import * as Stores from "./stores/Main.js";

const MainApp = () => {
  return (
    <div className="main">
      Main
    </div>
  );
};


createRoot(document.getElementById("app")).render(
  <Provider {...Stores}>
    <MainApp />
  </Provider>
);

export default MainApp;
