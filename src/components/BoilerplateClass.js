// Boilerplate for new class

import React from "react";
import {inject, observer} from "mobx-react";

class Class extends React.Component {
  render() {
    return (
      <div>

      </div>
    );
  }
}

export default inject("siteStore")(observer(Class));
