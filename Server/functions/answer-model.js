const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
   answerText: {type: String, required: true},
   isCorrect: {type: Boolean, required: true}
}
)
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;