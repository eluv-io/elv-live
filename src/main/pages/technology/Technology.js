import React from "react";
import {ExpandableImage, InfoBox, TabbedInfoBox} from "../../components/Misc";

import ArchitectureDiagram from "../../static/images/technology/architecture.jpg";
import HowItWorksDiagram from "../../static/images/technology/how-it-works.jpg";
import MonetizationDiagram from "../../static/images/technology/on-chain-monetization.jpg";

import {LinkIcon, DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";

const Technology = () => {
  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>Eluv.io Technology</h1>
        <h3>The Technology behind the Content Fabric</h3>
      </div>
      <div className="page__content-block">
        <p className="page__copy multi-column">
          Eluvio LIVE is powered by the <a href="https://google.com" target="_blank">Eluvio Content Fabric</a>, the most advanced technology for Internet video. A decentralized, global platform built on blockchain, the Fabric provides low latency, high quality (4K) content distribution, content monetization, and just-in-time streaming. Under the control of blockchain smart contracts, video content is dynamically served from the source as live and on demand streaming as well as dynamic sequences without need for 3rd party services.

          The Eluvio Content Fabric's just-in-time capabilities replace and consolidate the standard functions of live ingest, cloud origin, live transcoding, content management, encryption/DRM, program sequencing, rights and avails controls, direct-to-consumer streaming, and static content distribution.

          All of this at a significantly lower cost point, with lower latency, and a naturally greater range of creative experiences than conventional technologies. The platform uses open APIs and a programmable approach for ingest, content distribution, content management, and rights control. All operations are blockchain provable.

          The Content Fabric was invented by a team led by Michelle Munson and Serban Simu, founders of the industry standard Aspera high speed transfer technology (acquired by IBM in 2014) and is currently used by tier 1 Hollywood studios, broadcasters, and mobile streaming providers. The Eluvio Content Fabric was recognized with the 2020 Hollywood Professional Association Engineering Excellence Award.
        </p>
      </div>

      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.LearnMoreFabricIcon}
          header="Learn More About the Content Fabric"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              text: "Content Fabric",
              icon: LinkIcon,
              to: "/content-fabric"
            },
            {
              text: "Whitepaper",
              icon: DocumentIcon,
              to: "https://google.com"
            }
          ]}
        />
      </div>

      <div className="page__content-block">
        <TabbedInfoBox
          tabs={[
            {
              title: "Architecture",
              icon: TechnologyIcons.ArchitectureIcon,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={ArchitectureDiagram} imageClassName="component-test__image" />
                </div>
              )
            },
            {
              title: "How it Works",
              icon: TechnologyIcons.HowItWorksIcon,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={HowItWorksDiagram} imageClassName="component-test__image" />
                </div>
              )
            },
            {
              title: "On-Chain Monetization",
              icon: TechnologyIcons.OnChainMonetizationIcon,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={MonetizationDiagram} imageClassName="component-test__image" />
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Technology;
