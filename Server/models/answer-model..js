const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
   answer: {type: String, required: true},
   isCorrect: {type: Boolean, required: true}
}
)
const User = mongoose.model('User', quizSchema);

module.exports = User;