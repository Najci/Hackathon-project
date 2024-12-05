import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'

import proficon from '../assets/profileicon.png'
import quizicon from '../assets/quiz.png'
import addicon from '../assets/add.png'
import viewicon from '../assets/view.png'
import assignicon from '../assets/assign.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ShowAssignments from './Builder/ShowAssignments'

const StudentDashboard = ({cookie}) => {
  const [assigments, setAssignments] = useState([]);
  const [message, setMessage] = useState('No assignments due!')
  const navigate = useNavigate()

  const SendCon = async () => {
    axios.get(`http://localhost:3000/student/dashboard/${cookie.username}`) 
    .then((response) => {
      setAssignments(response.data); 

      if((response.data).length !== 0){
        setMessage('')
      }
    })
    .catch((error) => {
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
            <p id='StudDashMess'>{message}</p>
        </div>

        <div id='Sub'>
          <div className='box' id="quizStud" >
          <Link to={`/student/pastassignments/${cookie.username}`}>
            <img src={quizicon} id="quizicon"/>
            <p>Quiz</p>
          </Link>
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