import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Leaderboard from '../components/leader'; 

const QuizPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userScore, setUserScore] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const auth = getAuth();

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Shakespeare", "Hemingway", "Tolstoy", "Dickens"],
      correctAnswer: "Shakespeare"
    },
    {
      question: "Which gas makes up the majority of the Earth's atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correctAnswer: "Nitrogen"
    },
    {
      question: "Which country is home to the Great Barrier Reef?",
      options: ["New Zealand", "Indonesia", "Australia", "Philippines"],
      correctAnswer: "Australia"
    },
    {
      question: "Which element has the atomic number 1?",
      options: ["Hydrogen", "Helium", "Carbon", "Nitrogen"],
      correctAnswer: "Hydrogen"
    },
    {
      question: "Who is the author of 'The Catcher in the Rye'?",
      options: ["J.D. Salinger", "F. Scott Fitzgerald", "Ernest Hemingway", "Harper Lee"],
      correctAnswer: "J.D. Salinger"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "G", "Go"],
      correctAnswer: "Au"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Venus", "Jupiter", "Mercury"],
      correctAnswer: "Mars"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci"
    },
    {
      question: "What is the tallest mammal in the world?",
      options: ["Giraffe", "Elephant", "Hippopotamus", "Rhino"],
      correctAnswer: "Giraffe"
    },
    {
      question: "Who discovered penicillin?",
      options: ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Albert Einstein"],
      correctAnswer: "Alexander Fleming"
    },
    {
      question: "What is the largest organ in the human body?",
      options: ["Skin", "Heart", "Liver", "Brain"],
      correctAnswer: "Skin"
    },
    {
      question: "Which bird is often associated with delivering babies?",
      options: ["Stork", "Pigeon", "Sparrow", "Robin"],
      correctAnswer: "Stork"
    },
    {
      question: "Who is known as the father of modern physics?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"],
      correctAnswer: "Albert Einstein"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      question: "What is the smallest bone in the human body?",
      options: ["Stapes", "Femur", "Tibia", "Fibula"],
      correctAnswer: "Stapes"
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["Japan", "China", "South Korea", "Vietnam"],
      correctAnswer: "Japan"
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "O2", "H2SO4"],
      correctAnswer: "H2O"
    },
    {
      question: "Which scientist proposed the theory of relativity?",
      options: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Galileo Galilei"],
      correctAnswer: "Albert Einstein"
    },
    {
      question: "What is the capital of Canada?",
      options: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
      correctAnswer: "Ottawa"
    },

  ];

  const shuffleQuestions = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleStartQuiz = () => {
    const shuffledQuestionsArray = shuffleQuestions(questions);
    const selectedQuestions = shuffledQuestionsArray.slice(0, 5);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setShuffledQuestions(selectedQuestions);
  };

  const handleOptionSelect = (index) => {
    const correctAnswerIndex = shuffledQuestions[currentQuestionIndex].options.findIndex(
      (option) => option === shuffledQuestions[currentQuestionIndex].correctAnswer
    );
    setSelectedOptionIndex(index);
    const buttons = document.querySelectorAll('.quiz-option');
    buttons.forEach((button, i) => {
      if (i === index) {
        button.style.backgroundColor = index === correctAnswerIndex ? 'green' : 'red';
      } else if (i === correctAnswerIndex) {
        button.style.backgroundColor = 'green';
      } else {
        button.style.backgroundColor = 'initial';
      }
    });
  };

  const handleNextQuestion = () => {
    const correctAnswerIndex = shuffledQuestions[currentQuestionIndex].options.findIndex(
      (option) => option === shuffledQuestions[currentQuestionIndex].correctAnswer
    );
  
    if (selectedOptionIndex !== null && selectedOptionIndex === correctAnswerIndex) {
      setScore(score + 1);
    }
  
    setSelectedOptionIndex(null);
  
    const buttons = document.querySelectorAll('.quiz-option');
    buttons.forEach((button) => {
      button.style.backgroundColor = '#3B82F6';
    });
  
    if (currentQuestionIndex + 1 === shuffledQuestions.length) {
      const newScore = score + (selectedOptionIndex === correctAnswerIndex ? 1 : 0);
      const rank = calculateRank(newScore);
      setHighScores((prevHighScores) => [
        ...prevHighScores,
        { rank, name: username, score: newScore }
      ].sort((a, b) => b.score - a.score));
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateRank = (newScore) => {
    let rank = 1;
    for (const item of highScores) {
      if (item.score > newScore) {
        rank++;
      } else if (item.score === newScore) {
        // Do nothing, keep the same rank
      } else {
        break;
      }
    }
    return rank;
  };

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const userName = userEmail.substring(0, userEmail.indexOf('@'));
        setUsername(userName);
        const scoresRef = collection(db, 'scores');
        const userQuery = query(scoresRef, where("username", "==", userName));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userScoreData = querySnapshot.docs[0].data().score;
          setUserScore(userScoreData);
        } else {
          setUserScore(0);
        }
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleQuit = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
  };

  const handleViewProfile = () => {
    navigate('/quiz/profile');
  };

  const handleConfirmSignOut = () => {
    handleSignOut();
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  const signOutConfirmationModal = (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-lg font-semibold mb-4">Are you sure you want to sign out?</p>
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-300 rounded-lg mr-4 hover:bg-gray-400"
            onClick={() => setShowSignOutConfirmation(false)}
          >
            No
          </button>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={handleConfirmSignOut}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex flex-col justify-center items-center">
      {!quizStarted && (
        <div className="flex justify-center items-center w-1/2">
          <img src="/images/quizlogo.png" alt=""/>
        </div>
      )}
      {!quizStarted ? (
        <button 
          className="py-3 px-6 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out mt--10"
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>
      ) : (
        <>
          {quizCompleted ? (
            <div className="text-center">
              <div className="border-2 border-purple-300 bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">Quiz Completed!</h2>
                <p className="mb-6 text-lg font-bold text-green-500">Your Score: {score} / {shuffledQuestions.length}</p>
                <button 
                  className="py-3 px-6 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  onClick={handleQuit}
                >
                  Restart Quiz
                </button>
                <button 
                  className="ml-4 py-3 px-6 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out"
                  onClick={handleStartQuiz}
                >
                  Quit
                </button>
              </div>
              <div className="mt-4">
                <div className="border-2 border-purple-300 bg-white rounded-lg p-6 mb-6">
                  <Leaderboard highScores={highScores} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-2 border-purple-300 bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">Question {currentQuestionIndex + 1}</h2>
                <p className="mb-6 text-lg text-gray-800">{shuffledQuestions[currentQuestionIndex].question}</p>
                <ul>
                  {shuffledQuestions[currentQuestionIndex].options.map((option, index) => (
                    <li key={index}>
                      <button 
                        className={`w-full py-3 px-6 mb-4 rounded-full quiz-option ${
                          selectedOptionIndex === index ? 'bg-yellow-400' : 'bg-blue-500'
                        } text-white font-bold shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out`}
                        onClick={() => handleOptionSelect(index)}
                        disabled={selectedOptionIndex !== null}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
                {selectedOptionIndex !== null && (
                  <button 
                    className="mt-4 py-3 px-6 rounded-full bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </button>
                )}
              </div>
              <div>
                <button 
                  className="py-3 px-6 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  onClick={handleViewProfile}
                >
                  View Profile
                </button>
                {showSignOutConfirmation && signOutConfirmationModal}
                <button 
                  className="ml-4 py-3 px-6 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out"
                  onClick={() => setShowSignOutConfirmation(true)}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
