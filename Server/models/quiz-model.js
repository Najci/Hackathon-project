const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
   subject: {}
}
)
const User = mongoose.model('User', quizSchema);

module.exports = User;