import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'

import proficon from '../assets/profileicon.png'
import quizicon from '../assets/quiz.png'
import addicon from '../assets/add.png'
import viewicon from '../assets/view.png'
import assignicon from '../assets/assign.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const StudentDashboard = ({user}) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const SendCon = async () => {
    const con = await axios.get('http://localhost:3000/student/dashboard') 

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
      <p id='Welcome'>Welcome {user.username}</p>

      <div id="mainDash">

        <div id="scoreboard" ></div>

        <div id='Sub'>
          <div className='box' id="profile" >
            <img src={proficon} id="proficon"/>
            <p>Profile</p>
          </div>
    
          <div className='box' id="quiz" >
            <img src={quizicon} id="quizicon"/>
            <p>Quiz</p>
          </div>
    
          <div className='box' id="settings">
            <img src={assignicon} id="wheel"/>
            <p>Add Asignments</p>
          </div>

        </div>
    </div>
  </>
  )
}

export default StudentDashboard