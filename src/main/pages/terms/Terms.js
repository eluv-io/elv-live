import React from "react";
import TermsDocument from "../../static/documents/Terms.html";

const Privacy = () => {
  const documentUrl = window.URL.createObjectURL(new Blob([TermsDocument], {type: "text/html"}));

  return (
    <div className="page light">
      <div className="terms">
        <iframe src={documentUrl} className="terms__frame" />
      </div>
    </div>
  );
};

export default Privacy;
