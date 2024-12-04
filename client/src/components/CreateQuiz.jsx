import { useState } from "react";
import "../css/CreateQuiz.css";
import axios from 'axios';

function CreateQuiz({cookie}) {
  const [wrappers, setWrappers] = useState([0]);
  const [quizData, setQuizData] = useState([]); 
  const [counter, setCounter] = useState(0)

  const addWrapper = () => {
    setCounter(counter+1)
    setWrappers([...wrappers, wrappers.length]); 
  };

  const deleteWrapper = (indexToDelete) => {
    setWrappers(wrappers.filter((_, index) => index !== indexToDelete)); 
  };

  const resetQuiz = () => {
    setWrappers([0]); 
    setQuizData([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target); 
    const formData = Object.fromEntries(form.entries())

    axios.post('http://localhost:3000/teacher/createquiz', {data: formData, cookie : cookie})
    .then(function(response) {
        console.log(response.data)
    })
  }
 

  return (
    <form id="mainQuiz" onSubmit={handleSubmit}>
      <div id="SubMainQuiz">
        {wrappers.map((_, index) => (
          <div id="wrapperQuiz" key={index}>
            <button
              className="delete-btnQuiz"
              onClick={() => deleteWrapper(index)}
              title="Delete Question"
            ></button>
            <span>Enter Quiz name:</span>
            <input type="text" name="name" className="inpQuiz" placeholder="Quiz Name" />
            <span>Select Quiz subject:</span>
            <select name="subject" className="subQuiz">
              <option value="Mathematics">Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>Biology</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Computing</option>
              <option>History</option>
              <option>Geography</option>
              <option>Health</option>
              <option>Other</option>
            </select>
            <span>Enter the Question:</span>
            <input
              type="text"
              name={`question[${counter}]`}
              className="inpQuiz"
              placeholder="Type your question"
            />
            <div id="radio">
              {["A", "B", "C", "D"].map((option, i) => (
                <div key={i} className="answer-option">
                  <input type="radio" name={`question[${counter}][${i}]["isCorrect"]`} />
                  <label>{option}.</label>
                  <input
                    type="text"
                    name={`question[${counter}][${i}]["answerText"]`}
                    className="inpQuiz"
                    placeholder={`Answer ${option}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
        <div id="buttons-containerQuiz">
            <button id="resQuiz" onClick={resetQuiz}>
            Reset
            </button>
            <button id="addQuiz" onClick={addWrapper} title="Add Question"></button>
            <input type="submit" id="submitQuiz" />
        </div>
    </form>
  );
}

export default CreateQuiz;
