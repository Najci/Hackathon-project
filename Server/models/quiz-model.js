const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
   name: {type: String, required: true},
   subject: { type: String, required: true},
   question: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question"}]
})
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;