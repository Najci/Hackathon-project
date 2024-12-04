import React from 'react'
import { useEffect, useState } from 'react'
import '../css/SignUp.css'
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  
  useEffect(() => {
    fetch('http://localhost:3000/signup')
      .then((data) => setMessage(data.message))
  }, []);

  const submit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target); 
    const formData = Object.fromEntries(form.entries())

    axios.post('http://localhost:3000/signup', formData)
    .then(function (response) {
      setMessage(response.data)
      navigate('/signup')
    })
    .catch(function (error) {
      setMessage(error.response.data)
    });
  }

  return (
    <div id="wrapper">
      <h2>Sign Up</h2>

        <form onSubmit={submit} id='SignUp'>

            <div id='N_S'>
              <div>
                <label htmlFor="name">Name:</label>
                <br />
                <input className='inputField' type="text" id="name" name='firstname'/>
              </div>
  
              <div>
                <label htmlFor="last">Last Name:</label>
                <br />
                <input className='inputField' type="text" id="last" name='lastname'/>
              </div>
            </div>

            <div id='U_E'>
              <div>
                <label htmlFor="user">Username:</label>
                <br />
                <input className='inputField' type="text" id="user" name='username'/>
              </div>
  
              <div>
                <label htmlFor="Email">Email:</label>
                <br />
                <input className='inputField' name="email" type="text" id="email"/>
              </div>
            </div>
            

            <div id='pass'>
              <div>
                <label htmlFor="pass">Password:</label>
                <br />
                <input className='inputField' name="password" type='password' id="pass"/>
              </div>
  
              <div>
                <label htmlFor="cpass">Confirm Password:</label>
                <br />
                <input className='inputField' name="repeatPassword" type="password" id="cpass"/>
              </div>
            </div>

            <label id='SignLabel' htmlFor="S_T">Sign up as:</label>

            <div id='S_T'>
              <label htmlFor="prof">Teacher: <input type="radio" name="role" id="prof" value="teacher" /></label>
              <label htmlFor="stud">Student: <input type="radio" name="role" id="stud" value="student"/></label>
            </div>

            <p id='Error'>{message}</p>

            <input id='Sign' type="submit" value="Sign Up"  name='button'/>
        </form>
    </div>
  )
}

export default SignUp
