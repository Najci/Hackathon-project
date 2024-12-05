import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'

import proficon from '../assets/profileicon.png'
import quizicon from '../assets/quiz.png'
import addicon from '../assets/add.png'
import viewicon from '../assets/view.png'
import assignicon from '../assets/assign.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ShowAssignments from './Builder/ShowAssignments'

const StudentDashboard = ({cookie}) => {
  const [assigments, setAssignments] = useState([]);
  const navigate = useNavigate()

  const SendCon = async () => {
    axios.get(`http://localhost:3000/student/dashboard/${cookie.username}`) 
    .then((response) => {
      setAssignments(response.data); 

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

        <div id="scoreboardStud" >
            <table id='assignmentTable'>
              <thead>
                <tr>
                  <th>Quiz name</th>
                  <th>Due Date</th>
                  <th>Teacher's name</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {assigments.map((value) => {
                  return <ShowAssignments key={value._id} data={value} cookie={cookie}/>
                })}
              </tbody>  
            </table>
        </div>

        <div id='Sub'>
          <div className='box' id="quizStud" >
            <img src={quizicon} id="quizicon"/>
            <p>Quiz</p>
          </div>

          <div className='box' id="profileStud" >
            <img src={proficon} id="proficon"/>
            <p>Profile</p>
          </div>

        </div>
    </div>
  </>
  )
}

export default StudentDashboard