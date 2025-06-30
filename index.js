// Backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
    imageUrl: "https://img.freepik.com/vektor-premium/desain-logo-e-commerce_624194-152.jpg?w=740",
    liveUrl: "https://example.com"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Kanban-style task organizer with drag-and-drop",
    technologies: ["Vue.js", "Firebase"],
    imageUrl: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/e-commerce-logo%2Conline-store-logo%2Ccart-logo-design-template-9b5e4319f7f69b92d7421a048ce90dcb_screen.jpg?ts=1662916038
",
    liveUrl: "https://example.com"
  }
];

let messages = [];

// API Routes
// Get all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// Create new project
app.post('/api/projects', (req, res) => {
  const newProject = {
    id: projects.length + 1,
    title: req.body.title,
    description: req.body.description,
    technologies: req.body.technologies,
    imageUrl: req.body.imageUrl || "https://via.placeholder.com/400x225",
    liveUrl: req.body.liveUrl || "#"
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });
  
  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.technologies = req.body.technologies || project.technologies;
  project.imageUrl = req.body.imageUrl || project.imageUrl;
  project.liveUrl = req.body.liveUrl || project.liveUrl;
  
  res.json(project);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (projectIndex === -1) return res.status(404).json({ message: 'Project not found' });
  
  projects = projects.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Project deleted' });
});

// Handle contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  messages.push({ name, email, message, date: new Date() });
  res.status(201).json({ message: 'Message received successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
