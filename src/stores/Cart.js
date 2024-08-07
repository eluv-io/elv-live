import {flow, toJS, makeAutoObservable} from "mobx";
import UrlJoin from "url-join";
import {retryRequest} from "Utils/retryRequest";
import {v4 as UUID, parse as UUIDParse} from "uuid";
import CountryCodesList from "country-codes-list";

// 10% service fee
const SERVICE_FEE_RATE = 5;

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

const currencyNames = CountryCodesList.customList("currencyCode", "{currencyNameEn}");

class CartStore {
  currency = "USD";

  showCartOverlay = false;
  showTicketOverlay = false;
  showCheckoutOverlay = false;

  cartOverlayMessage;
  ticketOverlayOptions = {};

  email = "";
  confirmationId = "";

  tickets = [];
  merchandise = [];

  featuredTickets = {};
  featuredMerchandise = {};
  featuredDonations = {};

  submittingOrder = false;

  paymentServicePublicKeys = {};

  purchasedTicketStartDate;
  purchasedTicketEndDate;

  lastAdded;

  get shippingCountries() {
    return (this.rootStore.siteStore.currentSiteInfo.shipping_countries || [])
      .map(country => country.split(":")[0]);
  }

  get currencies() {
    return (this.rootStore.siteStore.currentSiteInfo.payment_currencies || [])
      .map(currency => ({ code: currency, name: currencyNames[currency] }));
  }

  constructor(rootStore) {
    makeAutoObservable(this);

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
    trimZeros=false;
    const price = this.ItemPrice({price: priceList});

    if(!price || isNaN(price)) { return; }

    const currentLocale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    let formattedPrice = new Intl.NumberFormat(currentLocale || "en-US", { style: "currency", currency: this.currency }).format(price);

    if(trimZeros && formattedPrice.endsWith(".00")) {
      formattedPrice = formattedPrice.slice(0, -3);
    }

    return formattedPrice;
  }

  InitializeCurrency() {
    if(localStorage.getItem(this.localStorageKey) || !this.currencies || this.currencies.length === 0) { return; }

    this.SetCurrency(this.currencies[0].code);
  }

  SetCurrency(currency) {
    if(!this.currencies.find(({code}) => currency === code)) {
      return;
    }

    this.currency = currency;

    this.SaveLocalStorage();
  }

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

  ToggleTicketOverlay(show, options={}) {
    this.showTicketOverlay = show;
    this.ticketOverlayOptions = options;
  }

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

  UpdateEmail(email) {
    this.email = email;
  }

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

  UpdateItem({itemType, index, optionIndex, quantity}) {
    if(typeof optionIndex !== "undefined") {
      this[itemType][index].optionIndex = optionIndex;
    }

    if(typeof quantity !== "undefined") {
      this[itemType][index].quantity = quantity || this[itemType][index].quantity;
    }

    this.SaveLocalStorage();
  }

  RemoveItem({itemType, index}) {
    this[itemType] = this[itemType].filter((_, i) => i !== index);

    this.lastAdded = undefined;

    this.SaveLocalStorage();
  }

