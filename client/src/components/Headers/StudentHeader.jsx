import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const StudentHeader = ({LogOut}) => {
  const navigate = useNavigate()

  return (
    <header>
       <h1><b>EduSphinx</b></h1>

        <nav>
          <Link to='student/dashboard' style={{textDecoration: 'none'}}><div className='nav-Link'>Dashboard</div></Link>
          <Link to='/aboutus' style={{textDecoration: 'none'}}><div className='nav-Link'>About us</div></Link>
        </nav>

        <div id='Logout'>
          <button onClick={() => {LogOut(), navigate('/login')}}>Log out</button>
        </div>

    </header>
  )
}
