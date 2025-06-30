// Backend/index.js (Improved Version)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let projects = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "A full-featured online store with cart functionality",
    technologies: ["React", "Node.js", "MongoDB"],
    imageUrl: "https://via.placeholder.com/400x225?text=E-commerce",
    liveUrl: "https://example.com",
    createdAt: new Date()
  }
];

let messages = [];

// API Routes
// Get all projects (with sorting by date)
app.get('/api/projects', (req, res) => {
  const sortedProjects = [...projects].sort((a, b) => b.createdAt - a.createdAt);
  res.json(sortedProjects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// Create new project with validation
app.post('/api/projects', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('technologies').isArray({ min: 1 }).withMessage('At least one technology is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    title: req.body.title,
    description: req.body.description,
    technologies: req.body.technologies,
    imageUrl: req.body.imageUrl || "https://via.placeholder.com/400x225",
    liveUrl: req.body.liveUrl || "#",
    createdAt: new Date()
  };
  
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });
  
  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.technologies = req.body.technologies || project.technologies;
  project.imageUrl = req.body.imageUrl || project.imageUrl;
  project.liveUrl = req.body.liveUrl || project.liveUrl;
  project.updatedAt = new Date();
  
  res.json(project);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (projectIndex === -1) return res.status(404).json({ message: 'Project not found' });
  
  projects = projects.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Project deleted' });
});

// Handle contact form submissions with validation
app.post('/api/contact', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;
  const newMessage = { 
    name, 
    email, 
    message, 
    date: new Date(),
    ip: req.ip // Store client IP for basic spam protection
  };
  
  messages.push(newMessage);
  
  // Basic rate limiting check
  const recentMessages = messages.filter(m => 
    m.ip === req.ip && 
    new Date() - m.date < 15 * 60 * 1000 // 15 minutes
  );
  
  if (recentMessages.length > 3) {
    return res.status(429).json({ message: 'Too many messages. Please try again later.' });
  }
  
  res.status(201).json({ 
    message: 'Message received successfully',
    data: {
      id: newMessage.date.getTime(),
      name: newMessage.name
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
