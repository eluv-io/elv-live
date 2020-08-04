const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
  email: String,
  stripeId: String
});

mongoose.model("users", userSchema);