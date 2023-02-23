import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {InfoBox} from "../../components/Misc";

import {DocumentIcon, LinkIcon, TechnologyIcons} from "../../static/icons/Icons";

const LearnMore = observer(() => {
  return (
    <InfoBox
      icon={TechnologyIcons.LearnMoreTechnologyIcon}
      header={mainStore.l10n.content_fabric.learn_more.header}
      content={mainStore.l10n.content_fabric.learn_more.text}
      links={[
        {
          to: "/content-fabric/technology",
          text: mainStore.l10n.actions.technology_section,
          icon: LinkIcon
        },
        {
          to: "https://google.com",
          text: mainStore.l10n.actions.whitepaper,
          icon: DocumentIcon
        }
      ]}
    />
  );
});

export default LearnMore;
