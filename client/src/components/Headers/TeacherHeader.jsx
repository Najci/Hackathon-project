import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TeacherHeader = ({cookie, LogOut}) => {
    const navigate = useNavigate()

  return (
    <header>
       <h1><b>EduSphinx</b></h1>

        <nav>
            <Link to={`teacher/dashboard/${cookie.username}`} style={{textDecoration: 'none'}}><div className='nav-Link'>Dashboard</div></Link>
            <Link to='/aboutus' style={{textDecoration: 'none'}}><div className='nav-Link'>About us</div></Link>
        </nav>

        <div id='Logout'>
            <button onClick={() => {LogOut(), navigate('/')}}>Log out</button>
        </div>

    </header>
  )
}

export default TeacherHeader