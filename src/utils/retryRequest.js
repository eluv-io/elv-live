/**
 * Configurable Backoff Parameters 
 * 
 * @constant {number} INITIAL_DELAY - Initial Timeout 
 * Should be set at the outer limits of expected response time for the request. 
 * For example, if the requests responds in 1ms on average but in 10ms for 99% of requests, then set t=10ms.
 * 
 * @constant {number} MAX_DELAY - Maximum Timeout 
 * Should be as low as possible to keep users happy, but high enough that the system 
 * can definitely handle requests from all clients at that sustained rate.
 * 
 * @constant {number} EXP_FACTOR - Exponential Factor
 * Doesn't matter much as it's the exponential nature that counts. Chose 2 as it's a nice round number. 
 *
 * @constant {number} MAX_RETRIES - Maximum Retry Limit
 * Need more testing to find optimal retry limit
 * 
 * @constant {string} JITTER_OPTION - Jitter Configuration 
 * Addresses thundering herd problem by adding some amount of random “jitter” to each request's exponential backoff (initial_delay * exp_factor ^ retry_count)
 * Options: 
 *    1. FullJitter: Randomized range between 0 and delay => random_between(0, exponential_backoff)
 *    2. EqualJitter: Randomized range between (delay * .5) and (delay * 1.5) => exponential_backoff/2 + random_between(0, exponential_backoff)
 */

const INITIAL_DELAY = 100; 
const MAX_DELAY = 2500; 
const EXP_FACTOR = 2; 
const MAX_RETRIES = 15; 
const JITTER_OPTION = "FullJitter"; 

/**
 * Returns delay (in ms) after applying randomization 
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
      return (delay / 2) + Math.floor(Math.random() * delay);
    default:
      // No Jitter
      return delay; 
  }
};

/**
 * Calculates delay (in ms) based on a randomized exponential backoff algorithm
 * 
 * delay = MIN(apply_jitter(initial_delay * exponential_factor ^ retry_count), maximum_delay) 
 *
 * @param {number} retryCount The number of retries so far
 * @param {number} initialDelay Initial timeout, and should be set at the outer limits of expected response time for the service.
 * @param {number} maxDelay Maximum timeout, should be as low as possible to keep customers happy
 * @param {number} expFactor Exponential Factor
 * @return {number} Total delay (ms) between requests
 */
const calculateDelay = (retryCount, initialDelay=INITIAL_DELAY, maxDelay=MAX_DELAY, expFactor=EXP_FACTOR) => {
  // Calculate exponential backoff as initial delay * (exponential factor ^ retries) milliseconds.
  let exponential_backoff = initialDelay * (expFactor ** retryCount);

  // Don't allow the delay to exceed maxDelay ms.
  let delay = Math.min(exponential_backoff, maxDelay);

  // Apply some randomization (defaults to use FullJitter)   
  delay = applyJitter(delay);

  return delay;
};

/**
 * Retries asynchronous requests with exponential backoff and random jitter 
 *
 * @param {number} request The number of retries so far
 * @param {number} params Initial timeout
 * @param {number} maxRetries Maximum Retry Limit
 * @param {number} retryCount The number of retries so far 
 * @return {Object} Returns Response Object from request if request goes through
 * @return {Error} Returns Error if max retry limit is reached before a successful request
 */
export const retryRequest = async (request, params, maxRetries=MAX_RETRIES, retryCount = 0) => {
  // Throws Error when Max Retry limit is reached
  if ((maxRetries - retryCount) <= 0) {
    console.log("Reached Max Retries");
    throw new Error("Reached Max Retries");
  }

  // Calculate delay (ms) for timeout based on current retry count
  let delay = calculateDelay(retryCount);
  // Time out based on calculated delay 
  console.log("Retry Request Count #", retryCount, " -- Calculated Delay: ", delay, " ms");
  await new Promise(resolve => setTimeout(resolve, delay));

  let response;
  try {
    // Retrying Request and return result if successful
    response = await request(params);
    console.log("SUCCESS: Retry Request #", retryCount);

    return response;
  } catch (error) {
    // If request errors, iterate retryCount by 1 before retrying the request
    console.log("FAIL: Retry Request #", retryCount);
    return retryRequest(request, params, maxRetries, retryCount + 1);
  }
};

