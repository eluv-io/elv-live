import React from "react";
import {inject, observer} from "mobx-react";
import LabelledInput from "Pages/main/components/LabelledInput";

import Countries from "Data/Countries";

@inject("mainStore")
@observer
class ContactForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      organization: "",
      title: "",
      email: "",
      country: "United States",
      phone: "",
      topic: "Purchase Event Tickets",
      notes: ""
    };

    this.LabelledInput = LabelledInput.bind(this);
  }

  componentDidMount() {
    window.scroll({top: 0, left: 0, behavior: 'smooth'
    });
  }

  render() {
    return (
      <div className="form-container contact-form-container">
        <div className="form-container__header">
          Go Live with Eluv.io
        </div>
        <form className="form contact-form">
          { this.LabelledInput("Name", "name") }
          { this.LabelledInput("Organization", "organization") }
          { this.LabelledInput("Title", "title") }
          { this.LabelledInput("Email", "email", "email") }
          { this.LabelledInput("Country", "country", "select", Countries) }
          { this.LabelledInput("Phone", "phone", "tel") }

          {
            this.LabelledInput(
              "Topic",
              "topic",
              "select",
              [
                "Purchase Event Tickets",
                "Create an Event",
                "Agency",
                "Work with Eluvio Live",
                "Support"
              ]
            )
          }

          { this.LabelledInput("Notes", "notes", "textarea") }

          <button type="submit" className="form__submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default ContactForm;
