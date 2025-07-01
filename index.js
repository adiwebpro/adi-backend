const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Aktifkan CORS dan parsing body JSON
app.use(cors());
app.use(bodyParser.json());

// Penyimpanan data sementara (in-memory)
let projects = [
  {
    id: 1,
    title: "Website E-commerce",
    description: "Toko online lengkap dengan fitur keranjang belanja",
    technologies: ["React", "Node.js", "MongoDB"],
    imageUrl: "https://img.freepik.com/vektor-premium/desain-logo-e-commerce_624194-152.jpg?w=740",
    liveUrl: "https://example.com"
  },
  {
    id: 2,
    title: "Aplikasi Manajemen Tugas",
    description: "Pengelola tugas model kanban dengan fitur drag-and-drop",
    technologies: ["Vue.js", "Firebase"],
    imageUrl: "https://img.freepik.com/vektor-premium/desain-logo-e-commerce_624194-152.jpg?w=740",
    liveUrl: "https://example.com"
  }
];

let messages = [];

// 🌐 Tampilan halaman utama
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>API Portofolio</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to right, #4e54c8, #8f94fb);
          color: white;
          text-align: center;
          padding: 60px 20px;
        }
        h1 {
          font-size: 2.8rem;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }
        a {
          background: white;
          color: #4e54c8;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        a:hover {
          background: #f0f0f0;
        }
        img {
          margin-top: 30px;
          max-width: 200px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        footer {
          margin-top: 40px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }
      </style>
    </head>
    <body>
      <h1>🚀 API Portofolio</h1>
      <p>Selamat datang di backend API untuk proyek portofolio Anda.</p>
      <a href="/api/projects">Lihat Semua Proyek</a>

      <img src="https://drive.google.com/uc?export=view&id=1ChaGBQHEpniFR8pdFFKVqnSlLDnXf9FA" alt="Foto Profil" />

      <footer>
        <p>&copy; ${new Date().getFullYear()} Bagus Adi Suratno</p>
      </footer>
    </body>
    </html>
  `);
});

// 🎯 Rute API: Ambil semua proyek
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Ambil satu proyek berdasarkan ID
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: 'Proyek tidak ditemukan' });
  res.json(project);
});

// Tambah proyek baru
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

// Perbarui proyek
app.put('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: 'Proyek tidak ditemukan' });

  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.technologies = req.body.technologies || project.technologies;
  project.imageUrl = req.body.imageUrl || project.imageUrl;
  project.liveUrl = req.body.liveUrl || project.liveUrl;

  res.json(project);
});

// Hapus proyek
app.delete('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Proyek tidak ditemukan' });

  projects.splice(index, 1);
  res.json({ message: 'Proyek berhasil dihapus' });
});

// Kirim pesan kontak
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi' });
  }

  messages.push({ name, email, message, date: new Date() });
  res.status(201).json({ message: 'Pesan berhasil diterima' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
