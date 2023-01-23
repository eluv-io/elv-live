import React, {useState} from "react";
import {InfoBox} from "../../components/Misc";

import TestIcon from "../../static/icons/learn-more-about-the-technology.svg";
import LinkIcon from "../../static/icons/link.svg";
import DocumentIcon from "../../static/icons/view-document.svg";

const tabs = [
  ["Our Blockchain", "our-blockchain"],
  ["Technology Background", "technology-background"],
  ["Blockchain Protocol", "blockchain-protocol"],
  ["Token Model", "token-model"],
  ["Tokens and Metering", "tokens-and-metering"],
  ["NFTs", "nfts"],
  ["APIs", "apis"],
  ["Common Questions", "common-questions"]
];

const Blockchain = () => {
  const [tab, setTab] = useState("our-blockchain");

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>Eluv.io BlockChain</h1>
        <h3>A Comprehensive Overview of Our Blockchain</h3>
      </div>
      <div className="page__content-block right-links">
        <div className="page__copy">
          <p>
          2020 brought many profound and irreversible changes to the content creation industry. The challenges and opportunity of the global pandemic dramatically accelerated many trends, such as the monetization of deep libraries, remote and online production; the creation of self service properties for selling, screening, licensing and servicing; direct-to-audience models including no-windows streaming releases; fully virtual live performances and broadcasts and the complete virtualization of marketing, pre-release screening, and advertising sales.
          </p>
          <p>
          Perhaps most significant of all, the end of 2020 and early 2021 brought the first mainstream monetization of content on the blockchain with the release of the first high value NFTs created from digital art, digital collectible communities for fans, and the first direct-to-consumer content distribution models backed by blockchain ticketing and sales. We are fortunate to be part of this, and have helped to enable the first just-in-time supply chains with our customers in their drive to fully digitize, transform costs, and embrace the power of blockchain economics to create significant new revenue opportunities for premium content.
          </p>
          <p>
          Our involvement with organizations such as ETC, HPA, SMPTE, NIVA, EVR1, SXSW, and the Blockchain Xcelerator, influence from major established media companies, labels and bands, and input from various independent creators have helped us to grow the Content Fabric platform—a blockchain controlled real-time content storage and distribution network—to a point of scale and practical decentralization for our user community. The Content Fabric’s blockchain is the foundation of this capability.
          </p>
        </div>
        <div className="page__side-links">
          {
            tabs.map(([label, key]) =>
              <button
                onClick={() => setTab(key)}
                key={`link-${key}`}
                className={`page__side-link ${tab === key ? "active" : "inactive"}`}
              >
                { label }
              </button>
            )
          }
        </div>
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TestIcon}
          header="Learn More About the Content Fabric"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "/content-fabric/",
              text: "Content Fabric",
              icon: LinkIcon
            },
            {
              to: "https://google.com",
              text: "Whitepaper",
              icon: DocumentIcon
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Blockchain;
