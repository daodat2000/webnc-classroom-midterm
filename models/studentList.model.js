const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentListSchema = mongoose.Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    studentId: String,
    fullName: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = StudentList = mongoose.model('studentList', studentListSchema);
