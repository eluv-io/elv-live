import React from "react";

import FoxLogo from "../../static/images/partners/Fox.svg";
import MGMLogo from "../../static/images/partners/MGM.svg";
import EluvioLogo from "../../static/images/logos/eluvio-logo.svg";
import {GridCarousel} from "../../components/Misc";
import PartnerIcon from "./PartnerIcon";
import ImageIcon from "../../components/ImageIcon";

let partners = [
  {
    name: "Fox",
    logo: FoxLogo,
    text: "“At FOX, we believe that the blockchain, and the overall shift towards a more decentralized web, is providing creators with a wealth of opportunities to reach consumers with exciting new experiences. Michelle, Serban and the Eluvio team are the best in the business when it comes to the software and scalable infrastructure required to power live, decentralized experiences across the blockchain and our investment will help bring this technology to a wider market of content creators, media partners and advertising clients.” \n" +
      "\n" +
      "— Paul Cheesbrough, Chief Technology Officer and President of Digital for Fox Corporation\n",
    provider: true,
    validator: true
  },
  {
    name: "MGM",
    logo: MGMLogo,
    text: "“At FOX, we believe that the blockchain, and the overall shift towards a more decentralized web, is providing creators with a wealth of opportunities to reach consumers with exciting new experiences. Michelle, Serban and the Eluvio team are the best in the business when it comes to the software and scalable infrastructure required to power live, decentralized experiences across the blockchain and our investment will help bring this technology to a wider market of content creators, media partners and advertising clients.” \n" +
      "\n" +
      "— Paul Cheesbrough, Chief Technology Officer and President of Digital for Fox Corporation\n",
    provider: true
  }
];

partners = [...partners, ...partners, ...partners];

let ecosystem = [{name: "Fox", logo: FoxLogo}, {name: "MGM", logo: MGMLogo}, {name: "Eluvio", logo: EluvioLogo}];

ecosystem = [...ecosystem, ...ecosystem, ...ecosystem, ...ecosystem, ...ecosystem, ...ecosystem];

const Partners = () => {
  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>Our Partners</h1>
      </div>
      <div className="page__content-block">
        <div className="page__copy">
          Eluvio partnerships are built on the principals of bringing outstanding content and experiences to their audience in a fundamentally groundbreaking way. Our content partners bring new and innovative ways of experiencing content through visual, interactive and gamified engagement. Our technology partners are innovating on our platform to deliver the new wave of content supply chain to the market, with levels of security, efficiency and sustainability never before possible. Together we are changing the way the creators and consumers are brought closer together.
        </div>
      </div>

      <div className="page__content-block">
        <h3 className="page__content-block__header">Node Providers & Validators</h3>
        <GridCarousel classNameGrid="centered partners__list--grid" classNameCarousel="partners__list--carousel">
          {
            partners.map(({name, logo, text, provider, validator}) =>
              <PartnerIcon
                name={name}
                logo={logo}
                modalContent={text}
                isProvider={provider}
                isValidator={validator}
                key={`partner-${name}`}
              />
            )
          }
        </GridCarousel>
      </div>

      <div className="page__content-block">
        <h3 className="page__content-block__header">Ecosystem</h3>
        <div className="grid partners__ecosystem">
          { ecosystem.map(({name, logo}) =>
            <ImageIcon title={name} icon={logo} className="partners__ecosystem-icon" key={`ecosystem-${name}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Partners;
