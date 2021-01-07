const INITIAL_DELAY = 100; // Initial delay of 100 milliseconds
const MAX_DELAY = 1000; // Maximum delay of 1000 milliseconds
const EXP_FACTOR = 2; // Exponential factor of 2
const JITTER_OPTION = "FullJitter"; // Randomized Jitter Option

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

export const calculateDelay = (retryCount, initialDelay=INITIAL_DELAY, maxDelay=MAX_DELAY, expFactor=EXP_FACTOR) => {
  // Calculate exponential backoff as initial delay * (exponential factor ^ retries) milliseconds.
  let exponential_backoff = initialDelay * (expFactor ** retryCount);

  // Apply some randomization (defaults to use FullJitter)   
  let randomization_backoff = applyJitter(exponential_backoff);

  // Don't allow the delay to exceed maxDelay ms.
  let delay = Math.min(randomization_backoff, maxDelay);

  return delay;
};

export const retryRequest = async (request, params, maxRetries, retryCount = 0) => {
  // Throws Error when reaching Max Retry limit
  if ((maxRetries - retryCount) <= 0) {
    throw new Error(`Reached Max Retries of ${maxRetries}`);
  }

  try {
    console.log(`ATTEMPTING - Retry Request #: ${retryCount}`)
    return await request(params);
  } catch (error) {
    console.log(`UNSUCCESSFUL - Retry Request ${retryCount} Error: ${error}`);
    await new Promise(resolve => setTimeout(resolve, calculateDelay(retryCount, maxRetries, 1000) ));
    return retryRequest(request, params, maxRetries, retryCount + 1, error);
  }
};

// randomized exponential backoff approach
// calc_retry( max_retries, max_backoff, this_retry_number)
// return calculated retry interval

// randomized exponential backoff approach

// How should I pick the backoff parameters?

// Let's assume that they delay chosen at any point is based on an initial timeout (T), an exponential factor (F), the number of retries so far (N), a random number (R), and a maximum timeout (M). Then:

// delay = MIN( R * T * F ^ N , M )

// R should be a random number in the range [1-2], so that its effect is to spread out the load over time, but always more conservative than plain backoff.
// T (initial timeout): should be set at the outer limits of expected response time for the service. For example, if your service responds in 1ms on average but in 10ms for 99% of requests, then set t=10ms.
// F (exponential factor) - doesn't matter much, so choose 2 as a nice round number. (It's the exponential nature that counts.)
// M (maximum timeout) - should be as low as possible to keep your customers happy, but high enough that the system can definitely handle requests from all clients at that sustained rate.
// N (number of retries so far)

// AWS
// https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/