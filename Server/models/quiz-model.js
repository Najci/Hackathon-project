const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
   subject: { type: String, required: true}
   subject: { type: String, required: true}
}
)
const User = mongoose.model('User', quizSchema);

module.exports = User;