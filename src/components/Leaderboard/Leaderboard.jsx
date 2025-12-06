import React from "react";
import { Trophy, User, Star, Target, School, LogOut, LayoutDashboard, BookOpen, Plus, User as UserIcon } from "lucide-react";

// Component to display student leaderboard
function Leaderboard({ setView, onLogout }) {
  // Mock data for student results - in a real app, this would come from an API
  const students = [
    {
      id: 1,
      name: "Ahmed Khan",
      class: "10th Grade",
      subject: "Physics",
      score: 95,
      lesson: "Electromagnetism",
      rank: 1
    },
    {
      id: 2,
      name: "Fatima Ali",
      class: "10th Grade",
      subject: "Physics",
      score: 92,
      lesson: "Electromagnetism",
      rank: 2
    },
    {
      id: 3,
      name: "Hassan Raza",
      class: "10th Grade",
      subject: "Physics",
      score: 88,
      lesson: "Electromagnetism",
      rank: 3
    },
    {
      id: 4,
      name: "Ayesha Malik",
      class: "10th Grade",
      subject: "Physics",
      score: 85,
      lesson: "Electromagnetism",
      rank: 4
    },
    {
      id: 5,
      name: "Omer Farooq",
      class: "10th Grade",
      subject: "Physics",
      score: 82,
      lesson: "Electromagnetism",
      rank: 5
    },
    {
      id: 6,
      name: "Zainab Shah",
      class: "10th Grade",
      subject: "Physics",
      score: 79,
      lesson: "Electromagnetism",
      rank: 6
    },
    {
      id: 7,
      name: "Bilal Ahmed",
      class: "10th Grade",
      subject: "Physics",
      score: 76,
      lesson: "Electromagnetism",
      rank: 7
    },
    {
      id: 8,
      name: "Sana Iqbal",
      class: "10th Grade",
      subject: "Physics",
      score: 73,
      lesson: "Electromagnetism",
      rank: 8
    },
    {
      id: 9,
      name: "Usman Tariq",
      class: "10th Grade",
      subject: "Physics",
      score: 70,
      lesson: "Electromagnetism",
      rank: 9
    },
    {
      id: 10,
      name: "Rabia Javed",
      class: "10th Grade",
      subject: "Physics",
      score: 68,
      lesson: "Electromagnetism",
      rank: 10
    }
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-red-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-red-300" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-red-700" />;
    return <span className="font-medium">{rank}</span>;
  };

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
              onClick={() => setView("lessonHistory")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Lesson History"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("profile")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Profile"
            >
              <UserIcon className="w-4 h-4" />
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
            <h1 className="text-3xl font-bold text-gray-900">Student Leaderboard</h1>
            <p className="text-gray-600 mt-2">Top performers in your lessons</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Physics - Electromagnetism</h2>
                <p className="text-sm text-gray-500">10th Grade • 25 Students</p>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <Target className="h-4 w-4 mr-1" />
                  Active Lesson
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider w-16">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Lesson
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-red-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {student.rank <= 3 ? (
                          getRankIcon(student.rank)
                        ) : (
                          <span className="font-medium">{student.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-red-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lesson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-red-400 mr-1" />
                        <span className="text-sm font-semibold text-gray-900">{student.score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <Trophy className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Top Performer</h3>
                <p className="text-lg font-semibold text-gray-900">{students[0]?.name}</p>
                <p className="text-sm text-gray-500">{students[0]?.score}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(students.reduce((sum, student) => sum + student.score, 0) / students.length) || 0}%
                </p>
                <p className="text-sm text-gray-500">Across all students</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <School className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                <p className="text-lg font-semibold text-gray-900">{students.length}</p>
                <p className="text-sm text-gray-500">In this lesson</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;