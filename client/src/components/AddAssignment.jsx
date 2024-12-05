import React, { useEffect, useState } from 'react'
import '../css/AddAssignment.css'
import axios from 'axios'
import StudentsAssign from './Builder/StudentsAssign'
import OptionAssign from './Builder/OptionAssign'

const AddAssignment = ({cookie}) => {

    const [quizzes, setQuizzes] = useState([])
    const [students, setStudents] = useState([])
    const [message, setMessage] = useState('')

    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleCheckboxChange = (_id, isChecked) => {
        setSelectedStudents((prev) => {
            const updated = { ...prev };
            if (isChecked) {
                updated[_id] = undefined;
            } else {
              delete updated[_id]; 
            }
            return updated;
          });
      };
      


    const GetReq = () => {
        axios.get(`http://localhost:3000/teacher/assign/${cookie.user.username}`)
        .then(function(response) {
            setQuizzes(response.data.quizzes)
            setStudents(response.data.students)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    
    useEffect(() => {
        GetReq()
    },[])

    const submit = (e) => {
        e.preventDefault();

        const form = new FormData(e.target); 
        const formData = Object.fromEntries(form.entries())

        formData.students = Object.keys(selectedStudents)
    
        axios.post('http://localhost:3000/teacher/assign', {data : formData, cookie})
        .then(function (response) {
            setMessage('Assignment has been sent')
    
        })
        .catch(function (error) {
            console.log(error.message)
            setMessage(error.message)
        });
    }

    return (
        <form onSubmit={submit} id='MainAssign'>
            <div id='SubMain'>
                <label htmlFor="options">Select quiz to assign:</label>
                <select name="quiz" id='options' defaultValue='default' >
                    <option value="default" disabled>Select Quiz</option>
                    {quizzes.map((value)=> {
                        return <OptionAssign key={value._id} data={value} />
                    })}
                </select>

                <div id='AssignS_T'>
                    <div id='SelectBoxAssign'>
                        <table id='AssignTable'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Last Naame</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((value) => {
                                    return <StudentsAssign key={value._id} data={value} onCheckboxChange={handleCheckboxChange} />
                                })}
                            </tbody>
                        </table>
    
                    </div>
                    
                    <div id='SubmitQuiz'>
                        <div>
                            <label htmlFor="AssignTime">Due Date:</label>
                            <input type="date" name="dueDate" id="AssignTime" />
                        </div>

                        <input type="submit" id='SubmitAssign' value="Submit/Send" />
                        <p>{message}</p>
                    </div>
                    
                </div>

            </div>
        </form>
    )
}

export default AddAssignment