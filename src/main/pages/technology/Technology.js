import React from "react";
import {ExpandableImage, RichText, TabbedInfoBox} from "../../components/Misc";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import LearnMore from "./LearnMore";

import ArchitectureDiagram from "../../static/images/technology/architecture.jpg";
import HowItWorksDiagram from "../../static/images/technology/how-it-works.jpg";
import MonetizationDiagram from "../../static/images/technology/on-chain-monetization.jpg";

import {TechnologyIcons} from "../../static/icons/Icons";


const Technology = observer(() => {
  const copy = mainStore.l10n.technology;

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
        <RichText richText={copy.text} className="page__copy multi-column" />
      </div>

      <div className="page__content-block">
        <LearnMore />
      </div>

      <div className="page__content-block">
        <TabbedInfoBox
          tabs={[
            {
              title: copy.architecture,
              icon: TechnologyIcons.ArchitectureIcon,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={ArchitectureDiagram} imageClassName="component-test__image" />
                </div>
              )
            },
            {
              title: copy.how_it_works,
              icon: TechnologyIcons.HowItWorksIcon,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={HowItWorksDiagram} imageClassName="component-test__image" />
                </div>
              )
            },
            {
              title: copy.monetization,
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
});

export default Technology;
