const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = mongoose.Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = Status = mongoose.model('statuses', StatusSchema);
