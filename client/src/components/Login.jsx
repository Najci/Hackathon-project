import React from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import '../css/Login.css'
import axios from 'axios';

const Login = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate()


  const submit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target); 
    const formData = Object.fromEntries(form.entries())

    axios.post('http://localhost:3000/login', formData)
    .then(function (response) {
      console.log(response.data.role)
      if (response.data.role === "teacher"){
        navigate('/teacher/dashboard')
      }
      else if(response.data.role === "student"){
        navigate('/student/dashboard')
      }
      else{
        navigate('/login')
      }

    })
    .catch(function (error) {
      setMessage(error.response.data)
    });
  }

  return (
    <div id="wrapperLog">
      <h2>Log In</h2>

      <form onSubmit={submit} id='LogIn'>

        <div id='U_ELog'>
          <label htmlFor="user">Username:</label>
          <br />
          <input className='inputField' type="text" id="user" name='username'/>
        </div> 

        <div id='passLog'>
          <label htmlFor="pass">Password:</label>
          <br />
          <input className='inputField' name="password" type='password' id="passLog"/>
        </div>

        <p id='Error'>{message}</p>

        <input id='Log' type="submit" value="Log In"  name='button'/>
      </form>
    </div>
  )
}

export default Login
