import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {InfoBox, RichText} from "../../components/Misc";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";

import BlockchainImage from "../../static/images/technology/blockchain-graphic.png";

import {DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import LearnMore from "./LearnMore";

const ContentFabric = observer(() => {
  const copy = mainStore.l10n.content_fabric;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>
          { copy.title }
        </h1>
        <h3>
          { copy.header }
        </h3>
      </div>
      <div className="page__content-block">
        <div className="icon-boxes">
          <div className="curved-box icon-box light">
            <div className="icon-box__headers">
              { copy.cards["1"].map(text => <h4 key={`card-${text}`}>{ text }</h4>) }
            </div>
            <ImageIcon icon={TechnologyIcons.NoFileCopiesIcon} className="icon-box__icon" />
          </div>
          <div className="curved-box icon-box light">
            <div className="icon-box__headers">
              { copy.cards["2"].map(text => <h4 key={`card-${text}`}>{ text }</h4>) }
            </div>
            <ImageIcon icon={TechnologyIcons.StorageDistributionIcon} className="icon-box__icon" />
          </div>
          <div className="curved-box icon-box light">
            <div className="icon-box__headers">
              { copy.cards["3"].map(text => <h4 key={`card-${text}`}>{ text }</h4>) }
            </div>
            <ImageIcon icon={TechnologyIcons.OnChainOwnershipIcon} className="icon-box__icon" />
          </div>
        </div>
      </div>
      <div className="page__content-block top-separator left-image">
        <ImageIcon icon={BlockchainImage} className="page__content-block__header-image" />
        <div className="content">
          <h3 className="page__content-block__header">
            { copy.protocol.header }
          </h3>
          <RichText richText={copy.protocol.text} className="page__copy" />
        </div>
      </div>
      <div className="page__content-block">
        <LearnMore />
      </div>
      <div className="page__content-block">
        <div className="curved-box mainnet-info light">
          <h3 className="mainnet-info__header">
            <ImageIcon icon={TechnologyIcons.MainNetIcon} className="mainnet-info__header-icon" />
            { copy.mainnet.header }
          </h3>
          <RichText richText={copy.mainnet.text} className="mainnet-info__text" />
          <div className="mainnet-info__icons">
            <div className="mainnet-info__icon">
              <ImageIcon icon={TechnologyIcons.FabricBrowserIcon} className="mainnet-info__icon__icon" />
              <div className="mainnet-info__icon__text">
                { copy.mainnet.fabric_browser }
              </div>
            </div>
            <div className="mainnet-info__icon">
              <ImageIcon icon={TechnologyIcons.BlockchainExplorerIcon} className="mainnet-info__icon__icon" />
              <div className="mainnet-info__icon__text">
                { copy.mainnet.blockchain_explorer }
              </div>
            </div>
            <div className="mainnet-info__icon">
              <ImageIcon icon={TechnologyIcons.GithubRepoIcon} className="mainnet-info__icon__icon" />
              <div className="mainnet-info__icon__text">
                { copy.mainnet.github_repo }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.NodeValidatorProvidersIcon}
          header={copy.nodes.header}
          content={copy.nodes.text}
          links={[
            {
              to: "https://google.com",
              text: mainStore.l10n.actions.view_document,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.APIDevsIcon}
          header={copy.api.header}
          content={copy.api.text}
          links={[
            {
              to: "https://google.com",
              text: mainStore.l10n.actions.view_document,
              icon: DocumentIcon
            },
            {
              to: "https://google.com",
              text: mainStore.l10n.actions.view_document,
              icon: DocumentIcon
            },
            {
              to: "https://google.com",
              text: mainStore.l10n.actions.view_document,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.CurrentRoadmapIcon}
          header={copy.roadmap.header}
          content={copy.roadmap.text}
          links={[
            {
              to: "https://google.com",
              text: mainStore.l10n.actions.view_document,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.BecomeNodeOperatorIcon}
          header={copy.node_operator.header}
          content={copy.node_operator.text}
          links={[
            {
              to: "https://google.com",
              text: mainStore.l10n.actions.view_document,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          header={copy.community.header}
          content={copy.community.text}
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
});

export default ContentFabric;
