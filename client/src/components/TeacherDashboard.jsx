import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'

import proficon from '../assets/profileicon.png'
import quizicon from '../assets/quiz.png'
import addicon from '../assets/add.png'
import viewicon from '../assets/view.png'
import assignicon from '../assets/assign.png'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import ShowScore from './Builder/ShowScore'
import OptionAssignDashTeach from './Builder/OptionAssignDashTeach'

const TeacherDashboard = ({cookie}) => {
  const navigate = useNavigate()
  const [data, setData] = useState([{quizName:'',students: []}]);
  const [selectView, setSelectView] = useState(0)

  const SendCon = async () => {
    axios.get(`http://localhost:3000/teacher/dashboard/${cookie.username}`) 
    .then((response) => {
      console.log(response.data)
      setData(response.data)
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

        <div id='ScoreSec'>
          <select name="" defaultValue="Def" id="OptionScoreSec" onSelect={(e) => {setSelectView(e.target.value)}}>
            <option value="Def" disabled>Select an assignment</option>
            {data.map((value, index)=> {
                return <OptionAssignDashTeach key={index} index={index} data={value.quizName} />
            })}
          </select>
  
          <div id="scoreboard">
            <table>
              <thead>
                <th>Student's name</th>
                <th>Username</th>
                <th>Score</th>
              </thead>
              <tbody>
                {data[selectView]?.students?.map((value, index) => {
                  return <ShowScore key={index} data={value} />
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div id='Sub'>
          <div className='box' id="profile" >
            <Link to={`teacher/profile/${cookie.username}`} style={{textDecoration: 'none'}}>
              <img src={proficon} id="proficon"/>
              <p>Profile</p>
            </Link>
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