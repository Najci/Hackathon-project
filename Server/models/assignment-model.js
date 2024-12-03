const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    quiz: {type: String, required: true},
    students:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Question"}],
    dueDate: {type: mongoose.Schema.Types.Date}
}
)
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;