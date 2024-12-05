import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../css/StudentQuiz.css'
import Questions from './Builder/Questions'
import { useNavigate } from 'react-router-dom'

const StudentQuiz = ({cookie, assignmentId}) => {

    const [data, setData] = useState({name:'', questions: []})
    const [formData, setFormData] = useState({});
    const navigate = useNavigate()

    const GetQuiz = () => {
        axios.get(`http://localhost:3000/student/${cookie.username}/assignment/${assignmentId}`)
        .then(function(response) {
            console.log(response.data.questions)
            setData(response.data)
        })
        .catch(function(error) {
            console.log(error.message)
        })
    }

    useEffect(() => {
        GetQuiz()
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const form = new FormData(e.target); 
        const formData = Object.fromEntries(form.entries());
    
        axios.post(`http://localhost:3000/student/${cookie.username}/assignment/${assignmentId}`, { data: formData, cookie })
        .then(function(response) {
            navigate(`/student/dashboard/${cookie.user.username}`)
            console.log(response.data);
        });
    };

    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
      };

  return (
    <form onSubmit={handleSubmit} id='mainStudQuiz'>

        <div id='StudQuizTitle'>
            <h1 id='QuitTitleStud'>{data.name}</h1>
        </div>

        {data.questions.map((value,i) => {
            return <Questions key={i} index={i} data={value} formData={formData} handleInputChange={handleInputChange} />
        })}

        <input id='SubmitQuizStud' type="submit" />
      
    </form>
  )
}

export default StudentQuiz