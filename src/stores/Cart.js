import {observable, action, flow, computed, toJS} from "mobx";
import UrlJoin from "url-join";
import {loadStripe} from "@stripe/stripe-js";
import {retryRequest} from "Utils/retryRequest";
import {v4 as UUID, parse as UUIDParse} from "uuid";
import CountryCodesList from "country-codes-list";

const SERVICE_FEE_RATE = 0.1;

const PUBLIC_KEYS = {
  stripe: {
    test: "pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6",
    production: "pk_live_51HpRJ7E0yLQ1pYr6v0HIvWK21VRXiP7sLrEqGJB35wg6Z0kJDorQxl45kc4QBCwkfEAP3A6JJhAg9lHDTOY3hdRx00kYwfA3Ff"
  },
  paypal: {
    test: "AUDYCcmusO8HyBciuqBssSc3TX855stVQo-WqJUaTW9ZFM7MPIVbdxoYta5hHclUQ9fFDe1iedwwXlgy",
    production: "Af_BaCJU4_qQj-dbaSJ6UqslKSpfZgkFCJoMi4_zqEKZEXkT1JhPkCTTKYhJ0WGktzFm4c7_BBSN65S4"
  }
};

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

  @observable submittingOrder = false;

  @observable paymentServicePublicKeys = {};

  @observable purchasedTicketStartDate;

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

    if(!currency) {
      return "";
    }

    return parseFloat(item.price[currency]);
  }

  FormatPriceString(priceList, trimZeros=false) {
    const price = this.ItemPrice({price: priceList});

    if(!price || isNaN(price)) { return; }

    const currentLocale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    let formattedPrice = new Intl.NumberFormat(currentLocale || "en-US", { style: "currency", currency: this.currency }).format(price);

    if(trimZeros && formattedPrice.endsWith(".00")) {
      formattedPrice = formattedPrice.slice(0, -3);
    }

    return formattedPrice;
  };

  @action.bound
  SetCurrency(currency) {
    if(!this.currencies.find(({code}) => currency === code)) {
      return;
    }

    this.currency = currency;
  }

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
        const hasOptions = item.product_options.length > 0;

        return {
          uuid: itemDetails.uuid,
          sku_id: hasOptions ? item.product_options[itemDetails.optionIndex].uuid : itemDetails.uuid,
          item,
          option: hasOptions ? item.product_options[itemDetails.optionIndex] : -1,
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

    const zeroDecimalCurrency = ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"]
        .includes(this.currency.toUpperCase());

    const Total = arr => arr.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0);
    const subtotal = Total(cart.tickets) + Total(cart.merchandise) + Total(cart.donations);
    const taxableTotal = Total(cart.tickets) + Total(cart.merchandise);
    const serviceFee = zeroDecimalCurrency ? Math.ceil(taxableTotal * SERVICE_FEE_RATE) : taxableTotal * SERVICE_FEE_RATE;
    const total = taxableTotal + serviceFee + Total(cart.donations);

    return {
      itemCount: cart.tickets.length + cart.merchandise.length + cart.donations.length,
      tickets: Object.values(cart.tickets),
      merchandise: Object.values(cart.merchandise),
      donations: cart.donations,
      subtotal: parseFloat(subtotal.toFixed(2)),
      subtotalFormatted: this.FormatPriceString({[this.currency]: subtotal}),
      taxableTotal: parseFloat(taxableTotal.toFixed(2)),
      taxableTotalFormatted: this.FormatPriceString({[this.currency]: taxableTotal}),
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      serviceFeeFormatted: this.FormatPriceString({[this.currency]: serviceFee}),
      total: parseFloat(total.toFixed(2)),
      totalFormatted: this.FormatPriceString({[this.currency]: total})
    };
  }

  // Payment

  @action.bound
  StripeSubmit = flow(function * () {
    try {
      this.submittingOrder = true;

      this.SaveLocalStorage();

      const cartDetails = this.CartDetails();

      let itemList =
        cartDetails.tickets.map(ticket => ({sku: ticket.ticketSku.uuid, quantity: ticket.quantity}))
          .concat(cartDetails.merchandise.map(item => ({sku: item.sku_id, quantity: item.quantity})))
          .concat(cartDetails.donations.map(donation => ({sku: donation.uuid, quantity: donation.quantity})));

      this.confirmationId = this.ConfirmationId();
      const checkoutId = `${this.rootStore.siteStore.siteId}:${this.confirmationId}`;

      const baseUrl = UrlJoin(window.location.origin, this.rootStore.siteStore.baseSitePath);

      const requestParams = {
        //network: EluvioConfiguration["config-url"].includes("demov3") ? "demo" : "production",
        mode: this.rootStore.siteStore.mainSiteInfo.info.mode,
        /*
        main_site_hash: this.rootStore.siteStore.siteParams.versionHash,
        tenant_slug: this.rootStore.siteStore.tenantSlug || "featured",
        site_index: this.rootStore.siteStore.siteIndex,
        site_slug: this.rootStore.siteStore.siteSlug,

         */
        currency: this.currency,
        email: this.email,
        client_reference_id: checkoutId,
        items: itemList,
        success_url: UrlJoin(baseUrl, "success", this.email, this.confirmationId),
        cancel_url: baseUrl
      };

      try {
        // Set up session
        const stripePublicKey = yield this.PaymentServicePublicKey("stripe");
        const sessionId = (yield this.PaymentServerRequest(UrlJoin("checkout", "stripe"), requestParams)).session_id;

        // Redirect to stripe
        const stripe = yield loadStripe(stripePublicKey);
        yield stripe.redirectToCheckout({sessionId});
      } catch(error) {
        console.error(error);
        console.error(JSON.stringify(requestParams, null, 2));
      }
    } finally {
      this.submittingOrder = false;
    }
  });

  @action.bound
  PaypalSubmit = flow(function * (data, actions) {
    try {
      this.submittingOrder = true;
      this.SaveLocalStorage();

      const cartDetails = this.CartDetails();

      let paypalCart = cartDetails.tickets.map(ticket => ({
        name: `${ticket.ticketClass.name} - ${ticket.ticketSku.label}`.slice(0, 126),
        unit_amount: {
          value: ticket.price,
          currency_code: this.currency
        },
        quantity: ticket.quantity,
        sku: ticket.ticketSku.otp_id
      }));

      paypalCart = paypalCart.concat(
        cartDetails.merchandise.map(item => {
          let option;
          if(item.option && item.option !== -1) {
            option = Object.keys(item.option)
              .map(key =>
                ["uuid", "optionIndex"].includes(key) ?
                  undefined :
                  `${key}: ${item.option[key].label || item.option[key]}`)
              .filter(o => o)
              .join(", ");
          }

          return {
            name: `${item.item.name} ${option ? " | " + option : ""}`.slice(0, 126),
            unit_amount: {
              value: item.price,
              currency_code: this.currency
            },
            quantity: item.quantity,
            sku: item.uuid
          };
        })
      );

      paypalCart = paypalCart.concat(
        cartDetails.donations.map(item => ({
          name: item.item.name.slice(0, 126),
          unit_amount: {
            value: item.price,
            currency_code: this.currency
          },
          quantity: item.quantity,
          sku: item.uuid
        }))
      );

      paypalCart.push({
        name: "Service Fee",
        unit_amount: {
          value: cartDetails.serviceFee,
          currency_code: this.currency
        },
        quantity: 1
      });

      this.confirmationId = this.ConfirmationId();
      const checkoutId = `${this.rootStore.siteStore.siteId}:${this.confirmationId}`;

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
    } finally {
      this.submittingOrder = false;
    }
  });

  PaymentSubmitError(message) {
    this.checkoutError = message;
  }

  PaymentServicePublicKey = flow(function * (service) {
    if(!this.paymentServicePublicKeys[service]) {
      this.paymentServicePublicKeys[service] =
        PUBLIC_KEYS[service][this.rootStore.siteStore.mainSiteInfo.info.mode];
        //(yield this.PaymentServerRequest("public_key", { service, mode: this.rootStore.siteStore.mainSiteInfo.info.mode})).public_key;
    }

    return this.paymentServicePublicKeys[service];
  });

  async PaymentServerRequest(path, body={}) {
    return await this.rootStore.client.utils.ResponseToFormat(
      "json",
      await this.rootStore.client.authClient.MakeKMSRequest({
        method: "POST",
        path: UrlJoin("as", path),
        body
      })
    );
  }

  // LocalStorage

  @action.bound
  OrderComplete() {
    this.ToggleCheckoutOverlay(false);
    this.tickets = [];
    this.merchandise = [];
    this.featuredDonations = {};

    this.SaveLocalStorage();
  }

  @computed get localStorageKey() {
    return `${this.rootStore.siteStore.siteParams.objectId}-${this.rootStore.siteStore.siteHash}`;
  }

  SaveLocalStorage() {
    console.log("SLS");
    // Get the earliest purchased ticket date for the calendar widget
    const earliestStartDate = this.CartDetails().tickets
      .map(({ticketSku}) => ticketSku.start_time)
      .sort()[0];

    if(earliestStartDate) {
      this.purchasedTicketStartDate = earliestStartDate;
    }

    try {
      localStorage.setItem(
        this.localStorageKey,
        btoa(
          JSON.stringify({
            tickets: toJS(this.tickets),
            merchandise: toJS(this.merchandise),
            donations: toJS(this.featuredDonations),
            email: this.email,
            purchasedTicketStartDate: this.purchasedTicketStartDate
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
      const { tickets, merchandise, donations, email, purchasedTicketStartDate } = JSON.parse(atob(data));

      this.tickets = tickets || [];
      this.merchandise = merchandise || [];
      this.featuredDonations = donations || {};
      this.email = email || "";
      this.purchasedTicketStartDate = purchasedTicketStartDate;
    } catch(error) {
      console.error("Failed to load data from localstorage:");
      console.error(error);
    }
  }
}

export default CartStore;
