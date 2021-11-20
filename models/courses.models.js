const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema(
  {
    name: String,
    teacher: String,
    description: String,
    membership: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = Course = mongoose.model('Courses', CourseSchema);
