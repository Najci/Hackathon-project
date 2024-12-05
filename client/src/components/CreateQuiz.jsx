import { useState } from "react";
import "../css/CreateQuiz.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function CreateQuiz({ cookie }) {
  const [wrappers, setWrappers] = useState([0]); 
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState('');

  const navigate = useNavigate()

  const addWrapper = () => {
    setWrappers([...wrappers, wrappers.length]);
  };

  const deleteWrapper = (indexToDelete) => {
    setWrappers(wrappers.filter((_, index) => index !== indexToDelete));
  };

  const resetQuiz = () => {
    setWrappers([0]); 
    setFormData([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target); 
    const formData = Object.fromEntries(form.entries());

    // Send all data as an object to the server
    axios.post('http://localhost:3000/teacher/createquiz', { data: formData, cookie })
    .then(function(response) {
        console.log(response.data);
    });

    navigate(`/teacher/dashboard/${cookie.user.username}`)
  };
  const handleAI = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading('Loading... please wait'); // Start loading
    resetQuiz(); // Clear the quiz first

    const topicInput = document.getElementById("aiInput").value;
    const promptData = { topic: topicInput };

    try {
      const response = await axios.post('http://localhost:3000/teacher/createquiz/ai', {
        data: promptData,
        cookie,
      });

      const questions = JSON.parse(response.data).questions;
      populateQuestions(questions); // Populate new questions after resetting
    } catch (err) {
      console.error("Error fetching AI questions:", err);
    } finally {
      setLoading('Finished'); // End loading
    }
  };

  const populateQuestions = (questions) => {
    const newWrappers = questions.map((_, index) => index); // Create wrappers based on number of questions
    setWrappers(newWrappers);

    // Generate formData structure for the new questions
    const newFormData = questions.reduce((data, question, index) => {
      data[`question[${index}][questionText]`] = question.questionText;
      question.answers.forEach((answer, i) => {
        data[`question[${index}][answers][${i}][answerText]`] = answer.answerText;
        data[`question[${index}][answers][${i}][isCorrect]`] = answer.isCorrect;
      });
      return data;
    }, {});

    setFormData(newFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <form id="mainQuiz" onSubmit={handleSubmit}>
        <span>Enter Quiz name:</span>
        <input
          type="text"
          name="name"
          className="inpQuiz"
          placeholder="Quiz Name"
          onChange={handleInputChange}
          value={formData.name || ""}
        />

        <span>Select Quiz subject:</span>
        <select
          name="subject"
          className="subQuiz"
          onChange={handleInputChange}
          value={formData.subject || ""}
          id="SelQuiz"
        >
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

        <div id="ai">
          <label htmlFor="aiInput">Input AI topic:</label>
          <input type="text" id="aiInput" name="topic" placeholder="Input prompt"></input>
          <p>{loading}</p>
        </div>
          <button id="AiButton" type="button" onClick={handleAI}>Submit AI Prompt</button>

        <div id="SubMainQuiz">
          {wrappers.map((_, index) => (
            <div id="wrapperQuiz" key={index}>
              <button type="button"
              className="delete-btnQuiz"
              onClick={() => deleteWrapper(index)}
              title="Delete Question"
            ></button>
              <span>Enter the Question:</span>
              <input
                type="text"
                name={`question[${index}][questionText]`}
                className="inpQuiz"
                placeholder="Type your question"
                onChange={handleInputChange}
                value={formData[`question[${index}][questionText]`] || ""}
              />
              <div id="radio">
                {["A", "B", "C", "D"].map((option, i) => (
                  <div key={i} className="answer-option">
                    <input
                      type="checkbox"
                      name={`question[${index}][answers][${i}][isCorrect]`}
                      checked={formData[`question[${index}][answers][${i}][isCorrect]`] || false}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: `question[${index}][answers][${i}][isCorrect]`,
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <label>{option}.</label>
                    <input
                      type="text"
                      name={`question[${index}][answers][${i}][answerText]`}
                      className="inpQuiz"
                      placeholder={`Answer ${option}`}
                      onChange={handleInputChange}
                      value={formData[`question[${index}][answers][${i}][answerText]`] || ""}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div id="buttons-containerQuiz">
        <button type="button" id="resQuiz" onClick={resetQuiz}>
          Reset
        </button>
        <button type="button" id="addQuiz" onClick={addWrapper} title="Add Question"></button>
        <input type="submit" id="submitQuiz" />
      </div>
      </form>
    </>
  );
}

export default CreateQuiz;