  AddFeaturedItem({itemType, uuid, optionIndex, quantity}) {
    this[`featured${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`][uuid] = {
      uuid,
      optionIndex,
      quantity
    } ;
  }

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
        };
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
        };
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
        };
      });

    const zeroDecimalCurrency = ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"]
      .includes(this.currency.toUpperCase());

    const serviceFeeRate = (SERVICE_FEE_RATE + Math.max(0, this.rootStore.siteStore.currentSiteInfo.additional_service_charge || 0)) / 100;

    const Total = arr => arr.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0);
    const subtotal = Total(cart.tickets) + Total(cart.merchandise) + Total(cart.donations);
    const taxableTotal = Total(cart.tickets) + Total(cart.merchandise);
    const serviceFee = zeroDecimalCurrency ? Math.ceil(taxableTotal * serviceFeeRate) : taxableTotal * serviceFeeRate;
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

  PaymentServerRequestParams() {
    const cartDetails = this.CartDetails();

    let itemList =
      cartDetails.tickets.map(ticket => ({sku: ticket.ticketSku.uuid, quantity: ticket.quantity}))
        .concat(cartDetails.merchandise.map(item => ({sku: item.sku_id, quantity: item.quantity})))
        .concat(cartDetails.donations.map(donation => ({sku: donation.uuid, quantity: donation.quantity})));

    this.confirmationId = this.ConfirmationId();
    const checkoutId = `${this.rootStore.siteStore.siteId}:${this.confirmationId}`;

    const baseUrl = UrlJoin(window.location.origin, this.rootStore.siteStore.baseSitePath);

    const mode = this.rootStore.siteStore.mainSiteInfo.info.mode === "test" ? "develop" : "production";
    return {
      mode,
      currency: this.currency,
      email: this.email,
      client_reference_id: checkoutId,
      items: itemList,
      success_url: UrlJoin(baseUrl, "success", this.confirmationId),
      cancel_url: baseUrl
    };
  }

  StripeSubmit = flow(function * () {
    try {
      this.submittingOrder = true;
      this.checkoutError = undefined;

      this.SaveLocalStorage();

      const requestParams = this.PaymentServerRequestParams();

      // Set up session
      const stripePublicKey = this.PaymentServicePublicKey("stripe");
      const sessionId = (yield this.PaymentServerRequest({
        path: UrlJoin("checkout", "stripe"),
        requestParams
      })).session_id;

      // Redirect to stripe
      const {loadStripe} = yield import("@stripe/stripe-js/pure");
      loadStripe.setLoadParameters({advancedFraudSignals: false});
      const stripe = yield loadStripe(stripePublicKey);
      yield stripe.redirectToCheckout({sessionId});
    } catch(error) {
      this.PaymentSubmitError(error);
      this.submittingOrder = false;
    }
  });

  CoinbaseSubmit = flow(function * () {
    try {
      this.submittingOrder = true;
      this.checkoutError = undefined;

      this.SaveLocalStorage();

      const requestParams = this.PaymentServerRequestParams();
      const chargeCode = (yield this.PaymentServerRequest({
        path: UrlJoin("checkout", "coinbase"),
        requestParams
      })).charge_code;

      window.location.href = UrlJoin("https://commerce.coinbase.com/charges", chargeCode);
    } catch(error) {
      this.PaymentSubmitError(error);

      this.submittingOrder = false;
    }
  });

  // eslint-disable-next-line require-yield
  PaypalSubmit = flow(function * (data, actions) {
    try {
      this.submittingOrder = true;
      this.checkoutError = undefined;
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

      return retryRequest(
        actions.order.create,
        {
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
            }],
          application_context: cartDetails.merchandise.length === 0 ? { shipping_preference: "NO_SHIPPING" } : {}
        }
      );
    } finally {
      this.submittingOrder = false;
    }
  });

  PaymentSubmitError(error) {
    // eslint-disable-next-line no-console
    console.error(error);

    this.checkoutError = "There was an error with checkout. Please try again.";
  }

  PaymentServicePublicKey(service) {
    return PUBLIC_KEYS[service][this.rootStore.siteStore.mainSiteInfo.info.mode];
  }

  async PaymentServerRequest({path, requestParams={}}) {
    return retryRequest(
      async () => await this.rootStore.client.utils.ResponseToFormat(
        "json",
        await this.rootStore.client.authClient.MakeKMSRequest({
          method: "POST",
          path: UrlJoin("as", path),
          body: requestParams
        })
      )
    );
  }

  // LocalStorage

  OrderComplete(confirmationId) {
    this.rootStore.siteStore.TrackPurchase(confirmationId, this.CartDetails());

    this.ToggleCheckoutOverlay(false);
    this.tickets = [];
    this.merchandise = [];
    this.featuredDonations = {};

    this.SaveLocalStorage();
  }

  get localStorageKey() {
    return `${this.rootStore.siteStore.siteParams.objectId}-${this.rootStore.siteStore.siteHash}`;
  }

  SaveLocalStorage() {
    // Get the earliest purchased ticket date for the calendar widget
    const earliestTicket = this.CartDetails().tickets
      .map(({ticketSku}) => ticketSku)
      .sort((a, b) => a.startTime < b.startTime ? -1 : 1)[0];

    if(earliestTicket) {
      this.purchasedTicketStartDate = earliestTicket.start_time;
      this.purchasedTicketEndDate = earliestTicket.end_time;
    }

    try {
      localStorage.setItem(
        this.localStorageKey,
        btoa(
          JSON.stringify({
            currency: this.currency,
            tickets: toJS(this.tickets),
            merchandise: toJS(this.merchandise),
            donations: toJS(this.featuredDonations),
            email: this.email,
            purchasedTicketStartDate: this.purchasedTicketStartDate,
            purchasedTicketEndDate: this.purchasedTicketEndDate
          })
        )
      );
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save data to localstorage:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  LoadLocalStorage() {
    const data = localStorage.getItem(this.localStorageKey);

    if(!data) { return; }

    try {
      const { currency, tickets, merchandise, donations, email, purchasedTicketStartDate, purchasedTicketEndDate } = JSON.parse(atob(data));

      this.currency = currency || this.currency;
      this.tickets = tickets || [];
      this.merchandise = merchandise || [];
      this.featuredDonations = donations || {};
      this.email = email || "";
      this.purchasedTicketStartDate = purchasedTicketStartDate;
      this.purchasedTicketEndDate = purchasedTicketEndDate;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load data from localstorage:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

export default CartStore;
