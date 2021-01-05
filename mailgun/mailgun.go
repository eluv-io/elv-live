// Example Mailgun Go Logic to send to Paul

func SendSimpleMessage(domain, apiKey string) (string, error) {

	p, _ := product.Get("prod_INxHoKTfGufIy2" , nil) // checkout session event's data.object.client_reference_id
	product := p.name

	pi, _ := paymentintent.Get("pi_1GzuKiKgR5J3zPrLxBhZPCyr", nil) // checkout session event's data.object.payment_intent
  
	name := pi.charges.data.name

	// retrieve passcode and ticketId like you had before

	mg := mailgun.NewMailgun(domain, apiKey, publicApiKey)
	message := mg.NewMessage(params.Sender, params.Subject, "", recipient)
	message.SetTemplate(params.Template) // "rita-ora-general-admission"

	message.AddTemplateVariable("passcode", passcode)
	message.AddTemplateVariable("ticket-id", ticketId)
	message.AddTemplateVariable("name", name)

  // Need the to input the passcode and email into url
	message.AddTemplateVariable("redeem-url", "https://live.eluv.io/d457a576/code?passcode=" + passcode + "&email=" + email + "&access=true")
	
  // I'm not sure if "./filename.jpg" is how you import files in Go
  message.AddInline("./poster.png")
  message.AddInline("./logo.png")

	_, id, err := mg.Send(message)
	return id, err
}