
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

/* const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    else
    {
        res.status(403).send('Unauthorized');
    }
    
}; */

/* const isTeacher = (req, res, next) => {
    
    console.log(req.session.user.role);
    
}; */

/* const isStudent = (req, res, next) => {
    if (req.session.user && req.session.user.role === "student") {
        return next();
    }
    else
    {
    res.status(403).send('Unauthorized');
    }
}; */

app.post('/signup', async (req, res) => {
    try {
        let data = req.body;
        // TO-DO: Add messages for errors
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
        // Session starts
        
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
                        console.log("AJDE")
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

app.get('/profile/:username', async(req,res)=>{
    username = req.params.username;
    fullUser = await User.find({username:username});
    console.log(fullUser);
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
                "students.studentId": studentId // Match the studentId
            },
            {
                "students.$": 1 // Only include the matched student in the result
            }
        );
        console.log(newAssignment.students[0].score);
        if (!newAssignment.students[0].score){
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
        console.log(assignment.quiz);
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
        // Step 1: Find the teacher and get their quizzes
        const teacher = await User.findOne({ username: teacherUsername }, { quizzes: 1 }).populate({
            path: 'quizzes',
            model: 'Quiz', // assuming you have a Quiz model reference in the quizzes field
            select: 'name subject' // select only necessary fields to avoid over-fetching
        });

        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        // Step 2: Get all assignments for the quizzes in bulk
        const assignments = await Assignment.find({ quiz: { $in: teacher.quizzes.map(q => q._id) } }).populate({
            path: 'quiz',
            model: 'Quiz',
            select: 'name subject' // only necessary fields from Quiz model
        }).populate({
            path: 'students.studentId', // Assuming studentId is a reference to the User model
            model: 'User',
            select: 'firstname lastname username' // Only necessary fields from User model
        });

        // Step 3: Process the data
        const things = assignments.map(assignment => {
            const quizName = `${assignment.quiz.name} / ${assignment.quiz.subject}`;

            // Map over students and structure their data
            const newStudents = assignment.students.map(student => {
                return {
                    name: `${student.studentId.firstname} ${student.studentId.lastname}`,
                    username: student.studentId.username,
                    score: student.score
                };
            });

            return { quizName, students: newStudents };
        });

        // Step 4: Send the response
        res.status(200).json(things);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});



app.post('/teacher/search', async (req, res)=>{ 
// stavi da ne mogu dva ista studenta / teachera
    

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
    // stavi da ne mogu dva ista studenta / teachera
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

function parseQuizData(inputData){
    const result = {
        name: inputData.name,
        subject: inputData.subject,
        questions: []
      };
      
      // Get all question keys dynamically
      const questionKeys = Object.keys(inputData).filter(key => key.startsWith('question['));
      
      // Loop through each question
      const questionIndexSet = new Set(); // To track unique question indices
      questionKeys.forEach(key => {
        const questionIndex = key.match(/\d+/)[0]; // Extract the question index (e.g., 0, 1)
        
        // If this question has already been processed, skip it
        if (!questionIndexSet.has(questionIndex)) {
          questionIndexSet.add(questionIndex);
          
          const question = {
            questionText: inputData[`question[${questionIndex}][questionText]`],
            answers: []
          };
      
          // Loop through the answers for this question (assuming 4 answers per question)
          for (let j = 0; j < 4; j++) {
            const answer = {
              answerText: inputData[`question[${questionIndex}][answers][${j}][answerText]`],
              isCorrect: inputData[`question[${questionIndex}][answers][${j}][isCorrect]`] === 'on' // 'on' means correct
            };
            question.answers.push(answer);
          }
      
          result.questions.push(question);
        }
        
      });
    return result;
}

app.post('/teacher/createquiz', async(req,res)=>{
    // postuje se select sa jednim od 10 mogucih predmeta
    // postuje se list of questions, svaki question ima svoj tekst i list of 4 answers, svaki answer u sebi ima answerText i isCorrect boolean.
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
        console.log(error.message)
        return res.send("Error creating quiz, please make sure all fields are filled.");
    }
    res.status(200)
    res.send('ok')
})
app.get('/student/:username/assignment/:assignmentid', async (req, res) => {
    const assignmentId = req.params.assignmentid;
  
    // Fetch the assignment and quiz in parallel
    const assignment = await Assignment.findOne({ _id: assignmentId });
    const quiz = await Quiz.findOne({ _id: assignment.quiz });
  
    // Fetch all questions in one query
    const questionIds = quiz.questions;
    const questionsData = await Question.find({ _id: { $in: questionIds } });
  
    // Collect all answer IDs and fetch them in one query
    const answerIds = questionsData.flatMap(question => question.answers);
    const answersData = await Answer.find({ _id: { $in: answerIds } });
  
    // Map answers to their respective questions
    const answersMap = new Map();
    answersData.forEach(answer => {
      answersMap.set(answer._id.toString(), answer);
    });
  
    // Build the questions array
    const questions = questionsData.map(question => ({
      questionText: question.questionText,
      answers: question.answers.map(answerId => answersMap.get(answerId.toString()))
    }));
  
    // Construct the final quiz object
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
    console.log(assignmentId);
    const quiz = await Quiz.findOne({ _id: assignment.quiz });
    n = quiz.questions.length;
    stringScore = `${score}/${n}`
    studentUsername = req.params.username;
    studentId = (await User.findOne({username: studentUsername})).id;
    console.log("studentid", studentId);
    console.log("assignmentId", assignmentId);
    newAssignment = await Assignment.findOneAndUpdate({_id: assignmentId, "students.studentId": { $in: studentId }}, 
                                      { $set: { "students.$.score": stringScore} },
                                    {new: true})
    console.log(newAssignment);
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
    // TODO: error-checking
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
    console.log("VIEW");
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




app.get('/student/assignments/', async (req, res)=>{
    // trebalo bi da radi, proveri kad max napravi frontend
    // ako ne radi srecno
    
    studentUsername = req.body.cookie.user.username;
    studentId = (await User.find({username: studentUsername}))[0].id
    assignments = await Assignment.find({students: { $in:  [studentId]}})
    for (let assignment of assignments){
        let quiz = (await Quiz.find({id: assignment.quiz}))[0].id
        let teacher = (await User.find({quizzes: { $in:  [quiz]}}))[0]
        assignment.teacherFirstName = teacher.firstname;
        assignment.teacherLastName = teacher.lastname;
    }
    res.json(assignments);
    res.status(200)
})


  // NEMOJ ZABORAVIS DA OBRISES
app.get('/deletedb', async (req, res)=>{
    await User.deleteMany({});
    res.send('suc')
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))