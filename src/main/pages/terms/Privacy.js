import React from "react";
import PrivacyDocument from "../../static/documents/PrivacyPolicy.html";

const Privacy = () => {
  const documentUrl = window.URL.createObjectURL(new Blob([PrivacyDocument], {type: "text/html"}));

  return (
    <div className="page light">
      <div className="terms">
        <iframe src={documentUrl} className="terms__frame" />
      </div>
    </div>
  );
};

export default Privacy;
