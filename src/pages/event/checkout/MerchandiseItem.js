import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import isEqual from "lodash/isEqual";

@inject("cartStore")
@observer
class MerchandiseItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: 0,
      quantity: props.quantity || 1,
      selectedOption: props.optionIndex || 0
    };

    if(props.optionIndex) {
      console.log(this.SelectedOption());
    }
  }

  AvailableOptions(index) {
    let options = this.props.item.product_options.map((option, i) => ({...option, productIndex: i}));

    for(let i = 0; i < index; i++) {
      const fieldName = this.props.item.option_fields[i].name;
      options = options.filter(option => isEqual(option[fieldName], this.SelectedOption()[fieldName]));
    }

    return options;
  }

  SelectedOption() {
    return this.props.item.product_options[this.state.selectedOption] || {};
  }

  SelectOption(name, value, index) {
    const selectedOptions = {...this.SelectedOption(), [name]: value};

    let matchingOption = this.props.item.product_options.findIndex(productOption => isEqual(productOption, selectedOptions));

    console.log("Initial match", matchingOption);

    if(matchingOption < 0) {
      matchingOption = (this.AvailableOptions(index).find(productOption => isEqual(productOption, selectedOptions)) || {}).productIndex || 0;
    }

    console.log("after match", matchingOption);

    this.setState({selectedOption: matchingOption});
  }

  ColorOption(name, index) {
    const availableOptions = this.AvailableOptions(index)
      .map(option => option[name])
      .filter((v, i, a) => a.indexOf(v) === i);

    const selectedItemLabel = (this.SelectedOption()[name] || {}).label;

    return (
      <React.Fragment key={`item-option-${index}`}>
        <h3 className="item-option-label">
          { name }: <div className="option-label">{ selectedItemLabel }</div>
        </h3>
        <div className="item-colors">
          {
            availableOptions.map(({label, color}, i) =>
              <button
                key={`item-color-${i}`}
                title={label}
                onClick={() => this.SelectOption(name, {label, color}, index)}
                className={`item-color ${label === selectedItemLabel ? "selected" : ""}`}
              >
                <div className="item-color-swatch" style={{backgroundColor: color}} />
              </button>
            )
          }
        </div>
      </React.Fragment>
    );
  }

  Option(name, index) {
    const availableOptions = this.AvailableOptions(index)
      .map(option => option[name])
      .filter((v, i, a) => a.indexOf(v) === i);

    const selectedItem = this.SelectedOption()[name];

    return (
      <React.Fragment key={`item-option-${index}`}>
        <h3 className="item-option-label">
          { name }: <div className="option-label">{ selectedItem }</div>
        </h3>
        <div className="item-option select-wrapper">
          <select
            value={selectedItem}
            onChange={event => this.SelectOption(name, event.target.value, index)}
          >
            {
              availableOptions.map((label, i) =>
                <option value={label} key={`item-option-${i}`}>
                  { label }
                </option>
              )
            }
          </select>
        </div>
      </React.Fragment>
    );
  }

  Options() {
    return this.props.item.option_fields.map(({name, type}, index) => {
      return type === "color" ? this.ColorOption(name, index) : this.Option(name, index);
    });
  }

  Limited() {
    return (
      <div className="merchandise-item limited">
        <div className="item-image">
          <img src={this.props.item.image_urls[this.state.image]} alt={this.props.item.name} className="selected-image" />
        </div>
        <div className="item-details">
          { this.Options() }
        </div>
      </div>
    );
  }

  Full() {
    return (
      <div className="merchandise-item">
        <div className="item-image">
          <img src={this.props.item.image_urls[this.state.image]} alt={this.props.item.name} className="selected-image" />

          <div className="image-options">
            {
              [...new Array(this.props.item.image_urls.length).keys()].map(index =>
                <button
                  key={`image-option-${index}`}
                  className={`image-option ${index === this.state.image ? "selected" : ""}`}
                  onClick={() => this.setState({image: index})}
                >
                  <img src={this.props.item.image_urls[index]} alt={this.props.item.name} />
                </button>
              )
            }
          </div>
        </div>
        <div className="item-details">
          <h2 className="item-header">{ this.props.item.name }</h2>
          <div className="item-price">{ this.props.cartStore.FormatPriceString(this.props.item.price, true) }</div>
          <div className="item-description">{ this.props.item.description }</div>

          { this.Options() }

          <div className="select-wrapper">
            <select
              className="item-quantity"
              value={this.state.quantity}
              onChange={event => this.setState({quantity: parseInt(event.target.value)})}
            >
              {
                [...new Array(9).keys()].map(index =>
                  <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
                )
              }
            </select>
          </div>
          <button
            className="btn item-add"
            onClick={() => this.props.SelectItem(this.props.item, this.state.selectedOption, this.state.quantity)}
          >
            Add to Bag
          </button>
        </div>
      </div>
    );
  }

  render() {
    return this.props.limited ? this.Limited() : this.Full();
  }
}

MerchandiseItem.propTypes = {
  item: PropTypes.object.isRequired,
  quantity: PropTypes.number,
  optionIndex: PropTypes.number,
  limited: PropTypes.bool,
  SelectItem: PropTypes.func,
  UpdateItem: PropTypes.func
};

export default MerchandiseItem;
