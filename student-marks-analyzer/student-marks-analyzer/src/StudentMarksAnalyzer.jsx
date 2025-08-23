import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, BookOpen, TrendingUp, FileText, Plus, Edit, Trash2, Download, Upload } from 'lucide-react';

const StudentMarksAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [schoolName, setSchoolName] = useState('GHS l- Lalgudi');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddStudent, setShowAddStudent] = useState(false);

  const subjects = ['Tamil', 'English', 'Maths'];
  const classes = ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];
  const classLevels = ['6', '7', '8', '9'];

  // Sample data initialization
  useEffect(() => {
    const sampleStudents = [
      { id: 1, name: 'Raj Kumar', class: '6A', tamil: 8, english: 6, maths: 9 },
      { id: 2, name: 'Priya Singh', class: '6A', tamil: 5, english: 7, maths: 4 },
      { id: 3, name: 'Arjun Patel', class: '6B', tamil: 9, english: 8, maths: 10 },
      { id: 4, name: 'Meera Sharma', class: '6C', tamil: 3, english: 5, maths: 6 },
      { id: 5, name: 'Kiran Reddy', class: '7A', tamil: 7, english: 9, maths: 8 },
      { id: 6, name: 'Divya Nair', class: '7B', tamil: 2, english: 4, maths: 3 },
      { id: 7, name: 'Rohit Gupta', class: '8A', tamil: 10, english: 8, maths: 9 },
      { id: 8, name: 'Kavya Joshi', class: '8B', tamil: 6, english: 7, maths: 5 },
      { id: 9, name: 'Amit Sharma', class: '8C', tamil: 9, english: 9, maths: 8 },
      { id: 10, name: 'Sneha Patel', class: '9A', tamil: 4, english: 6, maths: 7 },
      { id: 11, name: 'Vikram Singh', class: '9B', tamil: 8, english: 8, maths: 9 },
      { id: 12, name: 'Anita Reddy', class: '9C', tamil: 7, english: 5, maths: 6 },
      { id: 13, name: 'Ravi Kumar', class: '6D', tamil: 6, english: 8, maths: 7 },
      { id: 14, name: 'Pooja Nair', class: '7C', tamil: 9, english: 7, maths: 10 },
      { id: 15, name: 'Suresh Gupta', class: '7D', tamil: 5, english: 6, maths: 4 },
      { id: 16, name: 'Deepika Joshi', class: '8D', tamil: 8, english: 9, maths: 8 },
      { id: 17, name: 'Manoj Sharma', class: '9D', tamil: 7, english: 8, maths: 9 },
    ];
    setStudents(sampleStudents);
  }, []);

  const getMarksCategory = (marks) => {
    if (marks >= 0 && marks <= 5) return 'Below Average (0-5)';
    if (marks >= 6 && marks <= 7) return 'Average (6-7)';
    if (marks >= 8 && marks <= 10) return 'Excellent (8-10)';
    return 'Invalid';
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      const classMatch = selectedClass === 'all' || student.class === selectedClass;
      return classMatch;
    });
  };

  const getSubjectAnalysis = () => {
    const filteredStudents = getFilteredStudents();
    const analysis = {};

    subjects.forEach(subject => {
      const subjectKey = subject.toLowerCase();
      const marks = filteredStudents.map(s => s[subjectKey]).filter(m => m !== undefined);
      
      const belowAverage = marks.filter(m => m >= 0 && m <= 5).length;
      const average = marks.filter(m => m >= 6 && m <= 7).length;
      const excellent = marks.filter(m => m >= 8 && m <= 10).length;

      analysis[subject] = {
        'Below Average (0-5)': belowAverage,
        'Average (6-7)': average,
        'Excellent (8-10)': excellent,
        total: marks.length
      };
    });

    return analysis;
  };

  const getOverallStats = () => {
    const filteredStudents = getFilteredStudents();
    const stats = {
      totalStudents: filteredStudents.length,
      byClass: {},
      byClassLevel: {},
      overallDistribution: { 'Below Average (0-5)': 0, 'Average (6-7)': 0, 'Excellent (8-10)': 0 }
    };

    // Count by individual class sections
    classes.forEach(cls => {
      stats.byClass[cls] = filteredStudents.filter(s => s.class === cls).length;
    });

    // Count by class levels (6, 7, 8, 9)
    classLevels.forEach(level => {
      stats.byClassLevel[level] = filteredStudents.filter(s => s.class.startsWith(level)).length;
    });

    // Calculate overall distribution across all subjects
    filteredStudents.forEach(student => {
      subjects.forEach(subject => {
        const marks = student[subject.toLowerCase()];
        if (marks !== undefined) {
          const category = getMarksCategory(marks);
          stats.overallDistribution[category]++;
        }
      });
    });

    return stats;
  };

  const getChartData = () => {
    const analysis = getSubjectAnalysis();
    return subjects.map(subject => ({
      subject,
      'Below Average': analysis[subject]['Below Average (0-5)'],
      'Average': analysis[subject]['Average (6-7)'],
      'Excellent': analysis[subject]['Excellent (8-10)']
    }));
  };

  const getPieChartData = () => {
    const stats = getOverallStats();
    return Object.entries(stats.overallDistribution).map(([key, value]) => ({
      name: key,
      value,
      percentage: stats.overallDistribution['Below Average (0-5)'] + stats.overallDistribution['Average (6-7)'] + stats.overallDistribution['Excellent (8-10)'] > 0 
        ? ((value / (stats.overallDistribution['Below Average (0-5)'] + stats.overallDistribution['Average (6-7)'] + stats.overallDistribution['Excellent (8-10)'])) * 100).toFixed(1)
        : 0
    }));
  };

  const COLORS = ['#ff6b6b', '#feca57', '#48dbfb'];

  const AddStudentForm = () => {
    const [newStudent, setNewStudent] = useState({
      name: '', class: '6A', tamil: '', english: '', maths: ''
    });

    const handleSubmit = () => {
      const student = {
        id: Date.now(),
        name: newStudent.name,
        class: newStudent.class,
        tamil: parseInt(newStudent.tamil) || 0,
        english: parseInt(newStudent.english) || 0,
        maths: parseInt(newStudent.maths) || 0
      };
      setStudents([...students, student]);
      setNewStudent({ name: '', class: '6A', tamil: '', english: '', maths: '' });
      setShowAddStudent(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Add New Student</h3>
          <div className="space-y-4">
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
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Add Student
              </button>
              <button
                type="button"
                onClick={() => setShowAddStudent(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stats = getOverallStats();
  const chartData = getChartData();
  const pieData = getPieChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">{schoolName}</h1>
          <p className="text-blue-100 mt-2">Student Marks Analysis System - Classes 6-9</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
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
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {classLevels.map(level => (
                <div key={level} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Class {level}</p>
                      <p className="text-2xl font-bold text-green-600">{stats.byClassLevel[level] || 0}</p>
                      <p className="text-xs text-gray-400">
                        {['A', 'B', 'C', 'D'].map(section => 
                          `${section}: ${stats.byClass[level + section] || 0}`
                        ).join(', ')}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-wrap gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Class Level</label>
                  <select
                    className="p-2 border rounded-lg"
                    value={selectedClass.charAt(0) || 'all'}
                    onChange={(e) => {
                      const level = e.target.value;
                      if (level === 'all') {
                        setSelectedClass('all');
                      } else {
                        setSelectedClass(level + 'A'); // Default to section A
                      }
                    }}
                  >
                    <option value="all">All Levels</option>
                    {classLevels.map(level => (
                      <option key={level} value={level}>Class {level}</option>
                    ))}
                  </select>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maths</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredStudents().map((student) => {
                    const avg = ((student.tamil + student.english + student.maths) / 3).toFixed(1);
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{student.name}</td>
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
                    <div className="flex h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500" 
                        style={{width: `${(analysis['Below Average (0-5)'] / analysis.total * 100)}%`}}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{width: `${(analysis['Average (6-7)'] / analysis.total * 100)}%`}}
                      ></div>
                      <div 
                        className="bg-green-500" 
                        style={{width: `${(analysis['Excellent (8-10)'] / analysis.total * 100)}%`}}
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
                  Export Student Data (CSV)
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Performance Report (PDF)
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Summary Report</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">School: {schoolName}</h4>
                  <p className="text-gray-600">Total Students: {stats.totalStudents}</p>
                  <p className="text-gray-600">Classes: 6-9</p>
                  <p className="text-gray-600">Subjects: Tamil, English, Mathematics</p>
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

export default StudentMarksAnalyzer;