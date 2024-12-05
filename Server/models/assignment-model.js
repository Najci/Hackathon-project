const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    quiz: {type: String, required: true},
    students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
      score: { type: String }, // Score for this student
    },
  ],
    dueDate: {type: mongoose.Schema.Types.Date, required: true}
}
)
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;