import React from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";

const CreatorStudio = observer(() => {
  const copy = mainStore.l10n.casablanca;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{copy.title}</h1>
        <h3>{copy.header}</h3>
      </div>
      <div className="page__content-block"></div>
    </div>
  );
});

export default CreatorStudio;

