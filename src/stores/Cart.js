import {observable, action, flow, computed, toJS} from "mobx";
import UrlJoin from "url-join";
import {loadStripe} from "@stripe/stripe-js";
import {retryRequest} from "Utils/retryRequest";
import {v4 as UUID, parse as UUIDParse} from "uuid";
import CountryCodesList from "country-codes-list";

const currencyNames = CountryCodesList.customList('currencyCode', '{currencyNameEn}');

class CartStore {
  @observable currency = "USD";

  @observable showCartOverlay = false;
  @observable showTicketOverlay = false;
  @observable showCheckoutOverlay = false;

  @observable cartOverlayMessage;
  @observable ticketOverlayOptions = {};

  @observable email = "";
  @observable confirmationId = "";

  @observable tickets = [];
  @observable merchandise = [];

  @observable featuredTickets = {};
  @observable featuredMerchandise = {};
  @observable featuredDonations = {};

  @observable lastAdded;

  @computed get shippingCountries() {
    return (this.rootStore.siteStore.currentSiteInfo.shipping_countries || [])
      .map(country => country.split(":")[0]);
  }

  @computed get currencies() {
    return (this.rootStore.siteStore.currentSiteInfo.payment_currencies || [])
      .map(currency => ({ code: currency, name: currencyNames[currency] }));
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  ConfirmationId() {
    return this.rootStore.client.utils.B58(UUIDParse(UUID()));
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
    Object.values(this.featuredMerchandise).filter(item => item).forEach(item => this.merchandise.push(item));
    Object.keys(this.featuredTickets).filter(ticket => ticket).forEach(ticketClassUUID => {
      const { optionIndex, quantity } = this.featuredTickets[ticketClassUUID];
      const ticketSku = this.rootStore.siteStore.TicketClassItem(ticketClassUUID).skus[optionIndex];
      this.tickets.push({uuid: ticketSku.uuid, quantity});
    });

    this.featuredTickets = {};
    this.featuredMerchandise = {};
  }

  @action.bound
  UpdateEmail(email) {
    this.email = email;
  }

  @action.bound
  AddItem({itemType, uuid, optionIndex, quantity}) {
    const existingIndex = this[itemType].findIndex(existingItem =>
      uuid === existingItem.uuid &&
      optionIndex === existingItem.optionIndex
    );

    if(existingIndex >= 0) {
      // Current max of 9 items
      this[itemType][existingIndex].quantity = quantity;

      this.lastAdded = {
        itemType,
        uuid,
        optionIndex,
        quantity: this[itemType][existingIndex].quantity
      };
    } else {
      this[itemType].unshift({
        uuid,
        optionIndex,
        quantity
      });

      this.lastAdded = { itemType, uuid, optionIndex, quantity };
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
  AddFeaturedItem({itemType, uuid, optionIndex, quantity}) {
    this[`featured${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`][uuid] = {
      uuid,
      optionIndex,
      quantity
    } ;
  }

  @action.bound
  RemoveFeaturedItem({itemType, uuid}) {
    // Capitalize
    itemType = itemType.charAt(0).toUpperCase() + itemType.slice(1);
    delete this[`featured${itemType}`][uuid];
  }

  CartDetails() {
    let cart = { tickets: [], merchandise: [], donations: []};

    const featuredTickets = Object.keys(this.featuredTickets)
      .map(ticketClassUUID => {
        const ticketClass = this.rootStore.siteStore.TicketClassItem(ticketClassUUID);
        const options = this.featuredTickets[ticketClassUUID];

        return {
          uuid: ticketClass.skus[options.optionIndex].uuid,
          quantity: options.quantity
        }
      });

    cart.tickets = featuredTickets
      .concat(this.tickets)
      .filter(t => t)
      .map(ticket => {
        const { ticketClass, ticketSku } = this.rootStore.siteStore.TicketItem(ticket.uuid);

        return {
          uuid: ticket.uuid,
          ticketClass,
          ticketSku,
          price: this.ItemPrice(ticketSku),
          quantity: ticket.quantity
        };
      });

    cart.merchandise = Object.values(this.featuredMerchandise)
      .concat(this.merchandise)
      .filter(m => m)
      .map(itemDetails => {
        const item = this.rootStore.siteStore.MerchandiseItem(itemDetails.uuid);

        return {
          uuid: itemDetails.uuid,
          item,
          option: item.product_options[itemDetails.optionIndex],
          price: this.ItemPrice(item),
          quantity: itemDetails.quantity
        }
      });

    cart.donations = Object.values(this.featuredDonations)
      .filter(item => item)
      .map(itemDetails => {
        const donation = this.rootStore.siteStore.DonationItem(itemDetails.uuid);
        return {
          uuid: itemDetails.uuid,
          item: donation,
          price: this.ItemPrice(donation),
          quantity: itemDetails.quantity
        }
      });

    const Total = arr => arr.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0);
    const total = Total(cart.tickets) + Total(cart.merchandise) + Total(cart.donations);

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

    const production = this.rootStore.siteStore.production;

    const stripeCart = cartDetails.tickets.map(ticket => ({
      price: ticket.ticketSku.payment_ids.stripe[production ? "price_id" : "price_id_test"],
      quantity: ticket.quantity,
    }));

    this.confirmationId = this.ConfirmationId();
    const checkoutId = `${this.rootStore.siteStore.siteId}:${this.confirmationId}`;

    const baseUrl = UrlJoin(window.location.origin, this.rootStore.siteStore.baseSitePath);

    let stripeParams = {
      mode: "payment",
      successUrl: UrlJoin(baseUrl, "success", this.email, this.confirmationId),
      cancelUrl: baseUrl,
      clientReferenceId: checkoutId,
      customerEmail: this.email,
      lineItems: stripeCart,
      shippingAddressCollection: {
        allowedCountries: this.shippingCountries
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
      const stripe = yield loadStripe(this.rootStore.siteStore.paymentConfigurations[production ? "stripe_public_key" : "stripe_public_key_test"]);
      yield stripe.redirectToCheckout(stripeParams);
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(stripeParams, null, 2));
      try {
        const stripe = yield loadStripe(this.rootStore.siteStore.paymentConfigurations[production ? "stripe_public_key" : "stripe_public_key_test"]);
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
      sku: ticket.ticketSku.otp_id
    }));

    paypalCart = paypalCart.concat(
      cartDetails.merchandise.map(item => ({
        name: item.item.name,
        unit_amount: {
          value: item.price,
          currency_code: this.currency
        },
        quantity: item.quantity,
        description: JSON.stringify(item.option),
        sku: item.uuid
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
        description: item.name,
        sku: item.uuid
      }))
    );

    this.confirmationId = this.ConfirmationId();
    const checkoutId = `${this.rootStore.siteStore.siteId}:${this.confirmationId}`


    return actions.order.create({
      purchase_units: [
        {
          reference_id: this.email,
          custom_id: checkoutId,
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
