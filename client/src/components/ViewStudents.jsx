import axios from 'axios'
import React, { useEffect, useState } from 'react'
import StudentRow from './Builder/StudentRow'
import '../css/ViewStudent.css'

export const ViewStudents = ({cookie}) => {
    const [studentData, setStudentData] = useState([]);
    const [message, setMessage] = useState('No Students added!')

    const remove = (userID, element) =>{
        axios.post('http://localhost:3000/teacher/removestudent/', {data: userID, cookie: cookie})
        .then(function(response) {            
            element.remove()
            console.log(response)

        })
        .catch(function(error) {
            console.log(error.message)
        })
    }

    const students = () =>{
        axios.get('http://localhost:3000/teacher/viewstudents/' + cookie.user.username, {cookie: cookie})
        .then(function(response) {
            console.log(response.data)
            setStudentData(response.data)

            if((response.data).length !== 0){
                setMessage('')
            }

        })
        .catch(function(error) {
            console.log(error.message)
            setStudentData([]);
        })
    }

    useEffect( () => {
        students()
    }, [])


  return (
    <div id='ViewStudentMain'>
        <div id='SubMain'>
            <table>
            <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
            </thead>
                <tbody>
                    {studentData.map((value, i) => {
                        return <StudentRow key={i} data={value} OnRemove={remove}/>
                    })}
                </tbody>
            </table>

            <p>{message}</p>
        </div>
    </div>
  )
}
