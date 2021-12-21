const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GradeStructureSchema = mongoose.Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    detail: Number,
    title: String,
    finalized:Boolean,
    index: Number,
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = GradeStructure = mongoose.model('gradestructure', GradeStructureSchema);
