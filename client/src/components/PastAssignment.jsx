import React, { useEffect, useState } from 'react'
import '../css/PassAssignment.css'
import axios from 'axios'
import PastAssignmentBuilder from './Builder/PastAssignmentBuilder'

const PastAssignment = ({cookie}) => {
    const [data, setData] = useState([])
    const [message, setMessage] = useState('No past quizzes')

    const GetPastAssignments = () => {
        axios.get(`http://localhost:3000/student/pastassignments/${cookie.username}`)
        .then(function(response) {
            console.log(response.data)
            setData(response.data)

            if((response.data).length !== 0){
                setMessage('')
            }
        })
        .catch(function(error) {
            console.log(error.message)
        })
    }

    useEffect(() => {
        GetPastAssignments()
    },[])

  return (
    <div id='PastAssignmentsMain'>
        <div id='SubMain'>
            <table>
            <thead>
                    <tr>
                        <th>Quiz Name</th>
                        <th>Due Date</th>
                        <th>Score</th>
                    </tr>
            </thead>
                <tbody>
                    {data.map((value, i) => {
                        return <PastAssignmentBuilder key={i} data={value} />
                    })}
                </tbody>
            </table>

            <p>{message}</p>
        </div>
    </div>
  )
}

export default PastAssignment