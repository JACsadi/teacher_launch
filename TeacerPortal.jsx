import React, { useState, useCallback } from "react";
import {
  Plus,
  X,
  ListPlus,
  Send,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react";

// --- INITIAL DATA STRUCTURES ---

// Define the initial structure for a single question
const initialQuestion = {
  question: "",
  options: { A: "", B: "", C: "", D: "" },
  correctAnswer: "A",
};

// Define the initial structure for the entire question set metadata
const initialSetMetadata = {
  class: "",
  lessonName: "",
  subjectName: "",
};

// --- COMPONENTS ---

// Component for creating a single MCQ question
function QuestionForm({ questionData, index, updateQuestion, removeQuestion }) {
  // Handler for text input changes (Question text and Options)
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "question") {
      updateQuestion(index, { ...questionData, question: value });
    } else {
      updateQuestion(index, {
        ...questionData,
        options: { ...questionData.options, [name]: value },
      });
    }
  };

  // Handler for correct answer selection
  const handleCorrectAnswerChange = (e) => {
    updateQuestion(index, { ...questionData, correctAnswer: e.target.value });
  };

  const optionsKeys = Object.keys(questionData.options);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-indigo-700">
          Question #{index + 1}
        </h3>
        <button
          onClick={() => removeQuestion(index)}
          className="p-2 text-red-500 hover:text-red-700 transition duration-150 bg-red-50 hover:bg-red-100 rounded-full"
          aria-label={`Remove Question ${index + 1}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Question Text Area */}
      <div className="mb-4">
        <label
          htmlFor={`question-${index}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Question Text
        </label>
        <textarea
          id={`question-${index}`}
          name="question"
          rows="2"
          value={questionData.question}
          onChange={handleTextChange}
          placeholder="Type the question here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        ></textarea>
      </div>

      {/* MCQ Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {optionsKeys.map((key) => (
          <div key={key}>
            <label
              htmlFor={`option-${index}-${key}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Option {key}
            </label>
            <input
              type="text"
              id={`option-${index}-${key}`}
              name={key}
              value={questionData.options[key]}
              onChange={handleTextChange}
              placeholder={`Enter option ${key} text`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        ))}
      </div>

      {/* Correct Answer Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer:
        </label>
        <div className="flex space-x-4">
          {optionsKeys.map((key) => (
            <label
              key={`correct-${index}-${key}`}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`correct-answer-${index}`}
                value={key}
                checked={questionData.correctAnswer === key}
                onChange={handleCorrectAnswerChange}
                className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500 transition duration-150"
              />
              <span className="text-gray-900 font-medium">Option {key}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Question Set Creation Page
function CreateQuestionSet({ setView }) {
  const [metadata, setMetadata] = useState(initialSetMetadata);
  const [questions, setQuestions] = useState([initialQuestion]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Updates the Class, Lesson, Subject fields
  const handleMetadataChange = useCallback((e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Updates a specific question object at a given index
  const updateQuestion = useCallback((index, newQuestionData) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = newQuestionData;
      return newQuestions;
    });
  }, []);

  // Adds a new blank question form
  const addNewQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, initialQuestion]);
  }, []);

  // Removes a question form by index
  const removeQuestion = useCallback((indexToRemove) => {
    setQuestions((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // Simulates the API call (using dummy data)
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalQuestionSet = {
      ...metadata,
      questions,
      creationTimestamp: new Date().toISOString(),
    };

    // --- DUMMY API CALL SIMULATION ---
    console.log("--- SIMULATING DATABASE SUBMISSION ---");
    console.log("Question Set to be saved:", finalQuestionSet);
    console.log(
      `Successfully prepared ${questions.length} questions for ${metadata.subjectName} - ${metadata.lessonName}.`
    );
    // --- END SIMULATION ---

    setIsSubmitted(true);
    setTimeout(() => {
      // Clear the form and return to the dashboard after a short delay
      setMetadata(initialSetMetadata);
      setQuestions([initialQuestion]);
      setIsSubmitted(false);
      setView("dashboard");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-gray-50 p-6">
        <CheckCircle className="w-20 h-20 text-green-500 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Set Submitted Successfully!
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Returning to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        Create New Question Set
      </h1>

      {/* Metadata Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Set Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="class"
            value={metadata.class}
            onChange={handleMetadataChange}
            placeholder="Class (e.g., 9, 10, XII)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="text"
            name="subjectName"
            value={metadata.subjectName}
            onChange={handleMetadataChange}
            placeholder="Subject Name (e.g., Physics)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="text"
            name="lessonName"
            value={metadata.lessonName}
            onChange={handleMetadataChange}
            placeholder="Lesson Name (e.g., Electromagnetism)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Question Forms */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Questions</h2>
        {questions.map((q, index) => (
          <QuestionForm
            key={index}
            index={index}
            questionData={q}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
          />
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={addNewQuestion}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ListPlus className="w-5 h-5" />
            <span>Add New Question</span>
          </button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setView("dashboard")}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={questions.length === 0}
            >
              <Send className="w-5 h-5" />
              <span>Done (Save Set)</span>
            </button>
          </div>
        </div>
      </form>

      {/* Back to Top for long forms */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-3 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Teacher Dashboard
function Dashboard({ setView }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center space-x-4 mb-8 border-b pb-4">
          <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Teacher's Portal Dashboard
          </h1>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Welcome back! Use the button below to start creating a new assessment
          for your students.
        </p>

        <button
          onClick={() => setView("create")}
          className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-indigo-600 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <Plus className="w-6 h-6" />
          <span>Create New Question Set</span>
        </button>

        <div className="mt-12 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Note:</span> This is a front-end
            demonstration. The "Done" button will log the final data to the
            console instead of sending it to a live database.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APPLICATION ---
function App() {
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'create'

  return (
    <div className="font-sans antialiased">
      {view === "dashboard" && <Dashboard setView={setView} />}
      {view === "create" && <CreateQuestionSet setView={setView} />}
    </div>
  );
}

export default App;
