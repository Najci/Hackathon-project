const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
   subject: { type: String, required: true}
   question: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question"}]
})
const User = mongoose.model('User', quizSchema);

module.exports = User;