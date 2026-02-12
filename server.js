const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/portfolio';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import Models
const Contact = require('./models/Contact');
const Project = require('./models/Project');

// Routes

// Get all contact messages
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit contact form
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, link, technologies } = req.body;
    const newProject = new Project({ title, description, link, technologies });
    await newProject.save();
    res.json({ success: true, message: 'Project added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get skills (from contacts collection or separate collection)
app.get('/api/skills', async (req, res) => {
  const skills = ['JavaScript', 'Node.js', 'MongoDB', 'Express.js', 'HTML/CSS', 'React', 'Full Stack Development'];
  res.json(skills);
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
