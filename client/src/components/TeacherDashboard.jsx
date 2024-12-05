import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'

import proficon from '../assets/profileicon.png'
import quizicon from '../assets/quiz.png'
import addicon from '../assets/add.png'
import viewicon from '../assets/view.png'
import assignicon from '../assets/assign.png'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const TeacherDashboard = ({cookie}) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const SendCon = async () => {
    axios.get(`http://localhost:3000/teacher/dashboard/${cookie.username}`) 

    .then((response) => {
      setMessage(response.data.message); 
    })
    .catch((error) => {
      navigate('/login')
      console.error('Error fetching data:', error); 
    });
  }

  useEffect( () => {
    SendCon()
  }, []);

  return (
    <>
      <p id='Welcome'>Welcome, {cookie.username}</p>

      <div id="mainDash">

        <div id="scoreboard">

        </div>

        <div id='Sub'>
          <div className='box' id="profile" >
            <img src={proficon} id="proficon"/>
            <p>Profile</p>
          </div>

          <div className='box' id="add" >
            <Link to='/teacher/addstudent' style={{textDecoration: 'none'}}>
              <img src={addicon} id="addicon"/>
              <p>Add Student</p>
            </Link>
          </div>
    

          <div className='box' id="view" >
            <Link to={`/teacher/viewstudents/${cookie.username}`}style={{textDecoration: 'none'}}>
              <img src={viewicon} id="viewicon"/>
              <p>View Students</p>
            </Link>
          </div>
    
          <div className='box' id="CreateQuiz">
            <Link to='/teacher/createquiz' style={{textDecoration: 'none'}}>
              <img src={quizicon} id="wheel"/>
              <p>Create Quiz</p>
            </Link>
          </div>

          <div className='box' id="AddAssignment">
            <Link to={`/teacher/assign/${cookie.username}`} style={{textDecoration: 'none'}}>
              <img src={assignicon} id="wheel"/>
              <p>Create Assignment</p>
            </Link>
          </div>

        </div>
    </div>
  </>
  )
}

export default TeacherDashboard