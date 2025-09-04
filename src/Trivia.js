import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Trivia() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTrivia();
  }, [navigate]);

  const fetchTrivia = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
      const data = await res.json();
      setQuestions(data.results); // Store the trivia questions in state
    } catch (err) {
      setError("Error fetching trivia questions: " + err.message);
      console.error("Error fetching trivia:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    // Check if the selected answer is correct
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
    
    // Move to the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);  // Reset selected answer
  };

  const handleFinishQuiz = () => {
    // Handle end of quiz (Show score)
    alert(`Quiz finished! Your score: ${score} / ${questions.length}`);
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>🎉 Trivia Quiz</h1>

      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

      {loading ? (
        <p>Loading trivia questions...</p>
      ) : (
        <div>
          {currentQuestionIndex < questions.length ? (
            <div>
              <h2>{questions[currentQuestionIndex].question}</h2>
              <div>
                {questions[currentQuestionIndex].incorrect_answers
                  .concat(questions[currentQuestionIndex].correct_answer) // Combine correct and incorrect answers
                  .sort(() => Math.random() - 0.5) // Shuffle answers
                  .map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(answer)}
                      style={{
                        display: "block",
                        margin: "10px auto",
                        padding: "10px 20px",
                        backgroundColor: selectedAnswer === answer ? "#007bff" : "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {answer}
                    </button>
                  ))}
              </div>
              <button
                onClick={handleNextQuestion}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Next Question
              </button>
            </div>
          ) : (
            <div>
              <h2>Quiz Over!</h2>
              <p>Your score: {score} / {questions.length}</p>
              <button
                onClick={handleFinishQuiz}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Finish Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
