function parseQuizData(inputData){
    const result = {
        name: inputData.name,
        subject: inputData.subject,
        questions: []
      };
      
      const questionKeys = Object.keys(inputData).filter(key => key.startsWith('question['));
      
      const questionIndexSet = new Set();
      questionKeys.forEach(key => {
        const questionIndex = key.match(/\d+/)[0]; 
    
        if (!questionIndexSet.has(questionIndex)) {
          questionIndexSet.add(questionIndex);
          
          const question = {
            questionText: inputData[`question[${questionIndex}][questionText]`],
            answers: []
          };
      
          
          for (let j = 0; j < 4; j++) {
            const answer = {
              answerText: inputData[`question[${questionIndex}][answers][${j}][answerText]`],
              isCorrect: inputData[`question[${questionIndex}][answers][${j}][isCorrect]`] === 'on'
            };
            question.answers.push(answer);
          }
      
          result.questions.push(question);
        }
        
      });
    return result;
}
module.exports = parseQuizData; 