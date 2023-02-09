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
import Contact from "./pages/contact/Contact";
import TenancyLevels from "./pages/features/TenancyLevels";
import Details from "./pages/features/Details";
import Rates from "./pages/features/Rates";
import FeaturesSupport from "./pages/features/Support";

export const PageContainer = observer(({children, before, after, padded=false, dark=false, unbound=false}) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if(!Stores.mainStore.mainSite) {
    return null;
  }

  return (
    <>
      <Header />
      { before }
      <div
        key={`page-container-${location.pathname}`}
        className={`page-container fade-in ${padded ? "padded-block" : ""} ${dark ? "dark" : "light"} ${unbound ? "unbound" : ""}`}
      >
        {children}
      </div>
      { after }
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
          <Route path="/contact" element={<PageContainer padded><Contact /></PageContainer>} />
          <Route path="/partners" element={<PageContainer padded><Partners /></PageContainer>} />
          <Route path="/news" element={<PageContainer padded><News /></PageContainer>} />
          <Route path="/news/:slug" element={<PageContainer padded><NewsItem /></PageContainer>} />
          <Route path="/content-fabric" element={<PageContainer padded><ContentFabric /></PageContainer>} />
          <Route path="/content-fabric/technology" element={<PageContainer padded><Technology /></PageContainer>} />
          <Route path="/content-fabric/blockchain" element={<PageContainer padded><Blockchain /></PageContainer>} />
          <Route path="/features" element={<Navigate replace to="/features/tenancy-levels" />} />
          <Route path="/features/tenancy-levels" element={<TenancyLevels />} />
          <Route path="/features/rates" element={<Rates />} />
          <Route path="/features/support" element={<FeaturesSupport />} />
          <Route path="/features/details" element={<PageContainer padded><Details /></PageContainer>} />
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
