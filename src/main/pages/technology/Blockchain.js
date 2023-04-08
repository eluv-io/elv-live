import React, {useEffect, useState} from "react";
import {ExpandableImage, RichText} from "../../components/Misc";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import LearnMore from "./LearnMore";

import BlockchainEcosystemImage from "../../static/images/blockchain/blockchain_ecosystem.png";
import ContentFabricArchitectureImage from "../../static/images/blockchain/cfab_architecture.png";
import ContentFabricEconomicsImage from "../../static/images/blockchain/content_fabric_economics.png";
import ContentFabricNetworkImage from "../../static/images/blockchain/content_fabric_network.png";
import ContentFabricPipelineImage from "../../static/images/blockchain/content_fabric_pipeline.png";
import ContentFabricTokenFlowImage from "../../static/images/blockchain/content_fabric_token_flow.png";
import ContentObjectComponentsImage from "../../static/images/blockchain/content_object_components.png";
import ContentObjectImage from "../../static/images/blockchain/content_object.png";
import GeneralFlowOfFabricOpsPolicyImage from "../../static/images/blockchain/general_flow_of_fabric_ops_policy.png";
import ImageXcodePipelineImage from "../../static/images/blockchain/image-xcode-pipeline.png";
import OnChainCrossChainTokenGatedAccessImage from "../../static/images/blockchain/onchain_crosschain_token_gated_access.png";

const images= {
  our_blockchain: ContentFabricNetworkImage,
  technology_background: ContentFabricArchitectureImage,
  on_chain_content_objects: ContentObjectImage,
  jit_composition: ImageXcodePipelineImage,
  content_authorization: ContentObjectComponentsImage,
  token_economics: BlockchainEcosystemImage,
  stakeholders: ContentFabricEconomicsImage,
  utility_token_circulation: ContentFabricTokenFlowImage,
  key_innovations: ContentFabricPipelineImage,
  content_lifecycle: GeneralFlowOfFabricOpsPolicyImage,
  on_chain_authorization: OnChainCrossChainTokenGatedAccessImage,
};

const Blockchain = observer(() => {
  const copy = mainStore.l10n.blockchain;
  const tabs = Object.keys(copy.pages).map(key => [copy.pages[key].label, key]);

  const [tab, setTab] = useState("our_blockchain");

  let currentImages;
  if(images[tab]) {
    currentImages = Array.isArray(images[tab]) ? images[tab] : [images[tab]];
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{ copy.title }</h1>
        <h3>{ copy.header }</h3>
      </div>
      <div className="page__content-block right-links">
        <div className="page__copy-block">
          <RichText richText={copy.pages[tab].text} key={`page-${tab}`} className="page__copy fade-in--slow" />
          {
            currentImages ?
              <div className="page__copy-images">
                {
                  currentImages.map((image, index) =>
                    <ExpandableImage key={`image-${index}`} image={image} expandable/>)
                }
              </div> : null
          }
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
        <LearnMore />
      </div>
    </div>
  );
});

export default Blockchain;
