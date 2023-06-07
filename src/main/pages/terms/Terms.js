import React from "react";
import TermsDocument from "../../static/documents/Terms.html";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";

const Privacy = observer(() => {
  const documentUrl = window.URL.createObjectURL(new Blob([TermsDocument], {type: "text/html"}));

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{ mainStore.l10n.documents.terms.header }</h1>
      </div>
      <div className="terms">
        <iframe src={documentUrl} className="terms__frame" />
      </div>
    </div>
  );
});

export default Privacy;
