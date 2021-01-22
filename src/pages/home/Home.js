// import React from "react";
// import {inject, observer} from "mobx-react";
// import {withRouter} from "react-router";
// import { Link } from "react-router-dom";
// import {ImageIcon} from "elv-components-js";

// import Card from "./components/Card";
// import Navigation from "Layout/Navigation";
// import Logo from "Images/logo/darkLogo.png";
// import ritaHero from "Images/ritaora/heroRita.jpg";
// import ritaHome from "Images/ritaora/rita-home.jpg";

// @inject("rootStore")
// @inject("siteStore")
// @withRouter
// @observer
// class Home extends React.Component {
  
//   componentDidMount() {
//     window.scrollTo(0, 0);
//   }

//   Content() {
//     const siteCustomization = this.props.siteStore.siteCustomization || {};
//     let arrangement = siteCustomization.arrangement;
//     document.documentElement.style.setProperty('--bgColor', `${siteCustomization.colors.background}`);
//     document.documentElement.style.setProperty('--pText', `${siteCustomization.colors.primary_text}`);
//     document.documentElement.style.setProperty('--sText', `${siteCustomization.colors.secondary_text}`);
    
//     let headers = [];
//     let headerCount = 0;  // Using headerCount instead of headers.length because index needs to start at 0 and of edge case with no headers

//     let cards = [];
//     let content = [];

//     let dateFormat = require('dateformat');

//     for (let i = 0; i < arrangement.length; i++) {
//       let entry = arrangement[i];
//       if (arrangement[i].component == "header") {
//         headers.push(
//           <div className="live-content__title" key={i}>
//             {entry.options.text}
//           </div>
//         );
//         if (i != 0) {
//           headerCount++;
//         } 
//       }
//       else if (arrangement[i].component == "event") {
//         if (cards[headerCount] === undefined || cards[headerCount].length == 0) {
//           cards[headerCount] = [];
//         }
//         cards[headerCount].push(
//           <Card
//             key={i}
//             eventType={i}
//             name={entry.options.title}
//             date={dateFormat(new Date(entry.options.date), "mmmm dS, yyyy · h:MM TT Z")}
//             description={entry.options.description}
//             icon={entry.featureImage}
//           />
//         );
//       }
//     }
    
//     for (let i = 0; i < cards.length; i++) {
//       content.push(headers[i]);
//       content.push(
//         <div className="live-content__container" key={`container-${i}`}>
//           {cards[i]}
//         </div>
//       );
//     }

//     return (
//       <div className="live-content">
//         {content}
//       </div>
//     )
//   }

//   HeroView() {
//     return (
//       <div className="hero-view">
//         <div className="hero-view-background">
//           <span></span>
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//         <div className="hero-view-container">
//           <div className="hero-text">
//             <h1 className="hero-texth1">Eluvio Live</h1>
//             <h1 className="hero-texth2">Beautiful Quality, Direct from Artist, Subscription Free</h1>

//             <p className="hero-textp">
//             Purchase tickets and stream the most iconic concerts, premieres, and broadcasts.
//             </p>
//             <p className="hero-textp">
//               Enabled by the <a className="hero-texta" href="https://eluv.io/" target="_blank">Eluvio Content Fabric</a>, the world’s first decentralized and most advanced technology platform for internet video. 
//             </p>
//           </div>

//           <div className="hero-img-wrapper">
//             <img className="hero-img" src={ritaHero} />
//             <h4 className="photo-heading">
//               <span className="photo-heading-span">RITA ORA</span>
//             </h4>
//           </div>
//         </div>
//       </div>
      
//     )
//   }

//   render() {
//     if(!this.props.rootStore.client) {
//       return null;
//     }

//     return (
//       <div className="live-container">
//         {/* NavBar */}
//         <Navigation />

//         {/* Hero View */}
//         {this.HeroView()}

//         {/* Content from Site Customization */}
//         {/* {this.Content()} */}
//         <div className="live-content">
//           <div className="live-content__title" key={`title-1`}>
//             Up Next
//           </div>
//           <div className="live-content__container" key={`container-1`}>
    
//           <Card
//             key={0}
//             eventType={"concert"}
//             name={"Rita Ora"}
//             date={"January 28th, 2021 · 8:00 PM PST"}
//             description={"Streaming Live from the Eiffel Tower"}
//             icon={ritaHome}
//           />
//           </div>
//       </div>

//         {/* Footer */}
//         <div className="live-footer">
//           <h3 className="live-footer__title">
//             Copyright © Eluvio 2020 
//           </h3>
//         </div>
//       </div>
//     );
//   }
// }

// export default Home;
