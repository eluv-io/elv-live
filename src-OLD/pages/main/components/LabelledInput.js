import React from "react";

const LabelledInput = function(label, name, type="input", options) {
  let input;

  switch(type) {
    case "select":
      input = (
        <select
          name={name}
          className="form__input form__select"
          value={this.state[name]}
          onChange={event => this.setState({[event.target.name]: event.target.value})}
        >
          { options.map((value, index) =>
            <option value={value} key={`form-country-${index}`}>{ value }</option>
          )}
        </select>
      );
      break;
    case "textarea":
      input = (
        <textarea
          className={`form__input form__textarea form__input-${name}`}
          name={name}
          value={this.state[name]}
          onChange={event => this.setState({[event.target.name]: event.target.value})}
        />
      );
      break;
    default:
      input = (
        <input
          required
          type={type}
          className={`form__input form__input-${name}`}
          name={name}
          value={this.state[name]}
          onChange={event => this.setState({[event.target.name]: event.target.value})}
        />
      );
  }

  return (
    <div className="form__labelled-field">
      <label className="form__label">
        { label }
      </label>
      { input }
    </div>
  );
};

export default LabelledInput;
