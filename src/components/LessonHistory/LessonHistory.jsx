import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Users, FileText, LogOut, LayoutDashboard, Trophy, User, Plus, ArrowLeft, Eye, X } from "lucide-react";

// Component to display lesson history
function LessonHistory({ setView, onLogout }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null); // To display questions for a specific lesson
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Function to fetch lessons for a specific subject
  const fetchSubjectLessons = async (subjectId) => {
    try {
      const response = await fetch(`https://web-tech-team-egg-toast.onrender.com/subject/update/subjects/${subjectId}/lessons`);
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons for subject ${subjectId}`);
      }
      const data = await response.json();
      return data.lessons.map((lesson, index) => ({
        id: `${subjectId}-${index}`, // Create a unique ID
        subjectName: subjectId,
        lessonName: lesson.title,
        className: lesson.classLevel || "N/A", // Use classLevel from the lesson object
        dateCreated: lesson.createdAt || new Date().toISOString().split('T')[0], // Use createdAt or current date
        questionCount: lesson.questions ? lesson.questions.length : 0,
        studentCount: 0, // Placeholder - not available from current backend
        averageScore: 0, // Placeholder - not available from current backend
        subjectId: subjectId,
        lessonIndex: index
      }));
    } catch (error) {
      console.error("Error fetching subject lessons:", error);
      return [];
    }
  };

  // Function to fetch all subjects to get their lessons
  const fetchAllLessons = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all subjects first
      const subjectsResponse = await fetch('https://web-tech-team-egg-toast.onrender.com/subject/create/subjects');
      if (!subjectsResponse.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const subjectsData = await subjectsResponse.json();
      const subjects = subjectsData.subjects;

      let allLessons = [];

      // For each subject, fetch its lessons
      for (const subject of subjects) {
        const subjectLessons = await fetchSubjectLessons(subject.subjectId);
        // Add subject title to each lesson
        const lessonsWithSubject = subjectLessons.map(lesson => ({
          ...lesson,
          subjectName: subject.title || subject.subjectId
        }));
        allLessons = [...allLessons, ...lessonsWithSubject];
      }

      setLessons(allLessons);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lessons when component mounts
  useEffect(() => {
    fetchAllLessons();
  }, []);

  // Function to fetch questions for a specific lesson
  const fetchQuestionsForLesson = async (subjectId, lessonIndex) => {
    setQuestionsLoading(true);
    try {
      const response = await fetch(`https://web-tech-team-egg-toast.onrender.com/question/update/subjects/${subjectId}/lessons/${lessonIndex}/questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      setError(error.message);
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Handle lesson click to show questions
  const handleLessonClick = async (lesson) => {
    await fetchQuestionsForLesson(lesson.subjectId, lesson.lessonIndex);
    setSelectedLesson(lesson);
  };

  // Handle going back to lesson list view
  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setQuestions([]);
  };

  if (loading && !selectedLesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    // View to show questions for the selected lesson
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
                onClick={handleBackToLessons}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
                title="Back to Lessons"
              >
                <ArrowLeft className="w-4 h-4" />
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

        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToLessons}
              className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 mr-4"
              title="Back to Lessons"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedLesson.lessonName}</h1>
              <p className="text-gray-600">{selectedLesson.subjectName} • {selectedLesson.className}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-red-600">
              Questions ({questions.length})
            </h2>

            {questionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This lesson has no questions. Add questions to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-3">
                      <span className="font-medium text-gray-700">Q{index + 1}: </span>
                      <span className="text-gray-900">{question.question}</span>
                    </div>

                    <div className="space-y-2 ml-4">
                      {question.options.map((option, optionIndex) => {
                        // Determine if this option is the correct answer
                        const isCorrect = String.fromCharCode(65 + optionIndex) === question.answer;
                        return (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded ${isCorrect ? 'bg-red-100 border border-red-300' : 'bg-white'}`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + optionIndex)}:</span> {option}
                            {isCorrect && <span className="ml-2 text-red-600 font-medium">(Correct Answer)</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              onClick={() => setView("create")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Create Assessment"
            >
              <Plus className="w-4 h-4" />
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

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lesson History</h1>
            <p className="text-gray-600 mt-2">View all lessons created and their performance</p>
          </div>

          <button
            onClick={fetchAllLessons}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Subject & Lesson
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Avg. Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-red-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 p-2 bg-red-100 rounded-lg">
                            <FileText className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lesson.subjectName}</div>
                            <div className="text-sm text-gray-500">{lesson.lessonName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lesson.className}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {new Date(lesson.dateCreated).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          {lesson.questionCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          {lesson.studentCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {lesson.averageScore}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleLessonClick(lesson)}
                          className="flex items-center text-red-600 hover:text-red-900"
                          title="View Questions"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No lessons yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new question set.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {lessons.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-red-600">Lesson Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-700">{lessons.length}</div>
                <div className="text-sm text-gray-600">Total Lessons</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-700">
                  {lessons.reduce((sum, lesson) => sum + lesson.questionCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-700">
                  {lessons.length > 0
                    ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.averageScore, 0) / lessons.length) || 0
                    : 0}%
                </div>
                <div className="text-sm text-gray-600">Overall Average</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonHistory;