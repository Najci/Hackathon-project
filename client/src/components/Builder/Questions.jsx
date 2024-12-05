import React from 'react'

const Questions = ({index, data, formData, handleInputChange}) => {
    return (
        <div id="SubMainStudQuiz">
            <h2 id='QuestionQuiz'>{data.questionText}</h2>

            <div id="SelectionDivQuiz">
                    <div id='SubSelQuiz'>
                        {["A", "B"].map((option, i) => (
                        <div key={i} id="QuizAnswerSelect">
                        <div>
                            <label>{option}.</label>
                            <input
                                id='CheckQuiz'
                                type="checkbox"
                                name={`${data.answers[i]._id}`}
                                checked={formData[`${data.answers[i]._id}`] || false}
                                onChange={(e) =>
                                    handleInputChange({
                                    target: {
                                        name: `${data.answers[i]._id}`,
                                        value: e.target.checked,
                                    },
                                    })
                                }
                            />
                        </div>
                        <div>
                          <p>{data.answers[i].answerText}</p>
                        </div>
                      </div>
                        ))}
                    </div>
                    <div id='SubSelQuiz'>
                        {["C", "D"].map((option, i) => (
                        <div key={i} id="QuizAnswerSelect">
                        <div>
                            <label>{option}.</label>
                            <input
                                id='CheckQuiz'
                                type="checkbox"
                                name={`${data.answers[i+2]._id}`}
                                checked={formData[`${data.answers[i+2]._id}`] || false}
                                onChange={(e) =>
                                    handleInputChange({
                                    target: {
                                        name: `${data.answers[i+2]._id}`,
                                        value: e.target.checked,
                                    },
                                    })
                                }
                            />
                        </div>
                        <div>
                          <p>{data.answers[i+2].answerText}</p>
                        </div>
                      </div>
                        ))}
                    </div>
            </div>
        </div>
    )
}

export default Questions