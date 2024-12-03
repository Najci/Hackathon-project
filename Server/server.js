const express = require('express');
const app = express();
const connectDB = require('./db');
const cors = require('cors');
const Joi = require('joi');
const bcrypt = require('bcrypt')
const saltRounds = 1;
const session = require('express-session')
const User = require('./user-model')
const Quiz = require('./quiz-model')
const Question = require('./question-model')
const Answer = require('./answer-model')

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://edusphinx.netlify.app/.netlify/functions/server',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
app.use(express.json());
app.use(session({
    secret: 'lala',
    saveUninitialized: false,
    resave: false,  
    cookie: { secure: false } 

}));


function createSession(data){
    return {username: data.username, firstname: data.firstname, lastname: data.lastname, role: data.role, email: data.email}
}

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    res.status(403).send('Unauthorized');
};

const isTeacher = (req, res, next) => {
    if (req.session.user && req.session.user.role === "teacher") {
        console.log("lala");
        return next();
    res.status(403).send('Unauthorized');
}};

const isStudent = (req, res, next) => {
    if (req.session.user && req.session.user.role === "student") {
        console.log("lala");
        return next();
    res.status(403).send('Unauthorized');
}};


connectDB();

const port = 3000;

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
        console.log("syntactic sugar")
        const hash = await bcrypt.hash(data.password, saltRounds);
        data.password = hash;
        const { repeatPassword, ...dataToSave } = data;
        let user = new User(dataToSave);
        user = await user.save();
        // Session starts
        req.session.user = createSession(data);
        console.log("Entry successful")
        res.status(201);
        res.send("dobar");

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  });


app.get('/signup', (req, res) => {
    console.log(req.session.user)
    res.send("dobar")
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
                console.log(users[0])
                req.session.user = createSession(users[0]);
                console.log(req.session.user);
                
                res.status(201);
                res.send("dobar ti je logion")
            }
        })
        
        
    } catch (error) {
        res.status(500);
        res.json({ message: error.message });
    }
  });


app.get('/student/dashboard', isStudent, (req,res)=>{
    res.json(req.session.user)
})
app.get('/teacher/dashboard', isTeacher, (req,res)=>{
    res.json(req.session.user)
})


app.post('/addstudent', isTeacher, async (req, res)=>{ 

    teacherUsername = req.session.user.username;
    teacherId = (await User.find({username: teacherUsername}))[0].id

    const schema = Joi.object({
        username: Joi.string().required()
    })
    const { error, value } = schema.validate({username: req.body.username})
    if (error){
        res.status(400);
        return res.send(error.message);
    }
    studentUsername = req.body.username;
    studentId = (await User.find({username: studentUsername, role: "student"}))[0].id
    console.log(studentId)
    console.log(teacherUsername)
    try{
        await User.updateOne(
            { username: teacherUsername },
            { $push: { students: studentId } } 
        );
        await User.updateOne(
            { username: studentUsername },
            { $push: { teachers: teacherId } } 
        );
    }
    catch (err){
        console.error(err);
        res.status(500).send("Unable to add student");
    }   
    res.send("addstudent");

  })

app.post('/createquiz', isTeacher, async(req,res)=>{
    data = req.body;
    
    subject = data.subject;
    const schema = Joi.object({
        subject: Joi.string().valid('Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'Computing', 'History', 'Geography', 'Health', 'Other')
    })
    const {error, value} = schema.validate({subject: subject});
    if (error){
        res.status(400).send("Invalid subject");
    }
    questions = req.body.questions;
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
    teacherUsername = req.session.user.username
    data.questions = listOfQuestions;
    let quiz = new Quiz(data);
    quiz = await quiz.save();
    await User.updateOne(
        { username: teacherUsername },
        { $push: { quizzes: quiz } } 
    );
})

  
app.get("/createassignment", isTeacher, async(req,res)=>{
    teacherUsername = session.get.user.username
    quizzes = User.find()
})
app.post("/createassignment", isTeacher, async(req,res)=>{

})


  // NEMOJ ZABORAVIS DA OBRISES
>app.get('/deletedb', async (req, res)=>{
    await User.deleteMany({});
    console.log('suc')
})

app.listen(port, () => {
    console.log("Listening to port: " + port)
})