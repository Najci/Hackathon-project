import React, { Component, useEffect, useState } from 'react'
import '../css/AddStudent.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Field from './Builder/Field';

const frame = document.getElementById('userFrame')

const AddStudent = ({cookie}) => {

    const [message, setMessage] = useState('Please search for a student');
    const [studentData, setStudentData] = useState(null);

    const add = (userID) => {
        axios.post('http://localhost:3000/teacher/addstudent', {data: userID, cookie: cookie})
        .then(function (response){
            console.log(response.data)
            setStudentData(null)
            setMessage('Student has been added')
        })
        .catch(function(error) {
            setMessage(error.message)
        })
    }

    const submit = (e) => {
        e.preventDefault();
    
        const form = new FormData(e.target); 
        const formData = Object.fromEntries(form.entries())
    
        axios.post('http://localhost:3000/teacher/search', {data : formData, cookie : cookie})
        .then(function (response) {
            setStudentData(response.data)
            setMessage('')
        })
        .catch(function (error) {
            console.log(error.response)
            setMessage(error.response)
        });
    }


    return (
        
        <div id='mainAssign'>
            <div id='userFrame'>
                <p id='Warning'>{message}</p>
                {studentData ? <Field data={studentData} addStudent={add} /> : null}
            </div>

            <form id='AddStud' onSubmit={submit}>
                <div>
                    <label htmlFor="user">Username of student:</label>
                    <br />
                    <input type="text" name='username' id='user'/>
                </div>
                
                <input id='search' value='Search' type="submit" />
            </form>
            
        </div>
    )
}

export default AddStudent