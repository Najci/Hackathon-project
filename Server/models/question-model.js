const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
   question: {type: String, required: true},
   answers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}]
}
)
const User = mongoose.model('User', quizSchema);

module.exports = User;