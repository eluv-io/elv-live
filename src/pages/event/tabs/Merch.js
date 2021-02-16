import React, { useState } from "react";
import {inject, observer} from "mobx-react";
import {FormatPriceString} from "Utils/Misc";

const Item = ({item, SelectItem}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSKU, setSelectedSKU] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({size: 2, color: 0});

  const sizes = [
    { label: "Extra Small", name: "XS" },
    { label: "Small", name: "S" },
    { label: "Medium", name: "M" },
    { label: "Large", name: "L" },
    { label: "Extra Large", name: "XL" },
  ];

  const colors = [
    { label: "Black", color: "#000000" },
    { label: "White", color: "#FFFFFF" },
    { label: "Red", color: "#FF0000" },
    { label: "Blue", color: "#0000FF" },
  ];

  const sku = item.skus[selectedSKU];

  return (
    <div className="item">
      <div className="item-image">
        <img src={item.image_urls[selectedImage]} alt={item.name} className="selected-image" />

        <div className="image-options">
          {
            [...new Array(item.image_urls.length).keys()].map(index =>
              <button
                key={`image-option-${index}`}
                className={`image-option ${index === selectedImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={item.image_urls[index]} alt={item.name} />
              </button>
            )
          }
        </div>
      </div>
      <div className="item-details">
        <h2 className="item-header">{ item.name }</h2>
        <div className="item-price">{ FormatPriceString(sku.price, true) }</div>
        <div className="item-description">{ item.description }</div>
        <h3 className="item-option-label">
          Size: <div className="option-label">{ sizes[selectedOptions.size].label }</div>
        </h3>
        <div className="item-sizes">
          {
            sizes.map(({name, label}, index) =>
              <button
                key={`item-size-${index}`}
                title={label}
                onClick={() => setSelectedOptions({...selectedOptions, size: index})}
                className={`item-size ${index === selectedOptions.size ? "selected" : ""}`}
              >
                { name }
              </button>
            )
          }
        </div>
        <h3 className="item-option-label">
          Color: <div className="option-label">{ colors[selectedOptions.color].label }</div>
        </h3>
        <div className="item-colors">
          {
            colors.map(({label, color}, index) =>
              <button
                key={`item-color-${index}`}
                title={label}
                onClick={() => setSelectedOptions({...selectedOptions, color: index})}
                className={`item-color ${index === selectedOptions.color ? "selected" : ""}`}
              >
                <div className="item-color-swatch" style={{backgroundColor: color}} />
              </button>
            )
          }
        </div>

        <div className="select-wrapper">
          <select className="item-quantity" value={selectedQuantity} onChange={event => setSelectedQuantity(parseInt(event.target.value))}>
            {
              [...new Array(9).keys()].map(index =>
                <option key={`quantity-option-${index}`} value={index + 1}>{ index + 1 }</option>
              )
            }
          </select>
        </div>
        <button className="btn item-add" onClick={() => SelectItem(item, sku, selectedQuantity)}>
          Add to Bag
        </button>
      </div>
    </div>
  );
};

@inject("rootStore")
@inject("siteStore")
@observer
class Merch extends React.Component {
  render() {
    return (
      <div className="merch-container">
        { this.props.siteStore.Merchandise("USD").map((item, index) => <Item item={item} key={`item-${index}`} />) }
      </div>
    );
  }
}

export default Merch;
