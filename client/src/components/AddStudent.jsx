import React, { useEffect, useState } from 'react'
import '../css/AddStudent.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const frame = document.getElementById('userFrame')

class newItem{
    constructor(data){
        const field = document.createElement('div');
        field.setAttribute('id', 'feild')
          
        const username = document.createElement('span');
        username.innerText = data.username;
        field.appendChild(username);

        const button = document.createElement('button');
        button.innerText = "Click Me"; 
        
        field.appendChild(button);

        frame.appendChild(field)
    }
}

const AddStudent = (cookie) => {

    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault();
    
        const form = new FormData(e.target); 
        const formData = Object.fromEntries(form.entries())
    
        axios.post('http://localhost:3000/teacher/addstudent', {data : formData, cookie : cookie})
        .then(function (response) {
            const NewElement = new newItem(response.data)
        })
        .catch(function (error) {
            console.log(error.response)
            setMessage(error.response)
        });
    }


    return (
        <div id='mainAssign'>
            <div id='userFrame'> </div>

            <form id='AddStud' onSubmit={submit}>
                <div>
                    <label htmlFor="user">Username of student:</label>
                    <br />
                    <input type="text" name='username' id='user'/>
                </div>
                
                <input type="submit" />
            </form>
        </div>
    )
}

export default AddStudent