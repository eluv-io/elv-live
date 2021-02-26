import {observable, action, flow, computed, toJS} from "mobx";
import URI from "urijs";
import UrlJoin from "url-join";
import {NonPrefixNTPId, ValidEmail} from "Utils/Misc";
import {loadStripe} from "@stripe/stripe-js";
import {retryRequest} from "Utils/retryRequest";

class CartStore {
  @observable currency = "GBP";

  @observable showCartOverlay = false;
  @observable showTicketOverlay = false;
  @observable showCheckoutOverlay = false;

  @observable cartOverlayMessage;
  @observable ticketOverlayOptions = {};

  @observable email = "";
  @observable confirmationId = "";

  @observable tickets = [];
  @observable merchandise = [];

  @observable donations = {};
  @observable featuredMerchandise = {};
  @observable featuredTickets = {};

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

    // When checkout is opened or closed, roll "featured" selections into the cart
    Object.values(this.featuredTickets).forEach(ticket => this.tickets.push(ticket));
    Object.values(this.featuredMerchandise).forEach(item => this.merchandise.push(item));

    this.featuredTickets = {};
    this.featuredMerchandise = {};
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

    this.lastAdded = undefined;

    this.SaveLocalStorage();
  }

  @action.bound
  AddFeaturedItem({productIndex, optionIndex, quantity}) {
    this.featuredMerchandise[productIndex] = {
      baseItemIndex: productIndex,
      optionIndex,
      quantity
    };
  }

  @action.bound
  RemoveFeaturedItem(index) {
    this.featuredMerchandise[index] = undefined;
  }

  @action.bound
  AddFeaturedTicket({productIndex, optionIndex, quantity}) {
    this.featuredTickets[productIndex] = {
      baseItemIndex: productIndex,
      optionIndex,
      quantity
    };
  }

  @action.bound
  RemoveFeaturedTicket(index) {
    this.featuredTickets[index] = undefined;
  }

  @action.bound
  AddDonation({productIndex, optionIndex, quantity}) {
    this.donations[productIndex] = {
      baseItemIndex: productIndex,
      optionIndex,
      quantity
    };
  }

  @action.bound
  RemoveDonation(index) {
    this.donations[index] = undefined;
  }

  CartDetails() {
    let cart = { tickets: {}, merchandise: {}, donations: []};

    this.tickets.forEach(ticket =>
      cart.tickets[`${ticket.baseItemIndex}-${ticket.optionIndex}`] = {
        ticketClass: this.rootStore.siteStore.ticketClasses[ticket.baseItemIndex],
        ticketSku: this.rootStore.siteStore.ticketClasses[ticket.baseItemIndex].skus[ticket.optionIndex],
        price: this.ItemPrice(this.rootStore.siteStore.ticketClasses[ticket.baseItemIndex].skus[ticket.optionIndex]),
        quantity: ticket.quantity
      }
    );

    Object.values(this.featuredTickets)
      .filter(ticket => ticket)
      .forEach(ticket => {
        const key = `${ticket.baseItemIndex}-${ticket.optionIndex}`;

        if(cart.tickets[key]) {
          cart.tickets[key].quantity += ticket.quantity;
        } else {
          cart.tickets[key] = {
            ticketClass: this.rootStore.siteStore.ticketClasses[ticket.baseItemIndex],
            ticketSku: this.rootStore.siteStore.ticketClasses[ticket.baseItemIndex].skus[ticket.optionIndex],
            price: this.ItemPrice(this.rootStore.siteStore.ticketClasses[ticket.baseItemIndex].skus[ticket.optionIndex]),
            quantity: ticket.quantity
          };
        }
      });

    this.merchandise.forEach(item =>
      cart.merchandise[`${item.baseItemIndex}-${item.optionIndex}`] = {
        item: this.rootStore.siteStore.MerchandiseItem(item.baseItemIndex),
        option: this.rootStore.siteStore.MerchandiseItem(item.baseItemIndex).product_options[item.optionIndex],
        price: this.ItemPrice(this.rootStore.siteStore.MerchandiseItem(item.baseItemIndex)),
        quantity: item.quantity
      }
    );

    Object.values(this.featuredMerchandise)
      .filter(item => item)
      .forEach(item => {
        const key = `${item.baseItemIndex}-${item.optionIndex}`;

        if(cart.merchandise[key]) {
          cart.merchandise[key].quantity += item.quantity;
        } else {
          cart.merchandise[key] = {
            item: this.rootStore.siteStore.MerchandiseItem(item.baseItemIndex),
            option: this.rootStore.siteStore.MerchandiseItem(item.baseItemIndex).product_options[item.optionIndex],
            price: this.ItemPrice(this.rootStore.siteStore.MerchandiseItem(item.baseItemIndex)),
            quantity: item.quantity
          };
        }
      });


    cart.donations = Object.values(this.donations)
      .filter(item => item)
      .map(item => ({
        item: this.rootStore.siteStore.DonationItem(item.baseItemIndex),
        price: this.ItemPrice(this.rootStore.siteStore.DonationItem(item.baseItemIndex)),
        quantity: item.quantity
      }));

    const Total = arr => arr.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0);
    const total = Total(Object.values(cart.tickets)) + Total(Object.values(cart.merchandise)) + Total(cart.donations);

    return {
      tickets: Object.values(cart.tickets),
      merchandise: Object.values(cart.merchandise),
      donations: cart.donations,
      total,
      totalFormatted: this.FormatPriceString({[this.currency]: total})
    };
  }

  // Payment

  @action.bound
  StripeSubmit = flow(function * () {
    const cartDetails = this.CartDetails();

    const stripeCart = cartDetails.tickets.map(ticket => ({
      price: ticket.ticketSku.payment_ids.stripe.price_id,
      quantity: ticket.quantity,
    }));

    const productId = ((cartDetails.tickets[0] || {}).ticketSku || {}).product_id || "placeholder";
    const otpId = NonPrefixNTPId(((cartDetails.tickets[0] || {}).ticketSku || {}).otp_id || "placeholder");

    // TODO: What if no tickets or multiple tickets
    const checkoutId = this.rootStore.siteStore.generateConfirmationId(
      NonPrefixNTPId(otpId),
      this.email
    );

    const baseUrl = UrlJoin(window.location.origin, this.rootStore.siteStore.baseSitePath);

    let stripeParams = {
      mode: "payment",
      successUrl: UrlJoin(baseUrl, "success", this.email, checkoutId),
      cancelUrl: baseUrl,
      clientReferenceId: productId,
      customerEmail: this.email,
      lineItems: stripeCart,
      shippingAddressCollection: {
        // TODO: Site should have 'allowed countries' for shipping
        allowedCountries: ["US"],
      }
    };


    /* TODO: Merchandise and donations
    if(this.state.merchChecked) {
      checkoutCart.push({
        price: this.state.checkoutMerch["stripe_sku_sizes"][merchInd][this.state.selectedSize.value],
        quantity: 1
      });
    }
    if(this.state.donationChecked) {
      checkoutCart.push({ price: this.state.donation[donateInd], quantity: 1 });
    }
    */

    try {
      const stripe = yield loadStripe(this.rootStore.siteStore.paymentConfigurations.stripe_public_key);
      yield stripe.redirectToCheckout(stripeParams);
    } catch (error) {
      try {
        const stripe = yield loadStripe(this.rootStore.siteStore.paymentConfigurations.stripe_public_key);
        yield retryRequest(stripe.redirectToCheckout, stripeParams);
      } catch(error) {
        this.checkoutError = "Sorry, this payment option is currently experiencing too many requests. Please try again in a few minutes or use Paypal to complete your purchase."
      }
    }
  });

  @action.bound
  PaypalSubmit = flow(function * (data, actions) {
    const cartDetails = this.CartDetails();

    let paypalCart = cartDetails.tickets.map(ticket => ({
      name: `${ticket.ticketClass.name} - ${ticket.ticketSku.label}`,
      unit_amount: {
        value: ticket.price,
        currency_code: this.currency
      },
      quantity: ticket.quantity,
      sku: NonPrefixNTPId(ticket.ticketSku.otp_id)
    }));

    paypalCart = paypalCart.concat(
      cartDetails.merchandise.map(item => ({
        name: item.item.name,
        unit_amount: {
          value: item.price,
          currency_code: this.currency
        },
        quantity: item.quantity,
        sku: JSON.stringify(item.option)
      }))
    );

    paypalCart = paypalCart.concat(
      cartDetails.donations.map(item => ({
        name: item.item.name,
        unit_amount: {
          value: item.price,
          currency_code: this.currency
        },
        quantity: item.quantity,
        sku: item.name
      }))
    );

    const otpId = NonPrefixNTPId(((cartDetails.tickets[0] || {}).ticketSku || {}).otp_id || "placeholder");

    this.confirmationId = this.rootStore.siteStore.generateConfirmationId(
      NonPrefixNTPId(otpId),
      this.email
    );

    return actions.order.create({
      purchase_units: [
        {
          reference_id: this.email,
          custom_id: NonPrefixNTPId(otpId),
          amount: {
            value: cartDetails.total,
            currency_code: this.currency,
            breakdown: {
              item_total: {
                value: cartDetails.total,
                currency_code: this.currency
              }
            }
          },
          items: paypalCart,
        }]
    });
  });

  PaymentSubmitError(message) {
    this.checkoutError = message;
  }

  // LocalStorage

  @action.bound
  OrderComplete() {
    this.ToggleCheckoutOverlay(false);

    this.tickets = [];
    this.merchandise = [];

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
            merchandise: toJS(this.merchandise)
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
      const { tickets, merchandise } = JSON.parse(atob(data));

      this.tickets = tickets || [];
      this.merchandise = merchandise || [];
    } catch(error) {
      console.error("Failed to load data from localstorage:");
      console.error(error);
    }
  }
}

export default CartStore;
