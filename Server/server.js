
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const Joi = require('joi');
const bcrypt = require('bcryptjs')
const saltRounds = 1;
const session = require('express-session')
const qs = require('qs');
const mongoose = require('mongoose');
const parseQuizData = require('./parseQuizData');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyCcnoqG6EFuJfRyBOGzxlGKM1lM8AfWe5A");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });






const User = require('./models/user-model')
const Quiz = require('./models/quiz-model')
const Question = require('./models/question-model')
const Answer = require('./models/answer-model')
const Assignment = require('./models/assignment-model');
const { trusted } = require('mongoose');
const bodyParser = require('body-parser');

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(express.json());
app.use(session({
    secret: "my-super-secret-key",
    saveUninitialized: false,
    resave: false,  
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

function createSession(data){
    return {username: data.username, firstname: data.firstname, lastname: data.lastname, role: data.role, email: data.email}
}


app.post('/signup', async (req, res) => {
    try {
        let data = req.body;
        const schema = Joi.object({
            firstname: Joi.string()
                    .alphanum()
                    .required(),
            lastname: Joi.string()
                    .alphanum()
                    .required(),
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2}),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            repeatPassword: Joi.ref('password'),
            role: Joi.string().valid('teacher', 'student').required()
        })
        
        const { error, value } = schema.validate({ firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, password: data.password, repeatPassword: data.repeatPassword, role: data.role});
        if (error){
            res.status(400)
            return res.send(error.message)
        }
        let users = await User.find({ username: data.username })
        if (users.length){
            res.status(400)
            return res.send("Username taken");
        }
        users = await User.find({ email: data.email })
        if (users.length){
            res.status(400)
            return res.send("Email taken");
        }
        const hash = await bcrypt.hash(data.password, saltRounds);
        data.password = hash;
        const { repeatPassword, ...dataToSave } = data;
        req.session.user = createSession(data);
        const today = new Date();
        signUpData = {
            ...dataToSave,
            dateOfCreation:today
        }
        let user = new User(signUpData);
        user = await user.save();
        
        res.status(201);
        res.json(req.session.user);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  });


app.get('/signup', (req, res) => {
    res.send("dobar")
    res.status(200)
})

app.post('/login', async (req, res) => {

    try {
        let data = req.body;
        const users = await User.find({ username: data.username })
        
        if (!users.length){
            res.status(400)
            return res.send("Username not found");
        }
        const correctPassword = users[0].password;
        

        bcrypt.compare(data.password, correctPassword, (err, isMatch) =>{
            if (err){
                res.status(500)
                return res.send(err);
            }

            if (!isMatch){
                
                res.status(400)
                return res.send("Incorrect password")
            }
            else{
                
                // Session starts
                req.session.user = createSession(users[0]);
                req.session.save((err) => {
                    if (err) {
                        res.status(500).send("Error saving session");
                    } else {
                        res.status(201);
                        res.json(req.session); 
                    }
                });
            }
        })
        
    } catch (error) {
        res.status(500);
        res.json({ message: error.message });
    }
});

app.get('/student/profile/:username', async(req,res)=>{
    username = req.params.username;
    fullUser = await User.findOne({username:username});
    data = {
        firstname:fullUser.firstname,
        lastname:fullUser.lastname,
        username:fullUser.username,
        email:fullUser.email,
        role:fullUser.role,
        dateOfCreation:fullUser.dateOfCreation
    }


    res.status(200).json(data);
})
app.get('/teacher/profile/:username', async(req,res)=>{
    username = req.params.username;
    fullUser = await User.findOne({username:username});
    
    data = {
        firstname:fullUser.firstname,
        lastname:fullUser.lastname,
        username:fullUser.username,
        email:fullUser.email,
        role:fullUser.role,
        dateOfCreation:fullUser.dateOfCreation
    }


    res.status(200).json(data);
})

app.get('/student/dashboard/:username', async (req,res)=>{
    
    studentUsername = req.params.username;
    studentId = (await User.findOne({username: studentUsername})).id
    const assignments = await Assignment.find({
        students: {
          $elemMatch: {
            studentId: studentId,
          }
        }
      });
    let studentAssignments = []
    for (let assignment of assignments){
        let quiz = await Quiz.findOne({_id: assignment.quiz})
        let teacher = (await User.find({quizzes: { $in:  [quiz]}}))[0]
        const newAssignment = await Assignment.findOne(
            {
                "students.studentId": studentId 
            },
            {
                "students.$": 1 
            }
        );        if (!newAssignment.students[0].score){
        studentAssignment = {
            ...assignment.toObject(),
            teacherFirstName: teacher.firstname,
            teacherLastName: teacher.lastname,
            quizName: quiz.name,
            quizSubject: quiz.subject
        };

        let today = new Date();
        let due = new Date(studentAssignment.dueDate)
        if (today < due){
            studentAssignments.push(studentAssignment);
        }
    }
    }
    res.json(studentAssignments);
    res.status(200)
})



app.get('/dashboard/', async (req,res)=>{

})

app.get('/student/pastassignments/:username', async (req, res) =>{
    studentUsername = req.params.username;
    studentId = (await User.findOne({username: studentUsername})).id
    const assignments = await Assignment.find({
        students: { $elemMatch: { studentId: studentId } }
      });
    let fullAssignments = []
    for (let assignment of assignments){
        const student = assignment.students.find(student => student.studentId.toString() === studentId.toString());
        fullQuiz = await Quiz.findOne({_id:assignment.quiz});
        newQuiz = `${fullQuiz.name} / ${fullQuiz.subject}`
        fullAssignment = {quizName:newQuiz, dueDate:assignment.dueDate, score:student.score}
        if (student.score){
        fullAssignments.push(fullAssignment);
        }
    }
    res.status(200);
    res.json(fullAssignments);
    
    
})

app.get('/teacher/dashboard/:username', async (req, res) => {
    const teacherUsername = req.params.username;
    try {
        const teacher = await User.findOne({ username: teacherUsername }, { quizzes: 1 }).populate({
            path: 'quizzes',
            model: 'Quiz',
            select: 'name subject'
        });
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }
        const assignments = await Assignment.find({ quiz: { $in: teacher.quizzes.map(q => q._id) } }).populate({
            path: 'quiz',
            model: 'Quiz',
            select: 'name subject'
        }).populate({
            path: 'students.studentId',
            model: 'User',
            select: 'firstname lastname username'
        });
        const things = assignments.map(assignment => {
            const quizName = `${assignment.quiz.name} / ${assignment.quiz.subject}`;

            const newStudents = assignment.students.map(student => {
                return {
                    name: `${student.studentId.firstname} ${student.studentId.lastname}`,
                    username: student.studentId.username,
                    score: student.score
                };
            });

            return { quizName, students: newStudents };
        });

        res.status(200).json(things);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});



app.post('/teacher/search', async (req, res)=>{ 
    if (!req.body.cookie){
        return res.send("not authorised")
    }
    teacherUsername = req.body.cookie.user.username;
    teacherId = (await User.find({username: teacherUsername}))[0].id
    const schema = Joi.object({
        username: Joi.string().required()
    })
    const { error, value } = schema.validate({username: req.body.data.username})
    if (error){
        res.status(400);
        return res.send(error.message);
    }
    studentUsername = req.body.data.username;
    
    student = await User.findOne({username: studentUsername, role: "student"})
    if (!student){
        return res.status(400).send("Cannot add a teacher.")
    }
    studentId = student.id;

    res.json(student);
    res.status(200)
  })

app.post('/teacher/addstudent', async (req, res)=>{ 
       teacherUsername = req.body.cookie.user.username;
       studentId = req.body.data;
        try{
            await User.updateOne(
                { username: teacherUsername },
                { $addToSet: { students: studentId } } 
            );
            await User.updateOne(
                { username: studentUsername },
                { $addToSet: { teachers: teacherId } } 
            );
        }
        catch (err){
            console.error(err);
            res.status(500).send("Unable to add student");
        }   
        res.json(student);
        res.status(200)
    })



app.post('/teacher/createquiz', async(req,res)=>{
    try{
    inputData = req.body.data
    result = parseQuizData(inputData);
    subject = result.subject;
    const schema = Joi.object({
        subject: Joi.string().valid('Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'Computing', 'History', 'Geography', 'Health', 'Other')
    })
    const {error, value} = schema.validate({subject: subject});
    if (error){
        res.status(400).send("Invalid subject");
    }
    questions = result.questions;
    let listOfQuestions = [];
    for (let question of questions){
        let listOfAnswers = []
        for (let answer of question.answers){
            let savedAnswer = new Answer(answer);
            savedAnswer = await savedAnswer.save();
            listOfAnswers.push(savedAnswer.id);
        }
        question.answers = listOfAnswers;
        let savedQuestion = new Question(question);
        savedQuestion = await savedQuestion.save();
        listOfQuestions.push(savedQuestion.id);
    }
    teacherUsername = req.body.cookie.user.username
    
    result.questions = listOfQuestions;
    
    let _quiz = new Quiz(result);
    _quiz = await _quiz.save();
    await User.updateOne(
        { username: teacherUsername },
        { $push: { quizzes: _quiz } } 
    );
    }
    catch(error){
        res.status(400)
        return res.send("Error creating quiz, please make sure all fields are filled.");
    }
    res.status(200)
    res.send('ok')
})
app.get('/student/:username/assignment/:assignmentid', async (req, res) => {
    const assignmentId = req.params.assignmentid;
  
    const assignment = await Assignment.findOne({ _id: assignmentId });
    const quiz = await Quiz.findOne({ _id: assignment.quiz });
  
    const questionIds = quiz.questions;
    const questionsData = await Question.find({ _id: { $in: questionIds } });
  
    const answerIds = questionsData.flatMap(question => question.answers);
    const answersData = await Answer.find({ _id: { $in: answerIds } });
  
    const answersMap = new Map();
    answersData.forEach(answer => {
      answersMap.set(answer._id.toString(), answer);
    });
  
    const questions = questionsData.map(question => ({
      questionText: question.questionText,
      answers: question.answers.map(answerId => answersMap.get(answerId.toString()))
    }));
  
    const newQuiz = {
      name: quiz.name,
      subject: quiz.subject,
      questions
    };
  
    res.json(newQuiz);
    res.status(200)
});



app.post('/student/:username/assignment/:assignmentid', async (req, res) => {
    score = 0;
    data = req.body.data;
    studentAnswers = Object.keys(data);
    for (let studentAnswer of studentAnswers){
        answer = await Answer.findOne({_id: studentAnswer})

        if (answer.isCorrect){
            score++;
        }
    }
    const assignmentId = req.params.assignmentid;
    const assignment = await Assignment.findOne({ _id: assignmentId });
    const quiz = await Quiz.findOne({ _id: assignment.quiz });
    n = quiz.questions.length;
    stringScore = `${score}/${n}`
    studentUsername = req.params.username;
    studentId = (await User.findOne({username: studentUsername})).id;
    newAssignment = await Assignment.findOneAndUpdate({_id: assignmentId, "students.studentId": { $in: studentId }}, 
                                      { $set: { "students.$.score": stringScore} },
                                    {new: true})
    res.status(200)
    
});
  
app.post('/teacher/createquiz/ai', async(req,res)=>{
    topic = req.body.data.topic;
    const prompt = "You are a question and answer generator for teachers creating an online quiz. Send in JSON format 5-10 questions, each with EXCLUSIVELY 4 possible answers, one of which is correct. Omit the ```json bits. The keys should be called questionText, answerText, and isCorrect. The topic of the quiz is "+topic;
    const result = await model.generateContent(prompt);
    
    res.json(result.response.text());
    res.status(200)
})
app.get('/teacher/assign/:username', async (req, res)=>{
    // pokazuje sve quizzes i students jednog teachera
    teacherUsername = req.params.username
    teacher = await User.findOne({username: teacherUsername})
    quizId = teacher.quizzes;
    studentId = teacher.students;
    quizzes = (await Quiz.find({_id: quizId})) 
    students = (await User.find({_id: studentId})) 
    res.json({quizzes: quizzes, students:students})
    res.status(200)
})
app.post('/teacher/assign', async (req, res)=>{

    teacherUsername = req.body.cookie.user.username
    teacher = (await User.find({username: teacherUsername}))[0]
    quizzes = teacher.quizzes;
    if (!quizzes){
        
    }
    students = teacher.students;
    if (!students){
        res.status(400).send("No students added")
    }

    data = req.body.data;
    
    const formattedStudents = data.students.map(studentId => ({
        "studentId":studentId,
        "score":null
    }));
    assignmentData = {
        quiz: data.quiz,
        students: formattedStudents,
        dueDate: data.dueDate
    };
    
    
    if (!assignmentData.quiz){
        return res.status(400).send("No quizzes selected")
    }
    if (!assignmentData.students){
        return res.status(400).send("No students added")
    }

    let assignment = new Assignment(assignmentData);
    assignment = await assignment.save();
    res.send(assignment);
    res.status(200)
})

app.get('/teacher/viewstudents/:username', async(req,res)=>{
    teacherUsername = req.params.username;
    teacher = (await User.find({username: teacherUsername}))[0]
    studentId = teacher.students;
    students = (await User.find({_id: studentId})) 
    res.status(200);
    res.json(students);
})

app.post('/teacher/removestudent/', async(req,res)=>{
    teacherUsername = req.body.cookie.user.username;
    studentId = req.body.data;
    await User.updateOne({username: teacherUsername}, {$pull: {students: studentId}})
    res.send("Deleted student.");
    res.status(200)
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))