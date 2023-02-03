import React, {useEffect} from "react";
import "./static/stylesheets/app.scss";

import {createRoot} from "react-dom/client";
import {observer, Provider} from "mobx-react";
import * as Stores from "./stores/Main.js";
import ComponentTest from "./ComponentTest";
import {Navigate, Routes, useLocation} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Partners from "./pages/partners/Partners";
import Technology from "./pages/technology/Technology";
import ContentFabric from "./pages/technology/ContentFabric";
import Blockchain from "./pages/technology/Blockchain";
import ContactForm from "./components/ContactForm";
import News from "./pages/news/News";
import NewsItem from "./pages/news/NewsItem";

const PageContainer = observer(({children, padded=false, dark=false, unbound=false}) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if(!Stores.mainStore.mainSite) {
    return null;
  }

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
        className={`page-container fade-in ${padded ? "padded-block" : ""} ${dark ? "dark" : "light"} ${unbound ? "unbound" : ""}`}
      >
        {children}
      </div>
      <ContactForm dark={dark} />
      <Footer dark={dark} />
    </>
  );
});

const MainApp = () => {
  return (
    <div className="main">
      <BrowserRouter>
        <Routes>
          <Route path="/partners" element={<PageContainer padded><Partners /></PageContainer>} />
          <Route path="/news" element={<PageContainer padded><News /></PageContainer>} />
          <Route path="/news/:slug" element={<PageContainer padded><NewsItem /></PageContainer>} />
          <Route path="/content-fabric" element={<PageContainer padded><ContentFabric /></PageContainer>} />
          <Route path="/content-fabric/technology" element={<PageContainer padded><Technology /></PageContainer>} />
          <Route path="/content-fabric/blockchain" element={<PageContainer padded><Blockchain /></PageContainer>} />
          <Route path="/" element={<PageContainer unbound><ComponentTest /></PageContainer>} />
          <Route path="*" element={<Navigate replace to="/" />} />
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
