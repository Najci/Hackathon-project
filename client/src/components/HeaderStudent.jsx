import React from 'react'
import '../css/Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header>
       <h1><b>EduSphinx</b></h1>

        <nav>
          <Link to='/dashboard' style={{textDecoration: 'none'}}><div className='nav-Link'>Dashboard</div></Link>
          <Link  style={{textDecoration: 'none'}}><div className='nav-Link'>Profile</div></Link>
          <Link  style={{textDecoration: 'none'}}><div className='nav-Link'>About us</div></Link>
        </nav>

    </header>
  )
}

export default Header