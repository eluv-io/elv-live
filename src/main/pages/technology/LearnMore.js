import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {InfoBox} from "../../components/Misc";

import {DocumentIcon, LinkIcon, TechnologyIcons} from "../../static/icons/Icons";

import Whitepaper from "./documents/EluvioContentFabricWhitepaper.pdf";

const LearnMore = observer(({contentFabric=false}) => {
  const contentFabricLink = [{
    to: "/content-fabric",
    target: "_blank",
    text: mainStore.l10n.actions.content_fabric_section,
    icon: LinkIcon
  }];

  const technologyLink = [{
    to: "/content-fabric/technology",
    target: "_blank",
    text: mainStore.l10n.actions.technology_section,
    icon: LinkIcon
  }];

  const whitepaperLink = [{
    to: Whitepaper,
    target: "_blank",
    text: mainStore.l10n.actions.whitepaper,
    icon: DocumentIcon
  }];

  const links = [
    ...(contentFabric ? contentFabricLink : technologyLink),
    ...whitepaperLink
  ];

  return (
    <InfoBox
      icon={TechnologyIcons.LearnMoreTechnologyIcon}
      header={contentFabric ? mainStore.l10n.content_fabric.learn_more.content_fabric_header : mainStore.l10n.content_fabric.learn_more.header}
      content={contentFabric ? mainStore.l10n.content_fabric.learn_more.content_fabric_text : mainStore.l10n.content_fabric.learn_more.text}
      links={links}
    />
  );
});

export default LearnMore;
