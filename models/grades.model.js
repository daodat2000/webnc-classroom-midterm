const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GradeSchema = mongoose.Schema(
  {
    studentId: { type:  String, ref: 'Profile' },
    courseId: {type: Schema.Types.ObjectId},
    gradeStructureId: { type: Schema.Types.ObjectId, ref : 'GradeStructure'},
    grade: String,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = Grade = mongoose.model('grade', GradeSchema);