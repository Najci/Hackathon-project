import React, { useEffect } from 'react'
import '../../css/Header.css'
import { Link, useNavigate } from 'react-router-dom'
import TeacherHeader from './TeacherHeader'
import { StudentHeader } from './StudentHeader'

const MainHeader = ({cookie, LogOut}) => {
  const navigate = useNavigate()

  if (cookie){
    if (cookie.role === "teacher"){
        return <TeacherHeader cookie={cookie} LogOut={LogOut}/>
    }
    else if (cookie.role === "student"){
        return <StudentHeader cookie={cookie} LogOut={LogOut}/>
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