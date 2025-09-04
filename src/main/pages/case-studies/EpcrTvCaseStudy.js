import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import AppImageGallery from "../apps/AppImageGallery";

const EpcrTvCaseStudy = observer(() => {
  const copy = mainStore.l10n.case_studies;

  return (
    <div className="page light">
      <div className="page__header-container centered case-study">
        <div className="case-study__header-container">
          <h4 className="case-study__header">{copy.title}</h4>
          <h1 className="case-study__title">{copy.items.epcr_tv.title}</h1>
          <p className="case-study__description">{copy.items.epcr_tv.description}</p>
        </div>

        <AppImageGallery
          items={[]}
        />
      </div>
    </div>
  );
});

export default EpcrTvCaseStudy;
