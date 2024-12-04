import React, { useEffect } from 'react'
import '../../css/Header.css'
import { Link, useNavigate } from 'react-router-dom'
import TeacherHeader from './TeacherHeader'
import { StudentHeader } from './StudentHeader'

const MainHeader = ({user, LogOut}) => {
  const navigate = useNavigate()

  if (user){
    if (user.role === "teacher"){
        return <TeacherHeader LogOut={LogOut}/>
    }
    else if (user.role === "student"){
        return <StudentHeader LogOut={LogOut}/>
    }
  }
  else{
    return (
        <header>
        <h1><b>EduSphinx</b></h1>
    
            <nav>
                <Link to='/login'  style={{textDecoration: 'none'}}><div className='nav-Link'>Login</div></Link>
                <Link to='/signup'  style={{textDecoration: 'none'}}><div className='nav-Link'>Sign up</div></Link>
                <Link to='/aboutus' style={{textDecoration: 'none'}}><div className='nav-Link'>About us</div></Link>
            </nav>

            <div id='Logout'></div> 
        </header>
    )  
  }
}

export default MainHeader