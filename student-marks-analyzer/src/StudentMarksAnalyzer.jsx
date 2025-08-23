import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, BookOpen, TrendingUp, FileText, Plus, Download, School, MapPin, Filter, Eye } from 'lucide-react';

const MultiSchoolMarksAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddStudent, setShowAddStudent] = useState(false);

  const subjects = ['Tamil', 'English', 'Maths'];
  const classes = ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];
  const classLevels = ['6', '7', '8', '9'];

  const schools = [
    { id: 'pums_agalanganallur', name: 'PUMS - Agalanganallur', type: 'PUMS', location: 'Agalanganallur' },
    { id: 'pums_agalanganallur_new', name: 'PUMS - Agalanganallur (New Street)', type: 'PUMS', location: 'Agalanganallur' },
    { id: 'pums_ariyur', name: 'PUMS - Ariyur', type: 'PUMS', location: 'Ariyur' },
    { id: 'pums_esanakkorai', name: 'PUMS - Esanakkorai', type: 'PUMS', location: 'Esanakkorai' },
    { id: 'pums_kuhoor', name: 'PUMS - Kuhoor', type: 'PUMS', location: 'Kuhoor' },
    { id: 'pums_manakkal', name: 'PUMS - Manakkal', type: 'PUMS', location: 'Manakkal' },
    { id: 'pums_marudhur', name: 'PUMS - Marudhur', type: 'PUMS', location: 'Marudhur' },
    { id: 'pums_nathamangudi', name: 'PUMS - Nathamangudi', type: 'PUMS', location: 'Nathamangudi' },
    { id: 'pums_pallapuram', name: 'PUMS - Pallapuram', type: 'PUMS', location: 'Pallapuram' },
    { id: 'pums_sathamangalam', name: 'PUMS - Sathamangalam', type: 'PUMS', location: 'Sathamangalam' },
    { id: 'pums_south_chathiram', name: 'PUMS - South Chathiram', type: 'PUMS', location: 'South Chathiram' },
    { id: 'pums_thirumanamedu', name: 'PUMS - Thirumanamedu', type: 'PUMS', location: 'Thirumanamedu' },
    { id: 'pums_thachankurichi', name: 'PUMS - Thachankurichi', type: 'PUMS', location: 'Thachankurichi' },
    { id: 'pums_thirumangalam', name: 'PUMS - Thirumangalam', type: 'PUMS', location: 'Thirumangalam' },
    { id: 'ghs_nagar', name: 'GHS - Nagar', type: 'GHS', location: 'Nagar' },
    { id: 'ghs_peruvalanallur', name: 'GHS - Peruvalanallur', type: 'GHS', location: 'Peruvalanallur' },
    { id: 'ghs_pudur_uthamanur', name: 'GHS - Pudur Uthamanur', type: 'GHS', location: 'Pudur Uthamanur' },
    { id: 'ghs_thalakkudi', name: 'GHS - Thalakkudi', type: 'GHS', location: 'Thalakkudi' },
    { id: 'ghs_mandhurai', name: 'GHS - Mandhurai', type: 'GHS', location: 'Mandhurai' },
    { id: 'ghs_lalgudi', name: 'GHS - Lalgudi', type: 'GHS', location: 'Lalgudi' },
    { id: 'adwhs_melavaladi', name: 'ADWHS - Melavaladi', type: 'ADWHS', location: 'Melavaladi' }
  ];

  // Sample data initialization with multiple schools
  useEffect(() => {
    const sampleStudents = [
      // PUMS Agalanganallur
      { id: 1, name: 'Raj Kumar', class: '6A', school: 'pums_agalanganallur', tamil: 8, english: 6, maths: 9 },
      { id: 2, name: 'Priya Singh', class: '6A', school: 'pums_agalanganallur', tamil: 5, english: 7, maths: 4 },
      { id: 3, name: 'Arjun Patel', class: '7B', school: 'pums_agalanganallur', tamil: 9, english: 8, maths: 10 },
      
      // PUMS Ariyur
      { id: 4, name: 'Meera Sharma', class: '6C', school: 'pums_ariyur', tamil: 3, english: 5, maths: 6 },
      { id: 5, name: 'Kiran Reddy', class: '7A', school: 'pums_ariyur', tamil: 7, english: 9, maths: 8 },
      { id: 6, name: 'Divya Nair', class: '8B', school: 'pums_ariyur', tamil: 2, english: 4, maths: 3 },
      
      // GHS Nagar
      { id: 7, name: 'Rohit Gupta', class: '8A', school: 'ghs_nagar', tamil: 10, english: 8, maths: 9 },
      { id: 8, name: 'Kavya Joshi', class: '9B', school: 'ghs_nagar', tamil: 6, english: 7, maths: 5 },
      { id: 9, name: 'Amit Sharma', class: '9C', school: 'ghs_nagar', tamil: 9, english: 9, maths: 8 },
      
      // GHS Lalgudi
      { id: 10, name: 'Sneha Patel', class: '9A', school: 'ghs_lalgudi', tamil: 4, english: 6, maths: 7 },
      { id: 11, name: 'Vikram Singh', class: '8B', school: 'ghs_lalgudi', tamil: 8, english: 8, maths: 9 },
      { id: 12, name: 'Anita Reddy', class: '7C', school: 'ghs_lalgudi', tamil: 7, english: 5, maths: 6 },
      
      // ADWHS Melavaladi
      { id: 13, name: 'Ravi Kumar', class: '6D', school: 'adwhs_melavaladi', tamil: 6, english: 8, maths: 7 },
      { id: 14, name: 'Pooja Nair', class: '7C', school: 'adwhs_melavaladi', tamil: 9, english: 7, maths: 10 },
      { id: 15, name: 'Suresh Gupta', class: '8D', school: 'adwhs_melavaladi', tamil: 5, english: 6, maths: 4 },
      
      // More sample data across different schools
      { id: 16, name: 'Deepika Joshi', class: '9D', school: 'pums_kuhoor', tamil: 8, english: 9, maths: 8 },
      { id: 17, name: 'Manoj Sharma', class: '6A', school: 'pums_manakkal', tamil: 7, english: 8, maths: 9 },
      { id: 18, name: 'Lakshmi Iyer', class: '7A', school: 'ghs_peruvalanallur', tamil: 9, english: 6, maths: 8 },
      { id: 19, name: 'Ganesh Raman', class: '8A', school: 'ghs_thalakkudi', tamil: 5, english: 7, maths: 6 },
      { id: 20, name: 'Radha Krishna', class: '9A', school: 'pums_thirumangalam', tamil: 8, english: 9, maths: 10 },
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
      const schoolMatch = selectedSchool === 'all' || student.school === selectedSchool;
      const classMatch = selectedClass === 'all' || student.class === selectedClass;
      return schoolMatch && classMatch;
    });
  };

  const getSchoolStats = () => {
    const stats = {};
    
    schools.forEach(school => {
      const schoolStudents = students.filter(s => s.school === school.id);
      stats[school.id] = {
        name: school.name,
        type: school.type,
        location: school.location,
        totalStudents: schoolStudents.length,
        byClass: {},
        byClassLevel: {},
        performance: { 'Below Average (0-5)': 0, 'Average (6-7)': 0, 'Excellent (8-10)': 0 }
      };

      // Count by class levels
      classLevels.forEach(level => {
        stats[school.id].byClassLevel[level] = schoolStudents.filter(s => s.class.startsWith(level)).length;
      });

      // Calculate performance distribution
      schoolStudents.forEach(student => {
        subjects.forEach(subject => {
          const marks = student[subject.toLowerCase()];
          if (marks !== undefined) {
            const category = getMarksCategory(marks);
            stats[school.id].performance[category]++;
          }
        });
      });
    });

    return stats;
  };

  const getOverallStats = () => {
    const filteredStudents = getFilteredStudents();
    const stats = {
      totalStudents: filteredStudents.length,
      totalSchools: selectedSchool === 'all' ? schools.length : 1,
      bySchoolType: {},
      byClass: {},
      byClassLevel: {},
      overallDistribution: { 'Below Average (0-5)': 0, 'Average (6-7)': 0, 'Excellent (8-10)': 0 }
    };

    // Count by school type
    const schoolTypes = ['PUMS', 'GHS', 'ADWHS'];
    schoolTypes.forEach(type => {
      if (selectedSchool === 'all') {
        stats.bySchoolType[type] = students.filter(s => {
          const school = schools.find(sch => sch.id === s.school);
          return school && school.type === type;
        }).length;
      } else {
        const school = schools.find(sch => sch.id === selectedSchool);
        stats.bySchoolType[type] = school && school.type === type ? filteredStudents.length : 0;
      }
    });

    // Count by class sections
    classes.forEach(cls => {
      stats.byClass[cls] = filteredStudents.filter(s => s.class === cls).length;
    });

    // Count by class levels
    classLevels.forEach(level => {
      stats.byClassLevel[level] = filteredStudents.filter(s => s.class.startsWith(level)).length;
    });

    // Calculate overall distribution
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
    const total = stats.overallDistribution['Below Average (0-5)'] + 
                 stats.overallDistribution['Average (6-7)'] + 
                 stats.overallDistribution['Excellent (8-10)'];
    
    return Object.entries(stats.overallDistribution).map(([key, value]) => ({
      name: key,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0
    }));
  };

  const COLORS = ['#ff6b6b', '#feca57', '#48dbfb'];

  const AddStudentForm = () => {
    const [newStudent, setNewStudent] = useState({
      name: '', class: '6A', school: schools[0].id, tamil: '', english: '', maths: ''
    });

    const handleSubmit = () => {
      if (!newStudent.name.trim()) return;
      
      const student = {
        id: Date.now(),
        name: newStudent.name,
        class: newStudent.class,
        school: newStudent.school,
        tamil: parseInt(newStudent.tamil) || 0,
        english: parseInt(newStudent.english) || 0,
        maths: parseInt(newStudent.maths) || 0
      };
      setStudents([...students, student]);
      setNewStudent({ name: '', class: '6A', school: schools[0].id, tamil: '', english: '', maths: '' });
      setShowAddStudent(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
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
  const schoolStats = getSchoolStats();
  const chartData = getChartData();
  const pieData = getPieChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Multi-School Marks Analysis System</h1>
          <p className="text-blue-100 mt-2">District Education Management - Classes 6-9</p>
          <div className="flex items-center mt-2 text-blue-200">
            <School className="w-4 h-4 mr-2" />
            <span>{stats.totalSchools} Schools • {stats.totalStudents} Students</span>
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
                    <p className="text-gray-500">PUMS Schools</p>
                    <p className="text-2xl font-bold text-purple-600">{schools.filter(s => s.type === 'PUMS').length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">GHS Schools</p>
                    <p className="text-2xl font-bold text-orange-600">{schools.filter(s => s.type === 'GHS').length}</p>
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
                const schoolData = schoolStats[school.id];
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
                        <span className="font-medium">{schoolData.totalStudents}</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {classLevels.map(level => (
                          <div key={level} className="bg-gray-50 p-2 rounded">
                            <div className="text-sm font-medium">{level}</div>
                            <div className="text-lg font-bold text-blue-600">
                              {schoolData.byClassLevel[level] || 0}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3">
                        <div className="text-sm text-gray-600 mb-2">Performance Distribution:</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-red-600">Below Average:</span>
                            <span>{schoolData.performance['Below Average (0-5)']}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-yellow-600">Average:</span>
                            <span>{schoolData.performance['Average (6-7)']}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-green-600">Excellent:</span>
                            <span>{schoolData.performance['Excellent (8-10)']}</span>
                          </div>
                        </div>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredStudents().map((student) => {
                    const avg = ((student.tamil + student.english + student.maths) / 3).toFixed(1);
                    const school = schools.find(s => s.id === student.school);
                    return (
                      <tr key={student.id}>
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
                    <div className="flex h-3 rounded-full overflow-hidden">
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