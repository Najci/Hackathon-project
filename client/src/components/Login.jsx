import React from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate} from 'react-router-dom';
import '../css/Login.css'
import axios from 'axios';

const Login = ({ CreateCookie, user }) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    if (user){
      navigate('/' + user.role + '/dashboard/' + user.username)
      console.log('workin')
    }
  }, [])


  const submit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target); 
    const formData = Object.fromEntries(form.entries())

     axios.post('https://hackathon-project-sbuj.onrender.com/login', formData)
    .then(function (response) {
      CreateCookie(response.data.user)
      navigate('/dashboard')

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
