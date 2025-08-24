import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, TrendingUp, FileText, Plus, Download, School, MapPin, Eye, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';

const MultiSchoolMarksAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    overview: null,
    subjects: null
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  const subjects = ['Tamil', 'English', 'Maths'];
  const classes = ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];
  const classLevels = ['6', '7', '8', '9'];

  // API service functions
  const apiService = {
    async fetchSchools() {
      const response = await fetch(`${API_BASE_URL}/schools`);
      if (!response.ok) throw new Error('Failed to fetch schools');
      return response.json();
    },

    async fetchStudents(filters = {}) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });
      
      const response = await fetch(`${API_BASE_URL}/students?${params}`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },

    async createStudent(studentData) {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create student');
      }
      return response.json();
    },

    async deleteStudent(id) {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete student');
      return response.json();
    },

    async fetchAnalytics(filters = {}) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });

      const [overview, subjects] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/overview?${params}`).then(r => r.json()),
        fetch(`${API_BASE_URL}/analytics/subjects?${params}`).then(r => r.json())
      ]);

      return { overview, subjects };
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    loadStudents();
    loadAnalytics();
  }, [selectedSchool, selectedClass]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const schoolsData = await apiService.fetchSchools();
      setSchools(schoolsData);
      await loadStudents();
      await loadAnalytics();
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const filters = {
        school: selectedSchool,
        class: selectedClass
      };
      const studentsData = await apiService.fetchStudents(filters);
      setStudents(studentsData);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const filters = {
        school: selectedSchool,
        class: selectedClass
      };
      const analyticsData = await apiService.fetchAnalytics(filters);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await apiService.deleteStudent(studentId);
      await loadStudents(); // Refresh the list
      await loadAnalytics(); // Refresh analytics
    } catch (err) {
      setError(err.message);
    }
  };

  const getMarksCategory = (marks) => {
    if (marks >= 0 && marks <= 5) return 'Below Average (0-5)';
    if (marks >= 6 && marks <= 7) return 'Average (6-7)';
    if (marks >= 8 && marks <= 10) return 'Excellent (8-10)';
    return 'Invalid';
  };

  const getChartData = () => {
    if (!analytics.subjects) return [];
    
    return subjects.map(subject => ({
      subject,
      'Below Average': analytics.subjects[subject]?.['Below Average (0-5)'] || 0,
      'Average': analytics.subjects[subject]?.['Average (6-7)'] || 0,
      'Excellent': analytics.subjects[subject]?.['Excellent (8-10)'] || 0
    }));
  };

  const getSubjectAnalysis = () => {
  if (!analytics.subjects) return {};

  const result = {};
  subjects.forEach(subject => {
    const data = analytics.subjects[subject] || {};
    result[subject] = {
      'Below Average (0-5)': data['Below Average (0-5)'] || 0,
      'Average (6-7)': data['Average (6-7)'] || 0,
      'Excellent (8-10)': data['Excellent (8-10)'] || 0,
      total: (data['Below Average (0-5)'] || 0) +
             (data['Average (6-7)'] || 0) +
             (data['Excellent (8-10)'] || 0)
    };
  });
  return result;
};


  const getPieChartData = () => {
    if (!analytics.overview) return [];
    
    const { overallDistribution } = analytics.overview;
    const total = overallDistribution['Below Average (0-5)'] + 
                 overallDistribution['Average (6-7)'] + 
                 overallDistribution['Excellent (8-10)'];
    
    return Object.entries(overallDistribution).map(([key, value]) => ({
      name: key,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0
    }));
  };

  const COLORS = ['#ff6b6b', '#feca57', '#48dbfb'];

  const AddStudentForm = () => {
    const [newStudent, setNewStudent] = useState({
      name: '', class: '6A', school: schools[0]?.id || '', tamil: '', english: '', maths: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!newStudent.name.trim()) return;
      
      setSubmitting(true);
      try {
        const student = {
          name: newStudent.name,
          class: newStudent.class,
          school: newStudent.school,
          tamil: parseInt(newStudent.tamil) || 0,
          english: parseInt(newStudent.english) || 0,
          maths: parseInt(newStudent.maths) || 0
        };
        
        await apiService.createStudent(student);
        setNewStudent({ name: '', class: '6A', school: schools[0]?.id || '', tamil: '', english: '', maths: '' });
        setShowAddStudent(false);
        await loadStudents(); // Refresh the list
        await loadAnalytics(); // Refresh analytics
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Add New Student</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={newStudent.school}
                onChange={(e) => setNewStudent({...newStudent, school: e.target.value})}
              >
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={newStudent.class}
                onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Tamil</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="w-full p-2 border rounded-lg"
                  value={newStudent.tamil}
                  onChange={(e) => setNewStudent({...newStudent, tamil: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">English</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="w-full p-2 border rounded-lg"
                  value={newStudent.english}
                  onChange={(e) => setNewStudent({...newStudent, english: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maths</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="w-full p-2 border rounded-lg"
                  value={newStudent.maths}
                  onChange={(e) => setNewStudent({...newStudent, maths: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Student'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddStudent(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg">Loading data...</span>
        </div>
      </div>
    );
  }

  const stats = analytics.overview || {
    totalStudents: 0,
    totalSchools: 0,
    bySchoolType: {},
    byClass: {},
    byClassLevel: {},
    overallDistribution: { 'Below Average (0-5)': 0, 'Average (6-7)': 0, 'Excellent (8-10)': 0 }
  };

  const chartData = getChartData();
  const pieData = getPieChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Multi-School Marks Analysis System</h1>
              <p className="text-blue-100 mt-2">District Education Management - Classes 6-9 (MongoDB)</p>
              <div className="flex items-center mt-2 text-blue-200">
                <School className="w-4 h-4 mr-2" />
                <span>{stats.totalSchools} Schools • {stats.totalStudents} Students</span>
              </div>
            </div>
            <button
              onClick={loadData}
              className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'District Overview', icon: TrendingUp },
              { id: 'schools', label: 'Schools', icon: School },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'analysis', label: 'Analysis', icon: BarChart },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Filters - Always visible */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Filter by School</label>
              <select
                className="p-2 border rounded-lg min-w-64"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                <option value="all">All Schools</option>
                <optgroup label="PUMS Schools">
                  {schools.filter(s => s.type === 'PUMS').map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </optgroup>
                <optgroup label="GHS Schools">
                  {schools.filter(s => s.type === 'GHS').map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </optgroup>
                <optgroup label="ADWHS Schools">
                  {schools.filter(s => s.type === 'ADWHS').map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Filter by Class</label>
              <select
                className="p-2 border rounded-lg"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classLevels.map(level => (
                  <optgroup key={level} label={`Class ${level}`}>
                    {['A', 'B', 'C', 'D'].map(section => (
                      <option key={level + section} value={level + section}>
                        {level + section}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Schools</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalSchools}</p>
                  </div>
                  <School className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">PUMS Students</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.bySchoolType['PUMS'] || 0}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">GHS Students</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.bySchoolType['GHS'] || 0}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* School Type Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Students by School Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{stats.bySchoolType['PUMS'] || 0}</p>
                  <p className="text-purple-700">PUMS Students</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600">{stats.bySchoolType['GHS'] || 0}</p>
                  <p className="text-orange-700">GHS Students</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600">{stats.bySchoolType['ADWHS'] || 0}</p>
                  <p className="text-red-700">ADWHS Students</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Subject-wise Performance Distribution</h3>
                <BarChart width={400} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Below Average" fill="#ff6b6b" />
                  <Bar dataKey="Average" fill="#feca57" />
                  <Bar dataKey="Excellent" fill="#48dbfb" />
                </BarChart>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Overall Performance Distribution</h3>
                <PieChart width={400} height={300}>
                  <Pie
                    data={pieData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    label={({name, percentage}) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">School Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map(school => {
                const schoolStudents = students.filter(s => s.school === school.id);
                const schoolStudentCount = schoolStudents.length;
                
                return (
                  <div key={school.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{school.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {school.location}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        school.type === 'PUMS' ? 'bg-purple-100 text-purple-800' :
                        school.type === 'GHS' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {school.type}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium">{schoolStudentCount}</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {classLevels.map(level => {
                          const levelCount = schoolStudents.filter(s => s.class.startsWith(level)).length;
                          return (
                            <div key={level} className="bg-gray-50 p-2 rounded">
                              <div className="text-sm font-medium">{level}</div>
                              <div className="text-lg font-bold text-blue-600">
                                {levelCount}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <button 
                        onClick={() => setSelectedSchool(school.id)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Management</h2>
              <button
                onClick={() => setShowAddStudent(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maths</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const avg = ((student.tamil + student.english + student.maths) / 3).toFixed(1);
                    const school = schools.find(s => s.id === student.school);
                    return (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium">{school?.name}</div>
                            <div className="text-xs text-gray-500">{school?.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.class}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-sm ${
                            student.tamil >= 8 ? 'bg-green-100 text-green-800' :
                            student.tamil >= 6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.tamil}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-sm ${
                            student.english >= 8 ? 'bg-green-100 text-green-800' :
                            student.english >= 6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.english}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-sm ${
                            student.maths >= 8 ? 'bg-green-100 text-green-800' :
                            student.maths >= 6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.maths}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Analysis</h2>
            
            {subjects.map(subject => {
              const analysis = getSubjectAnalysis()[subject];
              return (
                <div key={subject} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">{subject} Performance Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">{analysis['Below Average (0-5)']}</p>
                      <p className="text-sm text-gray-600">Below Average (0-5)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-500">{analysis['Average (6-7)']}</p>
                      <p className="text-sm text-gray-600">Average (6-7)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{analysis['Excellent (8-10)']}</p>
                      <p className="text-sm text-gray-600">Excellent (8-10)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{analysis.total}</p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="flex h-3 rounded-full">//modified 
                      <div 
                        className="bg-red-500" 
                        style={{width: analysis.total > 0 ? `${(analysis['Below Average (0-5)'] / analysis.total * 100)}%` : '0%'}}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{width: analysis.total > 0 ? `${(analysis['Average (6-7)'] / analysis.total * 100)}%` : '0%'}}
                      ></div>
                      <div 
                        className="bg-green-500" 
                        style={{width: analysis.total > 0 ? `${(analysis['Excellent (8-10)'] / analysis.total * 100)}%` : '0%'}}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Export</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Export Options</h3>
              <div className="space-y-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All Student Data (CSV)
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate District Performance Report (PDF)
                </button>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  School-wise Performance Summary (Excel)
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">District Summary Report</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">District Overview</h4>
                  <p className="text-gray-600">Total Schools: {stats.totalSchools}</p>
                  <p className="text-gray-600">Total Students: {stats.totalStudents}</p>
                  <p className="text-gray-600">Classes: 6-9 (Sections A, B, C, D)</p>
                  <p className="text-gray-600">Subjects: Tamil, English, Mathematics</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">School Type Distribution:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-purple-50 rounded">
                      <p className="font-medium text-purple-700">PUMS Schools</p>
                      <p className="text-2xl font-bold text-purple-600">{schools.filter(s => s.type === 'PUMS').length}</p>
                      <p className="text-sm text-purple-600">Students: {stats.bySchoolType['PUMS'] || 0}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded">
                      <p className="font-medium text-orange-700">GHS Schools</p>
                      <p className="text-2xl font-bold text-orange-600">{schools.filter(s => s.type === 'GHS').length}</p>
                      <p className="text-sm text-orange-600">Students: {stats.bySchoolType['GHS'] || 0}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <p className="font-medium text-red-700">ADWHS Schools</p>
                      <p className="text-2xl font-bold text-red-600">{schools.filter(s => s.type === 'ADWHS').length}</p>
                      <p className="text-sm text-red-600">Students: {stats.bySchoolType['ADWHS'] || 0}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Class Distribution:</h4>
                  {classLevels.map(level => (
                    <div key={level} className="mb-2">
                      <p className="text-gray-600 font-medium">Class {level}: {stats.byClassLevel[level] || 0} students</p>
                      <div className="ml-4 text-sm text-gray-500">
                        {['A', 'B', 'C', 'D'].map(section => (
                          <span key={section} className="mr-4">
                            {level}{section}: {stats.byClass[level + section] || 0}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddStudent && <AddStudentForm />}
    </div>
  );
};

export default MultiSchoolMarksAnalyzer;