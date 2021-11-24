const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Connect model to database
const ProfileSchema = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    gender: String,
    studentId: String,
    place: String,
    about: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = Profile = mongoose.model('profiles', ProfileSchema);
