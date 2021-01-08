// Helper functions to retry Async Requests based on a randomized exponential backoff approach

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
export const retryRequest = async (request, params, maxRetries, retryCount = 0) => {
  // Throws Error when reaching Max Retry limit
  if ((maxRetries - retryCount) <= 0) {
    throw new Error("Reached Max Retries");
  }

  // Calculate delay (ms) for timeout based on current retry count
  let delay = calculateDelay(retryCount);

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

