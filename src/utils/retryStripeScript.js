// Need to figure out how to get the Stripe JS SDK
// Include something like this: <script src="https://js.stripe.com/v3" async></script>



// Retry Implementation
const INITIAL_DELAY = 100; // Initial delay of 100 milliseconds
const MAX_DELAY = 2000; // Maximum delay of 2000 milliseconds
const EXP_FACTOR = 2; // Exponential factor of 2
const JITTER_OPTION = "FullJitter"; // Randomized Jitter Option

/**
 * Returns delay (in ms) after applying randomization option
 *
 * @param {number} delay Calculated exponential backoff delay based on retry count
 * @param {number} option Randomized Jitter Option - default: "FullJitter"
 * @return {number} Delay (ms) after applying randomization
 */
const applyJitter = (delay, option=JITTER_OPTION) => {
  switch(option) {
    case "FullJitter":
      // Randomized range between 0 and delay.
      return Math.floor(Math.random() * delay);
    case "EqualJitter":
      // Randomized range between (delay * .5) and (delay * 1.5)
      return Math.floor(Math.random() * delay) + (delay / 2);
    default:
      // No Jitter
      return delay; 
  }
};

/**
 * Calculates delay (in ms) 
 *
 * TODO
 */
const calculateDelay = (retryCount, initialDelay=INITIAL_DELAY, maxDelay=MAX_DELAY, expFactor=EXP_FACTOR) => {
  // Calculate exponential backoff as initial delay * (exponential factor ^ retries) milliseconds.
  let exponential_backoff = initialDelay * (expFactor ** retryCount);

  // Apply some randomization (defaults to use FullJitter)   
  let randomization_backoff = applyJitter(exponential_backoff);

  // Don't allow the delay to exceed maxDelay ms.
  let delay = Math.min(randomization_backoff, maxDelay);

  return delay;
};

/**
 * Retries request  
 *
 * TODO
 */
const retryRequest = async (request, params, maxRetries, retryCount = 0) => {
  // Throws Error when reaching Max Retry limit
  if ((maxRetries - retryCount) <= 0) {
    throw new Error("Reached Max Retries");
  }

  // Calculate delay (ms) for timeout based on current retry count
  let delay = calculateDelay(retryCount);
  console.log("Request #:", retryCount, "Delay in ms:", delay);

  // Time out based on calculated delay 
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    // Retrying Request and return result if successful
    return await request(params);

  } catch (error) {
    // If request errors, iterate retryCount by 1 before retrying the request
    return retryRequest(request, params, maxRetries, retryCount + 1);
  }
};



// Start of Script Code


const TEST_STRIPE_PK = "pk_test_51HpRJ7E0yLQ1pYr6m8Di1EfiigEZUSIt3ruOmtXukoEe0goAs7ZMfNoYQO3ormdETjY6FqlkziErPYWVWGnKL5e800UYf7aGp6";
const PROD_STRIPE_PK = "pk_live_51HpRJ7E0yLQ1pYr6v0HIvWK21VRXiP7sLrEqGJB35wg6Z0kJDorQxl45kc4QBCwkfEAP3A6JJhAg9lHDTOY3hdRx00kYwfA3Ff";
const TEST_PRICE_ID = "price_1HpS6pE0yLQ1pYr6CuBre5I4";
const TEST_PRICE_ID = "price_1I64lcE0yLQ1pYr6rzq87qvS";

let stripe = Stripe(TEST_STRIPE_PK);


let stripeParams = {
  mode: "payment",
  lineItems:  { price: TEST_PRICE_ID, quantity: 1},
  successUrl: `https://live.eluv.io/d457a576/success/{CHECKOUT_SESSION_ID}`, 
  cancelUrl: `https://live.eluv.io/d457a576/success/{CHECKOUT_SESSION_ID}`, 
};    

async function runScript() {

  try {
    await stripe.redirectToCheckout(stripeParams);
  
  } catch (error) {
    console.log("redirectToCheckout failed! error: ", error);
      try {
        console.log("Begin Retry");
        await retryRequest(stripe.redirectToCheckout, stripeParams, 15);
      } catch(error) {
        console.log("retryRequest fail! error: ", error);
      }
    }
};

console.log("START SCRIPT");

runScript();

console.log("END SCRIPT");
