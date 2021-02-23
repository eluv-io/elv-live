import {observable, action, flow, computed, toJS} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";

class CartStore {
  @observable currency = "GBP";

  @observable showCartOverlay = false;
  @observable showTicketOverlay = false;
  @observable showCheckoutOverlay = false;

  @observable cartOverlayMessage;
  @observable ticketOverlayOptions = {};

  @observable email = "";

  @observable tickets = [];
  @observable merchandise = [];
  @observable donations = [];

  @observable lastAdded;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  ItemPrice(item) {
    const currency = Object.keys(item.price || {}).find(c => c.toLowerCase() === this.currency.toLowerCase());

    if(!currency) { throw Error(`Could not find currency ${this.currency} for item`); }

    return parseFloat(item.price[currency]);
  }

  FormatPriceString(priceList, trimZeros=false) {
    const price = this.ItemPrice({price: priceList});

    const currentLocale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    let formattedPrice = new Intl.NumberFormat(currentLocale || "en-US", { style: "currency", currency: this.currency }).format(price);

    if(trimZeros && formattedPrice.endsWith(".00")) {
      formattedPrice = formattedPrice.slice(0, -3);
    }

    return formattedPrice;
  };

  @action.bound
  ToggleCartOverlay(show, message) {
    if(typeof show === "boolean") {
      this.showCartOverlay = show;
    } else if(this.lastAdded) {
      this.lastAdded = undefined;
    } else {
      this.showCartOverlay = !this.showCartOverlay;
    }

    this.cartOverlayMessage = message || "";
  }

  @action.bound
  ToggleTicketOverlay(show, options={}) {
    this.showTicketOverlay = show;
    this.ticketOverlayOptions = options;
  }

  @action.bound
  ToggleCheckoutOverlay(show) {
    this.showCheckoutOverlay = show;
  }

  @action.bound
  UpdateEmail(email) {
    this.email = email;
  }

  @action.bound
  AddItem({itemType, baseItemIndex, optionIndex, quantity}) {
    const existingIndex = this[itemType].findIndex(existingItem =>
      baseItemIndex === existingItem.baseItemIndex &&
      optionIndex === existingItem.optionIndex
    );

    if(existingIndex >= 0) {
      // Current max of 9 items
      this[itemType][existingIndex].quantity =
        Math.min(9, this[itemType][existingIndex].quantity + quantity);

      this.lastAdded = {
        baseItemIndex,
        optionIndex,
        quantity: this[itemType][existingIndex].quantity
      };
    } else {
      this[itemType].unshift({
        baseItemIndex,
        optionIndex,
        quantity
      });

      this.lastAdded = { baseItemIndex, optionIndex, quantity };
    }

    this.SaveLocalStorage();
  }

  @action.bound
  UpdateItem({itemType, index, optionIndex, quantity}) {
    if(typeof optionIndex !== "undefined") {
      this[itemType][index].optionIndex = optionIndex;
    }

    if(typeof quantity !== "undefined") {
      this[itemType][index].quantity = quantity || this[itemType][index].quantity;
    }

    this.SaveLocalStorage();
  }

  @action.bound
  RemoveItem({itemType, index}) {
    this[itemType] = this[itemType].filter((_, i) => i !== index);

    this.SaveLocalStorage();
  }

  @computed get localStorageKey() {
    return `${this.rootStore.siteStore.siteParams.objectId}-${this.rootStore.siteStore.siteHash}`;
  }

  SaveLocalStorage() {
    try {
      localStorage.setItem(
        this.localStorageKey,
        btoa(
          JSON.stringify({
            tickets: toJS(this.tickets),
            merchandise: toJS(this.merchandise),
            donations: toJS(this.donations)
          })
        )
      );
    } catch(error) {
      console.error("Failed to save data to localstorage:");
      console.error(error);
    }
  }

  LoadLocalStorage() {
    const data = localStorage.getItem(this.localStorageKey);

    if(!data) { return; }

    try {
      const { tickets, merchandise, donations } = JSON.parse(atob(data));

      this.tickets = tickets || [];
      this.merchandise = merchandise || [];
      this.donations = donations || [];
    } catch(error) {
      console.error("Failed to load data from localstorage:");
      console.error(error);
    }
  }
}

export default CartStore;
