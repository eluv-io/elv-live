import React from "react";
import ImageIcon from "../../components/ImageIcon";
import {InfoBox, RichText} from "../../components/Misc";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";

import BlockchainImage from "../../static/images/technology/blockchain-graphic.png";

import {DocumentIcon, TechnologyIcons} from "../../static/icons/Icons";
import LearnMore from "./LearnMore";

import TechnologyRoadmap from "./documents/Technology-Roadmap-Full.pdf";
import {Action} from "../../components/Actions";

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
            <Action to="/" target="_blank">
              <div className="mainnet-info__icon">
                <ImageIcon icon={TechnologyIcons.FabricBrowserIcon} className="mainnet-info__icon__icon" />
                <div className="mainnet-info__icon__text">
                  { copy.mainnet.fabric_browser }
                </div>
              </div>
            </Action>
            <Action to="/" target="_blank">
              <div className="mainnet-info__icon">
                <ImageIcon icon={TechnologyIcons.BlockchainExplorerIcon} className="mainnet-info__icon__icon" />
                <div className="mainnet-info__icon__text">
                  { copy.mainnet.blockchain_explorer }
                </div>
              </div>
            </Action>
            <Action to="/" target="_blank">
              <div className="mainnet-info__icon">
                <ImageIcon icon={TechnologyIcons.GithubRepoIcon} className="mainnet-info__icon__icon" />
                <div className="mainnet-info__icon__text">
                  { copy.mainnet.github_repo }
                </div>
              </div>
            </Action>
          </div>
        </div>
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.BecomeNodeOperatorIcon}
          header={copy.tenant.header}
          content={copy.tenant.text}
          links={[
            {
              to: copy.tenant.links[0].to,
              text: copy.tenant.links[0].text,
              icon: DocumentIcon
            },
            {
              to: copy.tenant.links[1].to,
              text: copy.tenant.links[1].text,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.NodeValidatorProvidersIcon}
          header={copy.nodes.header}
          content={copy.nodes.text}
          links={[
            {
              to: copy.nodes.links[0].to,
              text: copy.nodes.links[0].text,
              icon: DocumentIcon
            },
            {
              to: copy.nodes.links[1].to,
              text: copy.nodes.links[1].text,
              icon: DocumentIcon
            },
            {
              to: copy.nodes.links[2].to,
              text: copy.nodes.links[2].text,
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
              to: copy.api.links[0].to,
              text: copy.api.links[0].text,
              icon: DocumentIcon
            },
            {
              to: copy.api.links[1].to,
              text: copy.api.links[1].text,
              icon: DocumentIcon
            },
            {
              to: copy.api.links[2].to,
              text: copy.api.links[2].text,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.APIDevsIcon}
          header={copy.mwapi.header}
          content={copy.mwapi.text}
          links={[
            {
              to: copy.mwapi.links[0].to,
              text: copy.mwapi.links[0].text,
              icon: DocumentIcon
            },
            {
              to: copy.mwapi.links[1].to,
              text: copy.mwapi.links[1].text,
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
              to: TechnologyRoadmap,
              target: "_blank",
              text: copy.roadmap.links[0].text,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
      <div className="page__content-block">
        <InfoBox
          icon={TechnologyIcons.BecomeNodeOperatorIcon}
          header={copy.community.header}
          content={copy.community.text}
          links={[
            {
              to: copy.community.links[0].to,
              text: copy.community.links[0].text,
              icon: DocumentIcon
            }
          ]}
        />
      </div>
    </div>
  );
});

export default ContentFabric;
