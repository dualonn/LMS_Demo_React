import {context} from "../context.jsx"
import {useContext, useState} from "react"
import './content.css'
import Nav from "../Nav/nav.jsx"

function Content() {
    const [show_block_edit, set_block_edit] = useState(false)
    const state = useContext(context)

    // Add state to track user answers and quiz results
    const [userAnswers, setUserAnswers] = useState({})
    const [quizResults, setQuizResults] = useState({})
    const [submitted, setSubmitted] = useState({})

    let content

    if (state.data) content = state.data[state.course].pages[state.page]

    // Handle input changes for different question types
    const handleInputChange = (quizIndex, questionIndex, value, answerIndex = null) => {
        const answerKey = `${quizIndex}-${questionIndex}`
        const newAnswers = {...userAnswers}

        if (answerIndex !== null) {
            // For multiple choice and true/false
            newAnswers[answerKey] = answerIndex
        } else {
            // For fill in the blank
            newAnswers[answerKey] = value
        }

        setUserAnswers(newAnswers)
    }

    // Submit all answers for a quiz
    const submitQuiz = (quiz, quizIndex) => {
        const results = {}
        let score = 0

        quiz.questions.forEach((question, questionIndex) => {
            const answerKey = `${quizIndex}-${questionIndex}`
            const userAnswer = userAnswers[answerKey]
            let isCorrect = false

            console.log(question)

            if (question.type === "multiple_choice") {
                isCorrect = userAnswer === question.correct_answer
            } else if (question.type === "true_false") {
                isCorrect = (userAnswer === 0 && question.correct_answer === true) ||
                    (userAnswer === 1 && question.correct_answer === false)
            } else if (question.type === "fill_blank") {
                isCorrect = userAnswer?.toLowerCase() === question.correct_answer.toLowerCase()
            }

            results[questionIndex] = {
                isCorrect,
                correctAnswer: question.correct_answer
            }

            if (isCorrect) score++
        })

        // Calculate percentage score
        const percentage = Math.round((score / quiz.questions.length) * 100)

        // Update results state
        const newResults = {...quizResults}
        newResults[quizIndex] = {
            questionResults: results,
            score: score,
            total: quiz.questions.length,
            percentage: percentage
        }
        setQuizResults(newResults)

        // Mark this quiz as submitted
        const newSubmitted = {...submitted}
        newSubmitted[quizIndex] = true
        setSubmitted(newSubmitted)
    }

    // Get the correct answer display text
    const getCorrectAnswerText = (question) => {
        if (question.type === "multiple_choice") {
            return question.answers[question.correct_answer]
        } else if (question.type === "true_false") {
            return question.correct_answer ? "True" : "False"
        } else {
            return question.correct_answer
        }
    }

    return (
        <div id='page_content'>
            {state.data ? <>
                <Nav />
                <div className="page_content">
                    {state.data[state.course].pages[state.page].blocks.map((block, index) => (
                        <div key={index} className="block">
                            <div className="block_title">{block.title}</div>
                            <div className="block_content">
                                {Array.isArray(block.content) && block.content[0]?.constructor?.name === 'Quiz' ? (
                                    // Render Quiz component
                                    <div className="quiz-container">
                                        {block.content.map((quiz, qIndex) => (
                                            <div key={qIndex} className="quiz">
                                                <h3>{quiz.name}</h3>
                                                {quiz.questions.map((question, quesIndex) => {
                                                    const answerKey = `${qIndex}-${quesIndex}`
                                                    const result = quizResults[qIndex]?.questionResults[quesIndex]

                                                    return (
                                                        <div key={quesIndex} className="question">
                                                            <p>{question.content}</p>
                                                            {question.type === "multiple_choice" && (
                                                                <ul>
                                                                    {question.answers.map((answer, aIndex) => (
                                                                        <li key={aIndex}>
                                                                            <input
                                                                                type="radio"
                                                                                name={`q${qIndex}-${quesIndex}`}
                                                                                id={`q${qIndex}-${quesIndex}a${aIndex}`}
                                                                                onChange={() => handleInputChange(qIndex, quesIndex, null, aIndex)}
                                                                                checked={userAnswers[answerKey] === aIndex}
                                                                                disabled={submitted[qIndex]}
                                                                            />
                                                                            <label htmlFor={`q${qIndex}-${quesIndex}a${aIndex}`}>{answer}</label>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                            {question.type === "true_false" && (
                                                                <div>
                                                                    <input
                                                                        type="radio"
                                                                        name={`q${qIndex}-${quesIndex}`}
                                                                        id={`q${qIndex}-${quesIndex}true`}
                                                                        onChange={() => handleInputChange(qIndex, quesIndex, null, 0)}
                                                                        checked={userAnswers[answerKey] === 0}
                                                                        disabled={submitted[qIndex]}
                                                                    />
                                                                    <label htmlFor={`q${qIndex}-${quesIndex}true`}>True</label>
                                                                    <input
                                                                        type="radio"
                                                                        name={`q${qIndex}-${quesIndex}`}
                                                                        id={`q${qIndex}-${quesIndex}false`}
                                                                        onChange={() => handleInputChange(qIndex, quesIndex, null, 1)}
                                                                        checked={userAnswers[answerKey] === 1}
                                                                        disabled={submitted[qIndex]}
                                                                    />
                                                                    <label htmlFor={`q${qIndex}-${quesIndex}false`}>False</label>
                                                                </div>
                                                            )}
                                                            {question.type === "fill_blank" && (
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Your answer"
                                                                        onChange={(e) => handleInputChange(qIndex, quesIndex, e.target.value)}
                                                                        value={userAnswers[answerKey] || ''}
                                                                        disabled={submitted[qIndex]}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Show feedback if this quiz has been submitted */}
                                                            {submitted[qIndex] && result && (
                                                                <div className={`feedback ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                                                    {result.isCorrect
                                                                        ? "Correct!"
                                                                        : `Incorrect. The correct answer is: ${getCorrectAnswerText(question)}`
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}

                                                {/* Single submit button for the entire quiz */}
                                                {!submitted[qIndex] ? (
                                                    <button
                                                        className="quiz-submit-btn"
                                                        onClick={() => submitQuiz(quiz, qIndex)}
                                                    >
                                                        Submit Quiz
                                                    </button>
                                                ) : (
                                                    <div className="quiz-result-summary">
                                                        <h4>Quiz Results</h4>
                                                        <p>Score: {quizResults[qIndex].score}/{quizResults[qIndex].total} ({quizResults[qIndex].percentage}%)</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // Render regular content
                                    block.content
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </> : null
            }
        </div>
    )
}
export default Content;