import React from "react";
import {inject, observer} from "mobx-react";
import MerchandiseItem from "Event/checkout/MerchandiseItem";

class Merch extends React.Component {
  render() {
    return (
      this.props.siteStore.Merchandise().map((item, index) =>
        <div className="merch-container" key={`item-${index}`}>
          <MerchandiseItem
            item={item}
            SelectItem={(item, optionIndex, quantity) => {
              this.props.cartStore.AddItem({
                itemType: "merchandise",
                uuid: item.uuid,
                item,
                optionIndex,
                quantity
              });

              this.props.cartStore.ToggleCartOverlay(true, `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart`);
            }}
          />
        </div>
      )
    );
  }
}

export default inject("siteStore")(inject("cartStore")(observer(Merch)));
