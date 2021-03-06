import React from "react";
import {inject, observer} from "mobx-react";
import MerchandiseItem from "Event/checkout/MerchandiseItem";

@inject("siteStore")
@inject("cartStore")
@observer
class Merch extends React.Component {
  render() {
    return (
      <div className="merch-container">
        { this.props.siteStore.Merchandise().map((item, index) =>
          <MerchandiseItem
            key={`item-${index}`}
            item={item}
            SelectItem={(item, optionIndex, quantity) => {
              this.props.cartStore.AddItem({itemType: "merchandise", baseItemIndex: item.productIndex, item, optionIndex, quantity});
              this.props.cartStore.ToggleCartOverlay(true, `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart`);
            }}
          />
        )}
      </div>
    );
  }
}

export default Merch;
