const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    username: { type: String, required: true },
    email: {type: String, required: true },
    password: {type: String, required: true},
    role: {type: String, enum: ['teacher', 'student']},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    dateOfCreation:{type: mongoose.Schema.Types.Date}
}
)
const User = mongoose.model('User', userSchema);

module.exports = User;