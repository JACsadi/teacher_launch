import React from "react";
import { LayoutDashboard, Plus, BookOpen, Trophy, User, LogOut } from "lucide-react";

// Teacher Dashboard
function Dashboard({ setView, onLogout }) {
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

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <LayoutDashboard className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Teacher's Portal Dashboard
          </h1>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Welcome back! Use the options below to manage your classes and assessments.
        </p>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => setView("create")}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Plus className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Assessment</h3>
                <p className="text-gray-600">Create new question sets for your students</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setView("lessonHistory")}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lesson History</h3>
                <p className="text-gray-600">View all lessons you've created</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setView("leaderboard")}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Trophy className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Student Leaderboard</h3>
                <p className="text-gray-600">See top performers in your classes</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setView("profile")}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Profile</h3>
                <p className="text-gray-600">Manage your personal information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;