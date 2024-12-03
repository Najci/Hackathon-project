const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () =>{
    try {
        mongoose.set('strictQuery', false);

       const connection = await mongoose.connect("mongodb+srv://stevanstankovic177:g7GUGrUhA4vAiWm9@cluster0.m7zwx.mongodb.net/edusphinx?retryWrites=true&w=majority&appName=Cluster0")
        console.log('MongoDB Connected: ' + connection.connection.host);
    } catch (error) {
        console.error("error: "+ error.message)
        process.exit(1);
    }
}
module.exports = connectDB;