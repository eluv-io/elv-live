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
	






	message.AddTemplateVariable("passcode", passcode)
	message.AddTemplateVariable("ticket-id", ticketId)
	message.AddTemplateVariable("cust-name", custName)
	redeemQuery := fmt.Sprintf("passcode=%v&email=%v&access=true", passcode, recipient)
	queryEscaped := url.QueryEscape(redeemQuery)
	redeemUrl := "https://live.eluv.io/d457a576/code"
	if params.RedeemUrl != "" {
		redeemUrl = params.RedeemUrl
	}
	message.AddTemplateVariable("redeem-url", fmt.Sprintf("%v?%v", redeemUrl, queryEscaped))






	_, id, err := mg.Send(message)
	return id, err
}

type Ticket struct {
	passcode	  string   
	redeem-url	string 
}

var tickets []Ticket

for i := 0; i < ticketQty; i++ {
	passcode:= createOTP(); //however you create tickets
	tickets = append(tickets, Ticket {
		passcode: passcode,
		redeem-url: "https://live.eluv.io/d457a576/code?passcode=" + passcode + "&email=" + email + "&access=true"
	})
}

message.AddTemplateVariable("tickets", tickets)

{
	ticket-class: [
		{
		ticket-class-name: "General Admission Ticket",
		premiere-date: "Sometime, 2021 8:00 PM PST"
		tickets: [
			{ passcode: "abc", redeem-url: "https://live.eluv.io/d457a576/code?passcode=" + passcode + "&email=" + email + "&access=true" },
			{ passcode: "abc", redeem-url: "https://live.eluv.io/d457a576/code?passcode=" + passcode + "&email=" + email + "&access=true" },
		]
	},
	{
		ticket-class-name: "4K Premium Ticket",
		premiere-date: "Sometime, 2021 8:00 PM PST"
		tickets: [
			{ passcode: "abc", redeem-url: "https://live.eluv.io/d457a576/code?passcode=" + passcode + "&email=" + email + "&access=true" },
			{ passcode: "abc", redeem-url: "https://live.eluv.io/d457a576/code?passcode=" + passcode + "&email=" + email + "&access=true" },
		]
	}
	]
}


mjml email.mjml -o newtemplate.html	