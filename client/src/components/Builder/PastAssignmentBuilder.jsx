import { format } from 'date-fns';
import React from 'react'

const PastAssignmentBuilder = ({data}) => {
;
    const formattedDate = format(data.dueDate, 'yyyy-MM-dd'); 

    return (
        <tr>
        <td>{data.quizName}</td>
        <td>{formattedDate}</td>
        <td>{data.score}</td>
        </tr>
    )
}

export default PastAssignmentBuilder