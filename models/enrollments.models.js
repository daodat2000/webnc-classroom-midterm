const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = mongoose.Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = EnrollMent = mongoose.model('enrollment', EnrollmentSchema);
