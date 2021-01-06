// randomized exponential backoff approach
// calc_retry( max_retries, max_backoff, this_retry_number)
// return calculated retry interval
const INITIAL_DELAY = 100; // Initial delay of 100 milliseconds
const MAX_DELAY = 1000;
const EXP_FACTOR = 2;


export const calculateDelay = (retryCount, maxRetries) => {
  if ((maxRetries - retryCount - 1) < 0) {
    console.log(`Reached maxRetries of ${maxRetries}. Current Retry Count: ${retryCount}`)
    return 0; 
  }

  // Calculate exponential backoff as (2^retries * 100) milliseconds. Don't allow the number to exceed MAX_DELAY.
  let exponential_backoff = Math.min(INITIAL_DELAY * (EXP_FACTOR ** retryCount), MAX_DELAY);
  console.log(`exponential backoff ${exponential_backoff}`);

  // Apply some randomization in the range of (delay_seconds / 2) to (delay_seconds). Math.floor(Math.random() * delay_seconds) + (delay_seconds / 2)   
  let randomization_backoff = Math.floor(Math.random() * exponential_backoff) + (exponential_backoff / 2);
  console.log(`randomization_backoff ${randomization_backoff}`);

  // Ensure it never delays less than the MAX_DELAY seconds.
  let delay_seconds = Math.max(MAX_DELAY, randomization_backoff);
  console.log(`delay_seconds ${delay_seconds}`);

  return delay_seconds;
};

export const retryRequest = async (request, params, maxRetries, retryCount = 0) => {

  if (retryCount > maxRetries) {
    throw new Error(`Reached max retries of ${maxRetries}. Current Retry Count: ${retryCount}`);
  }

  try {
    console.log(`retryRequest retryCount: ${retryCount}`)
    await request(params);
  } catch (error) {
    console.log(`request e: ${error}`);
    await new Promise(resolve => setTimeout(resolve, calculateDelay(retryCount, maxRetries, 1000) ));

    return retryRequest(request, params, maxRetries, retryCount + 1, error);
  }
};


// How should I pick the backoff parameters?

// Let's assume that they delay chosen at any point is based on an initial timeout (T), an exponential factor (F), the number of retries so far (N), a random number (R), and a maximum timeout (M). Then:
// delay = MIN( R * T * F ^ N , M )

// AWS
// https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/