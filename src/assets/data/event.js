const eventInfo = {
  "artist": "Rita Ora",
  "location": "Eiffel Tower",
  "date": "February 28th, 2021 · 8:00 PM PST",
  "event_header": "RO3 World Tour",
  "description": [
    "Rita Ora will be making history on January 28th with a global live stream from the legendary Paris landmark, the Eiffel Tower, to celebrate the release of her third studio album: RO3. Tickets and VIP packages for this historic streaming event are on sale now.",
    "The stream will feature a full production complete with a visual feast of lights and pyrotechnics, a stacked set list featuring all tracks from RO3, her top hits, a handful of covers, and a guest performance. A special pre-show will kick-off 1 hour before the event featuring exclusive interviews and behind-the-scenes footage."
  ],
  "event_poster": require("../images/ritaora/sponsorR03.png"),
  "hero-img": require("../images/ritaora/hero1.jpg"),
  "trailer_url": "https://www.youtube.com/embed/FS07b8EUlCs" 
};

const ticketInfo = [
  {
    "name": "General Admission",
    "description": "General Admission includes one (1) Virtual Ticket to the Concert Livestream in HD single view and Live Chat Access. Ticket can be redeemed on these platforms: WATCH ONLINE: You can watch the show online through the Eluvio Live website. WATCH ON THE GO: The Eluvio Live website is optimized for mobile streaming on all smartphone browsers. WATCH ON TV: The Eluvio app is available on Apple TV and Roku.",
    "price": "$30.00",
    "stripe_price_id": "price_1HpS6pE0yLQ1pYr6CuBre5I4",
    "stripe_prod_id": "prod_IQIiC3jywpIUKu",
    "date": "February 28th, 2021 · 8:00 PM PST",
  },
  {
    "name": "VIP 4K Package",
    "description": "VIP Package includes one (1) Virtual Ticket to the Concert Livestream in 4K single view + 6 MultiView feeds, Live Chat Access, and an Exclusive Virtual Meet and Greet with Rita Ora. Ticket can be redeemed on these platforms: WATCH ONLINE: You can watch the show online through the Eluvio Live website. WATCH ON THE GO: The Eluvio Live website is optimized for mobile streaming on all smartphone browsers. WATCH ON TV: The Eluvio app is available on Apple TV and Roku.",
    "price": "$50.00",
    "stripe_price_id": "price_1HpS77E0yLQ1pYr6bmC8griX",
    "stripe_prod_id": "prod_IQIiMc4NHvH3DF",
    "date": "February 28th, 2021 · 8:00 PM PST",
  },
];

const artistInfo = {
  "name": "Rita Ora",
  "intro": [
    "On early singles like “Hot Right Now” with DJ Fresh and her own 2012 smash “How We Do (Party),” Rita Ora exudes the headstrong confidence and swagger of an artist who knows exactly what she’s about. She also knows what she can do with a voice that fits just as well with lovelorn ballads as it does with full tilt party-starters.",
    "That combination of positivity and versatility has helped make Ora—born Rita Sahatçiu in Prishtina in the former Yugoslavia, in 1990—one of the most successful British female solo artists ever. And even though her troubles with her first record label led to a long delay for the follow-up to her 2012 debut Ora, she filled the gap with feature appearances on tracks by Iggy Azalea, Charli XCX, and Avicii, along with a stream of UK Top 10 singles such as the dreamy “Anywhere” and “For You,” a duet with Liam Payne for the soundtrack of Fifty Shades Freed."
  ],
  "bio": {
    "full_name": "Rita Sahatçiu Ora",
    "age": "30",
    "gender": "Female",
    "birth_date": "November 26, 1990",
    "birth_place": "Pristina, SFR Yugoslavia",
    "nationality": "British",
    "trivia": "She worked with artists such as Drake and Kanye West on her debut album and became the artist with the most U.K. #1 singles of 2012.",
  },
  "social-media": {
    "youtube": "https://www.youtube.com/user/ritaora",
    "instagram": "https://www.instagram.com/ritaora/?hl=en",
    "twitter": "https://twitter.com/RitaOra",
    "website": "https://www.how-to-be-lonely-digital.co.uk/",
    "facebook": "https://www.facebook.com/RitaOra",
    "soundcloud": "https://soundcloud.com/ritaora",
    "applemusic": "https://music.apple.com/us/artist/rita-ora/355898104",
    "spotify": "https://open.spotify.com/artist/5CCwRZC6euC8Odo6y9X8jr",
  },
  "spotify_embed": "https://open.spotify.com/embed/playlist/37i9dQZF1DWW1gMUqCDV0K",
  "twitter_handle": "RitaOra",
  "photo-gallery": [require("../images/ritaora/hero4.jpg"),require("../images/ritaora/hero2.jpg")],
};

const merchInfo = [
  {
    "name": "Phoenix Tour Tee - Black",
    "url": "https://store.ritaora.com/products/phoenix-tour-tee-black",
    "price": "$30.00",
    "front-img": require("../images/ritaora/merchFront.jpg"),
    "back-img": require("../images/ritaora/merchBack.jpg")
  },
  {
    "name": "INSTAGRAM TEE - WHITE",
    "url": "https://store.ritaora.com/products/instagram-tee-white",
    "price": "$30.00",
    "front-img": require("../images/ritaora/merchFront2.jpg"),
    "back-img": require("../images/ritaora/merchBack2.jpg")
  },
  {
    "name": "TOUR LONGSLEEVE - PINK",
    "url": "https://store.ritaora.com/products/anywhere-longsleeve-pink",
    "price": "$40.00",
    "front-img": require("../images/ritaora/merchFront3.jpg"),
    "back-img": require("../images/ritaora/merchBack3.jpg")
  },
  {
    "name": "INSTAGRAM TEE - WHITE",
    "url": "https://store.ritaora.com/products/instagram-tee-white",
    "price": "$30.00",
    "front-img": require("../images/ritaora/merchFront2.jpg"),
    "back-img": require("../images/ritaora/merchBack2.jpg")
  },
  {
    "name": "TOUR LONGSLEEVE - PINK",
    "url": "https://store.ritaora.com/products/anywhere-longsleeve-pink",
    "price": "$40.00",
    "front-img": require("../images/ritaora/merchFront3.jpg"),
    "back-img": require("../images/ritaora/merchBack3.jpg")
  },
  {
    "name": "Phoenix Tour Tee - Black",
    "url": "https://store.ritaora.com/products/phoenix-tour-tee-black",
    "price": "$30.00",
    "front-img": require("../images/ritaora/merchFront.jpg"),
    "back-img": require("../images/ritaora/merchBack.jpg")
  }
];


export { eventInfo, ticketInfo, artistInfo, merchInfo };