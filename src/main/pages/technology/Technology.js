import React from "react";
import {ExpandableImage, RichText, TabbedInfoBox} from "../../components/Misc";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import LearnMore from "./LearnMore";

import ArchitectureDiagram from "../../static/images/technology/architecture.jpg";
import HowItWorksDiagram from "../../static/images/technology/how-it-works.jpg";
import MonetizationDiagram from "../../static/images/technology/on-chain-monetization.jpg";
import CrossChainAuthorizationDiagram from "../../static/images/technology/Cross-Chain.jpg";
import OnChainPaymentsDiagram from "../../static/images/technology/On-Chain-Payments.jpg";

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
        <LearnMore contentFabric={true} />
      </div>

      <div className="page__content-block">
        <TabbedInfoBox
          className="tabbed-info-box--small-tabs"
          tabs={[
            {
              title: copy.architecture,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={ArchitectureDiagram} />
                </div>
              )
            },
            {
              title: copy.how_it_works,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={HowItWorksDiagram} />
                </div>
              )
            },
            {
              title: copy.monetization,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={MonetizationDiagram} />
                </div>
              )
            },
            {
              title: copy.cross_chain_authorization,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={CrossChainAuthorizationDiagram} />
                </div>
              )
            },
            {
              title: copy.on_chain_payments,
              content: (
                <div className="tabbed-info-box__content--shadow">
                  <ExpandableImage expandable image={OnChainPaymentsDiagram} />
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
