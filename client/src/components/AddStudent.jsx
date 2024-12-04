import React, { useEffect, useState } from 'react'
import '../css/AddStudent.css'
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {

    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault();
    
        const form = new FormData(e.target); 
        const formData = Object.fromEntries(form.entries())
    
        axios.post('http://localhost:3000/teacher/dashboard/addstudent', formData)
        .then(function (response) {
            
        })
        .catch(function (error) {
          setMessage(error.response.data)
        });
    }


    return (
        <div id='mainAssign'>
            <div id='userFrame'>

            </div>
        </div>
    )
}

export default AddStudent