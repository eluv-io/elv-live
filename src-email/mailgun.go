func SendSimpleMessage(domain, apiKey string) (string, error) {

	stripe.Key = "sk_test_51Gy1tWKgR5J3zPrLYkJQQcM3u3YR9BSN21T8EmwIgUB1KSo92gzK01n2UZO7IfS7Ke2D2CU5AKc6xaKatVhTrDdV00nRXJM7ib"

	p, _ := product.Get("prod_INxHoKTfGufIy2" , nil) // checkout session event's data.object.client_reference_id
	product := p.name

	pi, _ := paymentintent.Get("pi_1GzuKiKgR5J3zPrLxBhZPCyr", nil) // checkout session event's data.object.payment_intent
  
	name := pi.charges.data.name
	price := pi.amount // This will return "3000" for $30.00. Idk the Go syntax to convert cents into dollars
	qty := pi.charges.total_count

	// retrieve passcode and ticketId like you had before

	mg := mailgun.NewMailgun(domain, apiKey, publicApiKey)
	message := mg.NewMessage(params.Sender, params.Subject, "", recipient)
	message.SetTemplate(params.Template) // "rita-ora-general-admission"

	message.AddTemplateVariable("passcode", passcode)
	message.AddTemplateVariable("ticket-id", ticketId)
	message.AddTemplateVariable("name", name)
	message.AddTemplateVariable("product", product)
	message.AddTemplateVariable("qty", qty)
  message.AddTemplateVariable("price", price)

  message.AddTemplateVariable("redeem-url", "https://live.eluv.io/#/code?passcode=" + passcode)
  // I'm not sure if "./filename.jpg" is how you import files in Go
  message.AddInline("./ritaImage.jpg")
  message.AddInline("./logo.png")

	_, id, err := mg.Send(message)
	return id, err
}


{
	"name": "test_name",
	"product": "test_product",
	"ticket-id": "test_ticket-id",
	"qty": "test_qty",
	"price": "test_price",
	"passcode": "test_password"
}


{
  "id": "pi_1HpdxsKgR5J3zPrLN8NHrbFk",
  "object": "payment_intent",
  "amount": 5000,
  "amount_capturable": 0,
  "amount_received": 5000,
  "application": null,
  "application_fee_amount": null,
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic",
  "charges": {
    "object": "list",
    "data": [
      {
        "id": "ch_1Hpdy1KgR5J3zPrLC4H0As7K",
        "object": "charge",
        "amount": 5000,
        "amount_captured": 5000,
        "amount_refunded": 0,
        "application": null,
        "application_fee": null,
        "application_fee_amount": null,
        "balance_transaction": "txn_1Hpdy1KgR5J3zPrLbsjw4oI9",
        "billing_details": {
          "address": {
            "city": null,
            "country": "US",
            "line1": null,
            "line2": null,
            "postal_code": "95138",
            "state": null
          },
          "email": "alec.jo@berkeley.edu",
          "name": "Alec Jo",
          "phone": null
        },
        "calculated_statement_descriptor": "ELUVIO",
        "captured": true,
        "created": 1605895457,
        "currency": "usd",
        "customer": "cus_IQUx6fLGmJLUpU",
        "description": "1x RITA ORA - VIP PACKAGE",
        "destination": null,
        "dispute": null,
        "disputed": false,
        "failure_code": null,
        "failure_message": null,
        "fraud_details": {
        },
        "invoice": null,
        "livemode": false,
        "metadata": {
        },
        "on_behalf_of": null,
        "order": null,
        "outcome": {
          "network_status": "approved_by_network",
          "reason": null,
          "risk_level": "normal",
          "risk_score": 43,
          "seller_message": "Payment complete.",
          "type": "authorized"
        },
        "paid": true,
        "payment_intent": "pi_1HpdxsKgR5J3zPrLN8NHrbFk",
        "payment_method": "pm_1Hpdy0KgR5J3zPrLrAqyl7ty",
        "payment_method_details": {
          "card": {
            "brand": "visa",
            "checks": {
              "address_line1_check": null,
              "address_postal_code_check": "pass",
              "cvc_check": "pass"
            },
            "country": "US",
            "exp_month": 12,
            "exp_year": 2021,
            "fingerprint": "Q2yGGq0ITQKjsEYZ",
            "funding": "credit",
            "installments": null,
            "last4": "4242",
            "network": "visa",
            "three_d_secure": null,
            "wallet": null
          },
          "type": "card"
        },
        "receipt_email": null,
        "receipt_number": null,
        "receipt_url": "https://pay.stripe.com/receipts/acct_1Gy1tWKgR5J3zPrL/ch_1Hpdy1KgR5J3zPrLC4H0As7K/rcpt_IQUxUzrk8pOJu9cvmobXcwFZZRSQlLm",
        "refunded": false,
        "refunds": {
          "object": "list",
          "data": [

          ],
          "has_more": false,
          "total_count": 0,
          "url": "/v1/charges/ch_1Hpdy1KgR5J3zPrLC4H0As7K/refunds"
        },
        "review": null,
        "shipping": null,
        "source": null,
        "source_transfer": null,
        "statement_descriptor": null,
        "statement_descriptor_suffix": null,
        "status": "succeeded",
        "transfer_data": null,
        "transfer_group": null
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/charges?payment_intent=pi_1HpdxsKgR5J3zPrLN8NHrbFk"
  },
  "client_secret": "pi_1HpdxsKgR5J3zPrLN8NHrbFk_secret_RFCsIsE72P8on8EHR9QXmkYug",
  "confirmation_method": "automatic",
  "created": 1605895448,
  "currency": "usd",
  "customer": "cus_IQUx6fLGmJLUpU",
  "description": "1x RITA ORA - VIP PACKAGE",
  "invoice": null,
  "last_payment_error": null,
  "livemode": false,
  "metadata": {
  },
  "next_action": null,
  "on_behalf_of": null,
  "payment_method": "pm_1Hpdy0KgR5J3zPrLrAqyl7ty",
  "payment_method_options": {
    "card": {
      "installments": null,
      "network": null,
      "request_three_d_secure": "automatic"
    }
  },
  "payment_method_types": [
    "card"
  ],
  "receipt_email": null,
  "review": null,
  "setup_future_usage": null,
  "shipping": null,
  "source": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}
