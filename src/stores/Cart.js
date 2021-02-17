import {observable, action, flow, computed} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class CartStore {
  @observable showCartOverlay = false;
  @observable cartOverlayMessage;

  @observable tickets = [];
  @observable merchandise = [];
  @observable donations = [];

  @observable lastAdded;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  ToggleCartOverlay(show, message) {
    this.showCartOverlay = typeof show === "boolean" ? show : !this.showCartOverlay;
    this.cartOverlayMessage = message;

    if(!this.showCartOverlay) {
      this.lastAdded = undefined;
    }
  }

  @action.bound
  AddMerchandise(item, options, quantity) {
    const existingIndex = this.merchandise.findIndex(existingItem =>
      item.name === existingItem.item.name &&
      JSON.stringify(options) === JSON.stringify(existingItem.options)
    );

    if(existingIndex >= 0) {
      this.merchandise[existingIndex].quantity += quantity;

      this.lastAdded = {
        item,
        options,
        quantity: this.merchandise[existingIndex].quantity
      };
    } else {
      this.merchandise.unshift({
        item,
        options,
        quantity
      });

      this.lastAdded = { item, options, quantity };
    }
  }

  @action.bound
  RemoveMerchandise(index) {
    this.merchandise = this.merchandise.filter((_, i) => i !== index);
  }
}

export default CartStore;
