import React from "react";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class Contact extends React.Component {
  render() {
    return (
      <div className="page-content__contact">
        Contact
      </div>
    );
  }
}

export default Contact;
