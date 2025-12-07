import React, { useState, useCallback } from "react";
import QuestionForm from "./QuestionForm";
import PDFUpload from "./PDFUpload";
import { ListPlus, Send, X, CheckCircle, LogOut, LayoutDashboard, BookOpen, Trophy, User, AlertCircle, FileText } from "lucide-react";

// Initial data structures
const initialQuestion = {
  question: "",
  options: { A: "", B: "", C: "", D: "" },
  correctAnswer: "A",
};

const initialSetMetadata = {
  class: "",
  lessonName: "",
  subjectName: "",
};

// Main Question Set Creation Page
function CreateQuestionSet({ setView, onLogout }) {
  const [metadata, setMetadata] = useState(initialSetMetadata);
  const [questions, setQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("manual"); // "manual" or "pdf"

  // Updates the Class, Lesson, Subject fields
  const handleMetadataChange = useCallback((e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Updates metadata for PDF upload
  const handlePDFMetadataChange = useCallback((e) => {
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

  // Handle questions generated from PDF
  const handleQuestionsGenerated = useCallback((generatedQuestions) => {
    setQuestions(generatedQuestions);
    setActiveTab("manual"); // Switch to manual tab to show the generated questions
  }, []);

  // Adds a new blank question form
  const addNewQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, initialQuestion]);
  }, []);

  // Handles switching to manual tab
  const handleManualTabClick = useCallback(() => {
    setActiveTab("manual");
    // Only add initial question if there are truly no questions at all, not even from PDF upload
    if (questions.length === 0) {
      setQuestions([initialQuestion]);
    }
  }, [questions.length]);

  // Removes a question form by index
  const removeQuestion = useCallback((indexToRemove) => {
    setQuestions((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // Function to create a subject if it doesn't exist
  const createSubject = async (subjectId, title) => {
    try {
      const response = await fetch('https://web-tech-team-egg-toast.onrender.com/subject/create/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId,
          title
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating subject:', errorData.detail);
        // If the error is because subject already exists, that's fine
        if (errorData.detail && errorData.detail.includes('already exists')) {
          return { success: true, message: 'Subject already exists' };
        }
        throw new Error(errorData.detail || 'Failed to create subject');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error in createSubject:', error);
      throw error;
    }
  };

  // Function to add a lesson to a subject
  const addLesson = async (subjectId, lessonData) => {
    try {
      const response = await fetch(`https://web-tech-team-egg-toast.onrender.com/subject/update/subjects/${subjectId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add lesson');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error in addLesson:', error);
      throw error;
    }
  };

  // Function to add a question to a lesson
  const addQuestion = async (subjectId, lessonIndex, questionData) => {
    try {
      const response = await fetch(`https://web-tech-team-egg-toast.onrender.com/question/update/subjects/${subjectId}/lessons/${lessonIndex}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add question');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error in addQuestion:', error);
      throw error;
    }
  };

  // Submit the form to save to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // First, create the subject with subjectId as the subject name
      await createSubject(metadata.subjectName, metadata.subjectName);

      // Create lesson data using the metadata
      const lessonData = {
        title: metadata.lessonName,
        questions: [], // We'll add questions one by one later
        classLevel: metadata.class
      };

      // Add the lesson to the subject
      const lessonResult = await addLesson(metadata.subjectName, lessonData);
      const lessonIndex = lessonResult.data.lesson_index; // Get the index of the newly created lesson

      // Add each question to the lesson
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // Convert the options to the format expected by the backend
        const questionData = {
          question: question.question,
          options: [
            question.options.A,
            question.options.B,
            question.options.C,
            question.options.D
          ],
          answer: question.correctAnswer // Backend expects the correct answer as a string
        };

        await addQuestion(metadata.subjectName, lessonIndex, questionData);
      }

      console.log(`Successfully saved ${questions.length} questions for ${metadata.subjectName} - ${metadata.lessonName} at lesson index ${lessonIndex}.`);

      setIsSubmitted(true);
      setTimeout(() => {
        // Clear the form and return to the dashboard after a short delay
        setMetadata(initialSetMetadata);
        setQuestions([]);
        setIsSubmitted(false);
        setIsSubmitting(false);
        setView("dashboard");
      }, 3000);
    } catch (error) {
      console.error('Error saving question set:', error);
      setError(error.message || 'An error occurred while saving the question set');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header with company name and logout button */}
        <div className="bg-red-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Tik Tik</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm opacity-80">Teacher Portal</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-white p-6">
          <CheckCircle className="w-20 h-20 text-red-500 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Set Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Returning to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with company name and navigation */}
      <div className="bg-red-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Tik Tik</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView("dashboard")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("lessonHistory")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Lesson History"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("leaderboard")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Leaderboard"
            >
              <Trophy className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("profile")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Profile"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2 border-red-600">
          Create New Question Set
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs for Manual vs PDF Upload */}
        <div className="mb-6 flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "manual"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={handleManualTabClick}
          >
            Manual Entry
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "pdf"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pdf")}
          >
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Upload PDF
            </span>
          </button>
        </div>

        {/* PDF Upload Section - Show only when activeTab is "pdf" */}
        {activeTab === "pdf" && (
          <PDFUpload
            onQuestionsGenerated={handleQuestionsGenerated}
            metadata={metadata}
            onMetadataChange={handlePDFMetadataChange}
          />
        )}

        {/* Manual Entry Section - Show only when activeTab is "manual" */}
        {activeTab === "manual" && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-red-600">Set Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                name="class"
                value={metadata.class}
                onChange={handleMetadataChange}
                placeholder="Class (e.g., 9, 10, XII)"
                className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
              <input
                type="text"
                name="subjectName"
                value={metadata.subjectName}
                onChange={handleMetadataChange}
                placeholder="Subject Name (e.g., Physics)"
                className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
              <input
                type="text"
                name="lessonName"
                value={metadata.lessonName}
                onChange={handleMetadataChange}
                placeholder="Lesson Name (e.g., Electromagnetism)"
                className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Question Forms - Show only when in manual mode */}
          {activeTab === "manual" && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-red-600">Questions</h2>
              {questions.map((q, index) => (
                <QuestionForm
                  key={index}
                  index={index}
                  questionData={q}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                />
              ))}
            </>
          )}

          {/* Action Buttons - Show only when in manual mode */}
          {activeTab === "manual" && (
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={addNewQuestion}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                <ListPlus className="w-5 h-5" />
                <span>Add New Question</span>
              </button>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setView("dashboard")}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={questions.length === 0 || isSubmitting || !metadata.class || !metadata.subjectName || !metadata.lessonName}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Done (Save Set)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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
    </div>
  );
}

export default CreateQuestionSet;