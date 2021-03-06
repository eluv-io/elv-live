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
      selectedOption: props.optionIndex || 0,
      checked: props.checked || props.view === "cart" || false
    };

    this.Update = this.Update.bind(this);
  }

  View() {
    if(this.props.view === "cart" && window.innerWidth < 900) {
      return "mobile-cart";
    }

    return this.props.view;
  }

  Update() {
    // Other views either don't allow changing option or have an explicit "add" button
    if(!["mobile-cart", "featured", "donation"].includes(this.View())) { return; }

    if(this.state.checked) {
      if(this.props.UpdateItem) {
        this.props.UpdateItem(this.props.item, this.state.selectedOption, this.state.quantity);
      }
    } else {
      if(this.props.RemoveItem) {
        this.props.RemoveItem();
      }
    }
  }

  SelectedOption() {
    return this.props.item.product_options[this.state.selectedOption] || {};
  }

  // Determine available product options
  // If index is specified, will return all options that match the first n selected options (options cascade downward)
  // If requiredOption is specified, will return all options that match the selected field
  AvailableOptions(index, requiredOption) {
    let options = [...this.props.item.product_options];

    if(requiredOption) {
      options = options.filter(option => option[requiredOption.name] === requiredOption.value);
    } else {
      for(let i = 0; i < index; i++) {
        const fieldName = this.props.item.option_fields[i].name;
        options = options.filter(option => isEqual(option[fieldName], this.SelectedOption()[fieldName]));
      }
    }

    return options;
  }

  // Check for option equality, ignoring option index field
  MatchOption(first, second) {
    return isEqual({...first, optionIndex: null}, {...second, optionIndex: null});
  }

  SelectOption(name, value, index) {
    const selectedOptions = {...this.SelectedOption(), [name]: value};

    // Look for exact match for existing options plus new selection
    let matchingOption = this.props.item.product_options.findIndex(productOption => this.MatchOption(productOption, selectedOptions));

    if(matchingOption < 0) {
      // No exact match, choose first available option that matches the selected option field
      matchingOption = (this.AvailableOptions(index, {name, value})[0] || {}).optionIndex || 0;
    }

    this.setState({selectedOption: matchingOption}, this.Update);
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

  Option(option, index, simple=false) {
    const availableOptions = this.AvailableOptions(index)
      .map(o => o[option.name])
      .filter((v, i, a) => a.indexOf(v) === i);

    let selectedItem = this.SelectedOption()[option.name];

    return (
      <React.Fragment key={`item-option-${index}`}>
        {
          simple ? null :
            <h3 className="item-option-label">
              {option.name}: <div className="option-label">{selectedItem}</div>
            </h3>
        }
        <div className="item-option select-wrapper">
          <select
            value={option.type === "color" ? JSON.stringify(selectedItem) : selectedItem}
            onChange={event => {
              const value = option.type === "color" ? JSON.parse(event.target.value) : event.target.value;

              this.SelectOption(option.name, value, index);
            }}
          >
            {
              availableOptions.map((value, i) =>
                <option value={option.type === "color" ? JSON.stringify(value) : value} key={`item-option-${i}`}>
                  { option.type === "color" ? value.label : value }
                </option>
              )
            }
          </select>
        </div>
      </React.Fragment>
    );
  }

  Options(simple=false) {
    if(simple) {
      return this.props.item.option_fields.map((option, index) => this.Option(option, index, true));
    }

    return this.props.item.option_fields.map((option, index) => {
      return option.type === "color" ? this.ColorOption(option.name, index) : this.Option(option, index);
    });
  }

  Quantity() {
    return (
      <div className="select-wrapper">
        <select
          className="item-quantity"
          value={this.state.quantity}
          onChange={event => this.setState({quantity: parseInt(event.target.value)}, this.Update)}
        >
          {
            [...new Array(9).keys()].map(index =>
              <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
            )
          }
        </select>
      </div>
    );
  }

  /* Views */

  CartView() {
    return (
      <div className="merchandise-item cart-view">
        <div className="item-image">
          <img src={this.props.item.image_urls[this.state.image]} alt={this.props.item.name} className="selected-image" />
        </div>
        <div className="item-details">
          { this.Options() }
        </div>
      </div>
    );
  }

  DonationView() {
    return (
      <div className="merchandise-item featured-view donation-view">
        <h2 className="item-header">
          <input
            type="checkbox"
            checked={this.state.checked}
            className="featured-item-selection"
            onChange={event => this.setState({checked: event.target.checked}, this.Update)}
          />
          { this.props.item.name }
          <div className="item-header-price">
            { this.props.cartStore.FormatPriceString(this.props.item.price, true) }
          </div>
        </h2>
        <div className="item-container">
          <div className="item-image">
            <img src={this.props.item.image_urls[this.state.image]} alt={this.props.item.name} className="selected-image" />
          </div>

          <div className="item-details">
            <div className="item-description">{ this.props.item.description }</div>
          </div>
        </div>
      </div>
    );
  }

  FeaturedView() {
    const mobileCartView = this.View() === "mobile-cart";

    return (
      <div className={`merchandise-item featured-view ${mobileCartView ? "mobile-cart-view" : ""}`}>
        <h2 className="item-header">
          <input
            hidden={mobileCartView}
            type="checkbox"
            checked={this.state.checked}
            className="featured-item-selection"
            onChange={event => this.setState({checked: event.target.checked}, this.Update)}
          />
          { this.props.item.name }
          <div className="item-header-price">
            { this.props.cartStore.FormatPriceString(this.props.item.price, true) }
          </div>
        </h2>
        <div className="item-container">
          <div className="item-image">
            <img src={this.props.item.image_urls[this.state.image]} alt={this.props.item.name} className="selected-image" />
          </div>

          <div className="item-details">
            <div className="item-options-container">
              <div className="item-options">
                { this.Options(true) }
              </div>
              { this.Quantity() }
            </div>

            <div className="item-description">{ this.props.item.description }</div>

            <button
              hidden={!mobileCartView}
              className="remove-item"
              onClick={this.props.RemoveItem}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  FullView() {
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
          { this.Quantity() }

          <button
            className="btn item-add"
            onClick={() => this.props.SelectItem(this.props.item, this.state.selectedOption, this.state.quantity)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  render() {
    switch(this.View()) {
      case "cart":
        return this.CartView();
      case "mobile-cart":
      case "featured":
        return this.FeaturedView();
      case "donation":
        return this.DonationView();
      default:
        return this.FullView();
    }
  }
}

MerchandiseItem.propTypes = {
  item: PropTypes.object.isRequired,
  quantity: PropTypes.number,
  optionIndex: PropTypes.number,
  checked: PropTypes.bool,
  view: PropTypes.string,
  SelectItem: PropTypes.func,
  UpdateItem: PropTypes.func,
  RemoveItem: PropTypes.func
};

export default MerchandiseItem;
