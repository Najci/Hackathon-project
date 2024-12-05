import React from 'react'
import {format} from 'date-fns';
import { Link } from 'react-router-dom';

const ShowAssignments = ({data, cookie}) => {

    const today = new Date();
    const formattedDate = format(data.dueDate, 'yyyy-MM-dd'); 

  return (
    <tr>
        <td><Link to={`/student/${cookie.username}/assignment/${data._id}`}> {data.quizName} </Link></td>
        <td>{formattedDate}</td>
        <td>{data.teacherFirstName} {data.teacherLastName}</td>
        <td>{data.quizSubject}</td>
    </tr>
  )
}

export default ShowAssignments