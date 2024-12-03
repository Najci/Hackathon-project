import React from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import '../css/Login.css'
import axios from 'axios';

const Login = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/.netlify/functions/app/signup') 
        .then((data) => setMessage(data.message))
  }, []);

  const submit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target); 
    const formData = Object.fromEntries(form.entries())

    axios.post('/.netlify/functions/app/signup', formData)
    .then(function (response) {
      setMessage(response.data)
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
          <input className='inputField' name="password" type='password' id="pass"/>
        </div>

        <p id='Error'>{message}</p>

        <input id='Log' type="submit" value="Log In"  name='button'/>
      </form>
    </div>
  )
}

export default Login
