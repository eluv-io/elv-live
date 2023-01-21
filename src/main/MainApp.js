import React from "react";
import "./static/stylesheets/app.scss";

import {createRoot} from "react-dom/client";
import {Provider} from "mobx-react";
import * as Stores from "./stores/Main.js";
import ComponentTest from "./ComponentTest";
import {Routes, useLocation} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Partners from "./pages/partners/Partners";
import Technology from "./pages/technology/Technology";

const PageContainer = ({children, padded=false, dark=false}) => {
  const location = useLocation();

  return (
    <>
      <Header
        notification={(
          <>
            <h2>Notification</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
            </p>
          </>
        )}
      />
      <div
        key={`page-container-${location.pathname}`}
        className={`page-container fade-in ${padded ? "padded-block" : ""} ${dark ? "dark" : "light"}`}
      >
        {children}
      </div>
      <Footer dark={dark} />
    </>
  );
};

const MainApp = () => {
  return (
    <div className="main">
      <BrowserRouter>
        <Routes>
          <Route path="/partners" element={<PageContainer padded><Partners /></PageContainer>} />
          <Route path="/technology" element={<PageContainer padded><Technology /></PageContainer>} />
          <Route path="*" element={<PageContainer><ComponentTest /></PageContainer>} />
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
