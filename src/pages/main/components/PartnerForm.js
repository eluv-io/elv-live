import React from "react";
import {inject, observer} from "mobx-react";
import LabelledInput from "Pages/main/components/LabelledInput";

import Countries from "Data/Countries";

@inject("mainStore")
@observer
class PartnerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      company: "",
      website: "",
      title: "",
      email: "",
      country: "United States",
      phone: "",
      notes: ""
    };

    this.LabelledInput = LabelledInput.bind(this);
  }

  render() {
    return (
      <div className="form-container partner-form-container">
        <div className="form-container__header">
          Partner with Eluv.io Live
        </div>
        <form className="form partner-form">
          { this.LabelledInput("Name", "name") }
          { this.LabelledInput("Company", "company") }
          { this.LabelledInput("Company Website", "website") }
          { this.LabelledInput("Title", "title") }
          { this.LabelledInput("Email", "email", "email") }
          { this.LabelledInput("Country", "country", "select", Countries) }
          { this.LabelledInput("Phone", "phone", "tel") }
          { this.LabelledInput("Notes", "notes", "textarea") }

          <button type="submit" className="form__submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default PartnerForm;
