const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    role: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = User = mongoose.model('users', UserSchema);
