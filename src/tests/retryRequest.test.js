import {retryRequest} from '../utils/retryRequest';
import { loadStripe } from "@stripe/stripe-js";

jest.setTimeout(30000);

const TEST_STRIPE_PK = "pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6";
const PROD_STRIPE_PK = "pk_live_51HpRJ7E0yLQ1pYr6v0HIvWK21VRXiP7sLrEqGJB35wg6Z0kJDorQxl45kc4QBCwkfEAP3A6JJhAg9lHDTOY3hdRx00kYwfA3Ff";
const TEST_PRICE_ID = "price_1HpS6pE0yLQ1pYr6CuBre5I4";
const TEST_PRICE_ID = "price_1I64lcE0yLQ1pYr6rzq87qvS";

let stripe = Stripe(TEST_STRIPE_PK);

const stripeParams = {
  mode: "payment",
  lineItems:  { price: TEST_PRICE_ID, quantity: 1},
  successUrl: `https://live.eluv.io/d457a576/success/{CHECKOUT_SESSION_ID}`, 
  cancelUrl: `https://live.eluv.io/d457a576/success/{CHECKOUT_SESSION_ID}`, 
};    


let rateError = {
  message: "Testmode request rate limit exceeded, the rate limits in testmode are lower than livemode. You can learn more about rate limits here https://stripe.com/docs/rate-limits."
}

let globalRetryCount = 0;

// Mocking Request Time - 1000 MS
function mockRequestTime() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 1000);
  });
}

// Simulating RedirectToCheckout - succeeds after set successCount tries
async function mockRedirectToCheckout(successCount) {
  await mockRequestTime();
  globalRetryCount += 1;

  if (globalRetryCount == successCount) {
    return "success";
  } else {
    throw new Error(rateError.message);
  }
}

// test('Test Stripe RedirectToCheckout', async () => {
//   try {
//     await stripe.redirectToCheckout(stripeParams);
  
//   } catch (error) {
//     console.log("redirectToCheckout failed! error: ", error);
//       try {
//         console.log("Begin Retry");
//         await retryRequest(stripe.redirectToCheckout, stripeParams, 10);
//       } catch(error) {
//         console.log("retryRequest fail! error: ", error);
//       }
//     }
// });


test('SUCCESS - the retryRequest call should succeed on 3rd try', async () => {
  globalRetryCount = 0;
  let result = await retryRequest(mockRedirectToCheckout, 3, 5, 0);
  expect(result).toEqual("success");
});


test('Max Retries- the retryRequest call should throw an error when reaching max retries', async () => {
  globalRetryCount = 0;
  try {
    await retryRequest(mockRedirectToCheckout, 12, 5, 0);
  } catch (e) {
    let err = new Error("Reached Max Retries");
    expect(e).toEqual(err);
  }
});
