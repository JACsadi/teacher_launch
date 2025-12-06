import React from "react";
import { User, Mail, Phone, Camera, Edit3, MapPin, GraduationCap, LogOut, LayoutDashboard, BookOpen, Trophy, Plus } from "lucide-react";

// Component to display teacher's profile
function TeacherProfile({ setView, onLogout }) {
  // Mock teacher data - in a real app, this would come from an API
  const teacher = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@tiktik.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Education Street, Learning City",
    subject: "Physics",
    experience: "8 years",
    education: "PhD in Physics",
    profilePicture: null // In a real app, this would be an actual image URL
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
              onClick={() => setView("leaderboard")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition duration-200"
              title="Leaderboard"
            >
              <Trophy className="w-4 h-4" />
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-200">
              <div className="flex flex-col items-center">
                {teacher.profilePicture ? (
                  <img
                    src={teacher.profilePicture}
                    alt={teacher.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-red-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-100">
                    <User className="h-16 w-16 text-red-600" />
                  </div>
                )}

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-900">{teacher.name}</h2>
                  <p className="text-gray-600">{teacher.subject} Teacher</p>
                </div>

                <button className="mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-200">
                  <Camera className="h-4 w-4" />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">About</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{teacher.education}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{teacher.experience} experience</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{teacher.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="md:w-2/3">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {teacher.name}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {teacher.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {teacher.phone}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {teacher.subject}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {teacher.experience}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {teacher.address}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {teacher.education}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">24</div>
                  <div className="text-sm text-gray-600">Classes Taught</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">156</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">32</div>
                  <div className="text-sm text-gray-600">Lessons Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;