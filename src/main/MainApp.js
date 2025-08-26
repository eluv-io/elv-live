import React, {useEffect} from "react";
import "./static/stylesheets/app.scss";

import {createRoot} from "react-dom/client";
import {observer, Provider} from "mobx-react";
import * as Stores from "./stores/Main.js";
import {Navigate, Routes, useLocation} from "react-router";
import {BrowserRouter, Route} from "react-router-dom";
import {mainStore} from "./stores/Main.js";

import Header from "./components/Header";
import Footer from "./components/Footer";

import MainPage from "./pages/main/Main";
import Partners from "./pages/partners/Partners";
import Technology from "./pages/technology/Technology";
import ContentFabric from "./pages/technology/ContentFabric";
import Blockchain from "./pages/technology/Blockchain";
import ContactForm from "./components/ContactForm";
import News from "./pages/news/News";
import NewsItem from "./pages/news/NewsItem";
import Contact from "./pages/contact/Contact";
import TenancyLevels from "./pages/features/TenancyLevels";
import Features from "./pages/features/Features";
import Pricing from "./pages/features/Pricing";
import {FeaturesSupport} from "./pages/features/Support";
import FAQs from "./pages/features/FAQs";
import Creators from "./pages/main/Creators";
import Wallet from "./pages/wallet/Wallet";
import MediaWallet from "./pages/main/MediaWallet";
import CompatibleDevices from "./pages/main/CompatibleDevices";
import Register from "./pages/register/Register";
import FabricCore from "./pages/technology/FabricCore";
import CreatorStudio from "./pages/apps/CreatorStudio";
import Analytics from "./pages/apps/Analytics";
import AiClipSearch from "./pages/apps/AiClipSearch";
import VideoEditor from "./pages/apps/VideoEditor";
import MediaWalletApp from "./pages/apps/MediaWalletApp";
import EmbeddablePlayer from "./pages/apps/EmbeddablePlayer";

const expectedDomains = [
  "live.demov3.contentfabric.io",
  "live-stg.demov3.contentfabric.io",
  "live-stg-eluv-io.web.app",
  "live.eluv.io",
  //"elv-test.io"
];

export const PageContainer = observer(({children, before, after, padded=false, dark=false, unbound=false, noFooter=false, noContactForm=false}) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // If unexpected domain, may be a domain redirect. Wait until metadata has been loaded before showing content
  if(!mainStore.mainSite && !expectedDomains.includes(window.location.hostname)) {
    return null;
  }

  return (
    <div className={`main ${dark ? "dark" : "light"}`}>
      <Header />
      { before }
      <div
        key={`page-container-${location.pathname}`}
        className={`page-container fade-in ${padded ? "padded-block" : ""} ${dark ? "dark" : "light"} ${unbound ? "unbound" : ""}`}
      >
        {children}
      </div>
      { after }
      {
        noFooter ? null :
          <>
            { noContactForm ? null : <ContactForm dark={dark}/> }
            <Footer dark={dark}/>
          </>
      }
    </div>
  );
});

const MainApp = () => {
  return (
    <div className="main">
      <BrowserRouter>
        <Routes>
          {/* About Routes */}
          <Route path="/about/contact" element={<PageContainer padded><Contact /></PageContainer>} />
          <Route path="/about/partners" element={<PageContainer padded><Partners /></PageContainer>} />
          <Route path="/about/news" element={<PageContainer padded><News /></PageContainer>} />
          <Route path="/about/news/:slug" element={<PageContainer padded><NewsItem /></PageContainer>} />
          {/* Creators & Publishers Routes */}
          <Route path="/creators-and-publishers" element={<PageContainer unbound dark><Creators /></PageContainer>} />
          {/* Media Wallet Routes */}
          <Route path="/media-wallet" element={<PageContainer unbound dark><MediaWallet /></PageContainer>} />
          <Route path="/media-wallet/compatible-devices" element={<CompatibleDevices />} />
          {/* Content Fabric Routes*/}
          <Route path="/content-fabric" element={<PageContainer padded><ContentFabric /></PageContainer>} />
          <Route path="/content-fabric/technology" element={<PageContainer padded><Technology /></PageContainer>} />
          <Route path="/content-fabric/blockchain" element={<PageContainer padded><Blockchain /></PageContainer>} />
          {/* Apps Routes */}
          <Route path="/apps/fabric-core" element={<PageContainer padded><FabricCore /></PageContainer>} />
          {/* Monetization Routes */}
          <Route path="/monetization/creator-studio" element={<PageContainer padded><CreatorStudio /></PageContainer>} />
          <Route path="/monetization/analytics" element={<PageContainer padded><Analytics /></PageContainer>} />
          <Route path="/monetization/media-wallet" element={<PageContainer padded><MediaWalletApp /></PageContainer>} />
          <Route path="/monetization/embeddable-player" element={<PageContainer padded><EmbeddablePlayer /></PageContainer>} />
          {/* Video Intelligence Routes */}
          <Route path="/video-intelligence/video-editor" element={<PageContainer padded><VideoEditor /></PageContainer>} />
          <Route path="/video-intelligence/ai-search" element={<PageContainer padded><AiClipSearch /></PageContainer>} />
          {/* Community Routes */}
          <Route path="/community" element={<PageContainer padded></PageContainer>} />
          {/* Features Routes */}
          <Route path="/features" element={<Navigate replace to="/features/tenancy-levels" />} />
          <Route path="/features/tenancy-levels" element={<TenancyLevels />} />
          <Route path="/features/pricing" element={<PageContainer padded after={<FAQs />}><Pricing /></PageContainer>} />
          <Route path="/features/support" element={<PageContainer padded after={<FAQs />}><FeaturesSupport /></PageContainer>} />
          <Route path="/features/details" element={<PageContainer padded after={<FAQs />}><Features /></PageContainer>} />
          {/* Wallet */}
          <Route path="/wallet/*" element={<PageContainer unbound noFooter><Wallet /></PageContainer>} />
          {/* Register */}
          <Route path="/register" element={<PageContainer unbound dark noContactForm><Register /></PageContainer>} />
          {/* Defaults */}
          <Route path="/" element={<PageContainer unbound dark><MainPage /></PageContainer>} />
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
