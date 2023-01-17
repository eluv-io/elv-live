import React from "react";
import "./static/stylesheets/app.scss";

import {createRoot} from "react-dom/client";
import {Provider} from "mobx-react";
import * as Stores from "./stores/Main.js";
import ComponentTest from "./ComponentTest";
import {Routes} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";

const MainApp = () => {
  return (
    <div className="main">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ComponentTest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

createRoot(document.getElementById("app")).render(
  <Provider {...Stores}>
    <MainApp />
  </Provider>
);

export default MainApp;
