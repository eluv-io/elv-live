import {retryRequest} from "../utils/retryRequest";

jest.setTimeout(30000);

let rateError = {
  message: "Testmode request rate limit exceeded, the rate limits in testmode are lower than livemode. You can learn more about rate limits here https://stripe.com/docs/rate-limits."
};

let globalRetryCount = 0;

// Mocking Request Time - 1000 MS
function mockRequestTime() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

// Simulating RedirectToCheckout - succeeds after set successCount tries
async function mockRedirectToCheckout(successCount) {
  await mockRequestTime();
  globalRetryCount += 1;

  if(globalRetryCount == successCount) {
    return "success";
  } else {
    throw new Error(rateError.message);
  }
}

test("SUCCESS - the retryRequest call should succeed on 3rd try", async () => {
  globalRetryCount = 0;
  let result = await retryRequest(mockRedirectToCheckout, 3, 5, 0);
  expect(result).toEqual("success");
});


test("Max Retries- the retryRequest call should throw an error when reaching max retries", async () => {
  globalRetryCount = 0;
  try {
    await retryRequest(mockRedirectToCheckout, 12, 5, 0);
  } catch (e) {
    let err = new Error("Reached Max Retries");
    expect(e).toEqual(err);
  }
});
