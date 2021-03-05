import React from "react";
import {inject, observer} from "mobx-react";

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
  }

  LabelledInput(label, name, type="input") {
    return (
      <div className="form__labelled-field">
        <label className="form__label">
          { label }
        </label>
        {
          type === "textarea" ?
            <input
              className={`form__input form__textarea form__input-${name}`}
              name={name}
              value={this.state[name]}
              onChange={event => this.setState({[event.target.name]: event.target.value})}
            /> :
            <input
              required
              type={type}
              className={`form__input form__input-${name}`}
              name={name}
              value={this.state[name]}
              onChange={event => this.setState({[event.target.name]: event.target.value})}
            />
        }
      </div>
    );
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


          <div className="form__labelled-field">
            <label className="form__label">
              Country
            </label>
            <div className="form__select-wrapper">
              <select
                className="form__input form__select"
                value={this.state.country}
                onChange={event => this.setState({country: event.target.value})}
              >
                { Countries.map((country, index) =>
                  <option value={country} key={`form-country-${index}`}>{ country }</option>
                )}
              </select>
            </div>
          </div>

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
