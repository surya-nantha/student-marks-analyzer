// server.js - Create this file in your backend root directory

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    enum: ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D']
  },
  school: {
    type: String,
    required: true
  },
  tamil: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  english: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  maths: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add virtual for average marks
studentSchema.virtual('average').get(function() {
  return ((this.tamil + this.english + this.maths) / 3).toFixed(1);
});

// Ensure virtual fields are serialized
studentSchema.set('toJSON', { virtuals: true });

const Student = mongoose.model('Student', studentSchema);

// School Schema
const schoolSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['PUMS', 'GHS', 'ADWHS']
  },
  location: {
    type: String,
    required: true
  }
});

const School = mongoose.model('School', schoolSchema);

// Initialize schools data
const initializeSchools = async () => {
  try {
    const count = await School.countDocuments();
    if (count === 0) {
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
      
      await School.insertMany(schools);
      console.log('Schools initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing schools:', error);
  }
};

// Initialize sample students data
const initializeSampleData = async () => {
  try {
    const count = await Student.countDocuments();
    if (count === 0) {
      const sampleStudents = [
        // PUMS Agalanganallur
        { name: 'Raj Kumar', class: '6A', school: 'pums_agalanganallur', tamil: 8, english: 6, maths: 9 },
        { name: 'Priya Singh', class: '6A', school: 'pums_agalanganallur', tamil: 5, english: 7, maths: 4 },
        { name: 'Arjun Patel', class: '7B', school: 'pums_agalanganallur', tamil: 9, english: 8, maths: 10 },
        
        // PUMS Ariyur
        { name: 'Meera Sharma', class: '6C', school: 'pums_ariyur', tamil: 3, english: 5, maths: 6 },
        { name: 'Kiran Reddy', class: '7A', school: 'pums_ariyur', tamil: 7, english: 9, maths: 8 },
        { name: 'Divya Nair', class: '8B', school: 'pums_ariyur', tamil: 2, english: 4, maths: 3 },
        
        // GHS Nagar
        { name: 'Rohit Gupta', class: '8A', school: 'ghs_nagar', tamil: 10, english: 8, maths: 9 },
        { name: 'Kavya Joshi', class: '9B', school: 'ghs_nagar', tamil: 6, english: 7, maths: 5 },
        { name: 'Amit Sharma', class: '9C', school: 'ghs_nagar', tamil: 9, english: 9, maths: 8 },
        
        // More sample data...
        { name: 'Sneha Patel', class: '9A', school: 'ghs_lalgudi', tamil: 4, english: 6, maths: 7 },
        { name: 'Vikram Singh', class: '8B', school: 'ghs_lalgudi', tamil: 8, english: 8, maths: 9 },
        { name: 'Ravi Kumar', class: '6D', school: 'adwhs_melavaladi', tamil: 6, english: 8, maths: 7 },
        { name: 'Pooja Nair', class: '7C', school: 'adwhs_melavaladi', tamil: 9, english: 7, maths: 10 },
        { name: 'Deepika Joshi', class: '9D', school: 'pums_kuhoor', tamil: 8, english: 9, maths: 8 },
        { name: 'Manoj Sharma', class: '6A', school: 'pums_manakkal', tamil: 7, english: 8, maths: 9 },
      ];
      
      await Student.insertMany(sampleStudents);
      console.log('Sample student data initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// API Routes

// Get all schools
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find().sort({ name: 1 });
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// Get all students with optional filtering
app.get('/api/students', async (req, res) => {
  try {
    const { school, class: studentClass } = req.query;
    const filter = {};
    
    if (school && school !== 'all') {
      filter.school = school;
    }
    
    if (studentClass && studentClass !== 'all') {
      filter.class = studentClass;
    }
    
    const students = await Student.find(filter).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Create a new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, class: studentClass, school, tamil, english, maths } = req.body;
    
    // Validation
    if (!name || !studentClass || !school || tamil === undefined || english === undefined || maths === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if school exists
    const schoolExists = await School.findOne({ id: school });
    if (!schoolExists) {
      return res.status(400).json({ error: 'Invalid school ID' });
    }
    
    const student = new Student({
      name,
      class: studentClass,
      school,
      tamil: Number(tamil),
      english: Number(english),
      maths: Number(maths)
    });
    
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Get analytics data
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const { school, class: studentClass } = req.query;
    const filter = {};
    
    if (school && school !== 'all') {
      filter.school = school;
    }
    
    if (studentClass && studentClass !== 'all') {
      filter.class = studentClass;
    }
    
    const students = await Student.find(filter);
    const schools = await School.find();
    
    const getMarksCategory = (marks) => {
      if (marks >= 0 && marks <= 5) return 'Below Average (0-5)';
      if (marks >= 6 && marks <= 7) return 'Average (6-7)';
      if (marks >= 8 && marks <= 10) return 'Excellent (8-10)';
      return 'Invalid';
    };
    
    const stats = {
      totalStudents: students.length,
      totalSchools: school && school !== 'all' ? 1 : schools.length,
      bySchoolType: {},
      byClass: {},
      byClassLevel: {},
      overallDistribution: { 'Below Average (0-5)': 0, 'Average (6-7)': 0, 'Excellent (8-10)': 0 }
    };
    
    // Count by school type
    const schoolTypes = ['PUMS', 'GHS', 'ADWHS'];
    for (const type of schoolTypes) {
      if (school && school !== 'all') {
        const selectedSchool = schools.find(s => s.id === school);
        stats.bySchoolType[type] = selectedSchool && selectedSchool.type === type ? students.length : 0;
      } else {
        const typeSchools = schools.filter(s => s.type === type).map(s => s.id);
        stats.bySchoolType[type] = students.filter(s => typeSchools.includes(s.school)).length;
      }
    }
    
    // Count by class levels and sections
    const classLevels = ['6', '7', '8', '9'];
    const classes = ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];
    
    classLevels.forEach(level => {
      stats.byClassLevel[level] = students.filter(s => s.class.startsWith(level)).length;
    });
    
    classes.forEach(cls => {
      stats.byClass[cls] = students.filter(s => s.class === cls).length;
    });
    
    // Calculate overall distribution
    const subjects = ['tamil', 'english', 'maths'];
    students.forEach(student => {
      subjects.forEach(subject => {
        const marks = student[subject];
        if (marks !== undefined) {
          const category = getMarksCategory(marks);
          stats.overallDistribution[category]++;
        }
      });
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get subject-wise analysis
app.get('/api/analytics/subjects', async (req, res) => {
  try {
    const { school, class: studentClass } = req.query;
    const filter = {};
    
    if (school && school !== 'all') {
      filter.school = school;
    }
    
    if (studentClass && studentClass !== 'all') {
      filter.class = studentClass;
    }
    
    const students = await Student.find(filter);
    const subjects = ['Tamil', 'English', 'Maths'];
    const analysis = {};
    
    const getMarksCategory = (marks) => {
      if (marks >= 0 && marks <= 5) return 'Below Average (0-5)';
      if (marks >= 6 && marks <= 7) return 'Average (6-7)';
      if (marks >= 8 && marks <= 10) return 'Excellent (8-10)';
      return 'Invalid';
    };
    
    subjects.forEach(subject => {
      const subjectKey = subject.toLowerCase();
      const marks = students.map(s => s[subjectKey]).filter(m => m !== undefined);
      
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
    
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching subject analysis:', error);
    res.status(500).json({ error: 'Failed to fetch subject analysis' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Initialize data and start server
const startServer = async () => {
  await initializeSchools();
  await initializeSampleData();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch(console.error);