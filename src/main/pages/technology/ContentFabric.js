import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {InfoBox} from "../../components/Misc";
import {Action} from "../../components/Actions";

import TestIcon from "../../static/icons/learn-more-about-the-technology.svg";
import LinkIcon from "../../static/icons/link.svg";
import DocumentIcon from "../../static/icons/view-document.svg";
import BlockchainImage from "../../static/images/technology/blockchain-graphic.png";

const ContentFabric = () => {
  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>The Content Fabric Protocol</h1>
        <h3>Utility Blockchain Network for Content</h3>
      </div>
      <div className="page__content-block">
        <div className="icon-boxes">
          <div className="curved-box icon-box light">
            <div className="icon-box__headers">
              <h4>Programmable</h4>
              <h4>Hyper Efficient</h4>
              <h4>No File Copies</h4>
            </div>
            <ImageIcon icon={TestIcon} className="icon-box__icon" />
          </div>
          <div className="curved-box icon-box light">
            <div className="icon-box__headers">
              <h4>Storage</h4>
              <h4>Distribution</h4>
              <h4>Streaming</h4>
            </div>
            <ImageIcon icon={TestIcon} className="icon-box__icon" />
          </div>
          <div className="curved-box icon-box light">
            <div className="icon-box__headers">
              <h4>On chain Ownership</h4>
              <h4>Versioning</h4>
              <h4>Access</h4>
            </div>
            <ImageIcon icon={TestIcon} className="icon-box__icon" />
          </div>
        </div>
      </div>
      <div className="page__content-block top-separator left-image">
        <ImageIcon icon={BlockchainImage} className="page__content-block__header-image" />
        <div className="content">
          <h3 className="page__content-block__header">Eco-Friendly Consensus & Just-In-Time Protocol</h3>
          <div className="page__copy">
            <p>
            Through a novel compositional and just-in-time protocol, the <Action to="/content-fabric/blockchain" className="light">Eluvio Content Blockchain</Action> does not make digital file copies and dramatically reduces the network storage and usage requirements significantly as compared to today’s traditional streaming and content distribution systems.
            </p>

            <p>
            It also uses an eco-friendly consensus, which avoids the high energy consumption of computational “proof-of-work” blockchains. And the digital content itself, not just the token is owned on the blockchain so your digital assets are exclusive to you.
            </p>
          </div>
        </div>
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TestIcon}
          header="Learn More About the Technology"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "/content-fabric/technology",
              text: "Technology Section",
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
      <div className="page__content-block">
        <div className="curved-box mainnet-info light">
          <h3 className="mainnet-info__header">
            <ImageIcon icon={DocumentIcon} className="mainnet-info__header-icon" />
            MainNet
          </h3>
          <div className="mainnet-info__text">
            Integer rutrum nibh nisi, et semper quam varius ut. Sed pellentesque sagittis purus a pellentesque. Pellentesque vitae lobortis nisl. Nunc sed nulla rutrum sapien porta fermentum. Fusce rhoncus nunc dictum, porttitor orci ac, dapibus nulla. Vestibulum consectetur diam non felis dapibus, sed sodales nisl tincidunt.
          </div>
          <div className="mainnet-info__icons">
            <div className="mainnet-info__icon">
              <ImageIcon icon={TestIcon} className="mainnet-info__icon__icon" />
              <div className="mainnet-info__icon__text">Fabric Browser</div>
            </div>
            <div className="mainnet-info__icon">
              <ImageIcon icon={TestIcon} className="mainnet-info__icon__icon" />
              <div className="mainnet-info__icon__text">Blockchain Explorer</div>
            </div>
            <div className="mainnet-info__icon">
              <ImageIcon icon={TestIcon} className="mainnet-info__icon__icon" />
              <div className="mainnet-info__icon__text">Github Repo</div>
            </div>
          </div>
        </div>
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TestIcon}
          header="Node & Validator Providers"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "https://google.com",
              text: "View Document",
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TestIcon}
          header="API Developers"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "https://google.com",
              text: "View Document",
              icon: DocumentIcon
            },
            {
              to: "https://google.com",
              text: "View Document",
              icon: DocumentIcon
            },
            {
              to: "https://google.com",
              text: "View Document",
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TestIcon}
          header="Current State & Roadmap"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "https://google.com",
              text: "View Document",
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TestIcon}
          header="Become a Node Operator"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "https://google.com",
              text: "View Document",
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          header="Community"
          links={[
            {
              to: "https://google.com",
              text: "Genesis NFT",
              icon: DocumentIcon
            },
            {
              to: "https://google.com",
              text: "Meeting #2 NFT",
              icon: DocumentIcon
            },
            {
              to: "https://google.com",
              text: "Meeting #3 NFT",
              icon: DocumentIcon
            }
          ]}
        />
      </div>
    </div>
  );
};

export default ContentFabric;
