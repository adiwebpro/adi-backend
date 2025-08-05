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
    title: "Website Scraper Ulasan Google Play Store",
    description: "Sebuah web yang digunakan untuk mengambil data ulasan di playstore",
    technologies: ["Phyton"],
    imageUrl: "https://raw.githubusercontent.com/adiwebpro/adi-backend/main/02.jpg",
    liveUrl: "https://zaky2.pythonanywhere.com/"
  },
  {
    id: 2,
    title: "Web LokerPurbalingga",
    description: "Sebuah web yang dibuat dengan 2 role, admin dan owner usaha dalam membuat sistem info loker",
    technologies: ["php native", "database mysql"],
    imageUrl: "https://raw.githubusercontent.com/adiwebpro/adi-backend/main/03.jpg", 
    liveUrl: "https://lokerpurbalingga.rf.gd/"
  },
  {
    id: 3,
    title: "PREDIKSI HARGA KAMERA MENGGUNAKAN RANDOM FOREST REGRESSOR",
    description: "Analisis data (PREPROCESSING)",
    technologies: ["Phyton", "Google Colab"],
    imageUrl: "https://raw.githubusercontent.com/adiwebpro/adi-backend/main/01.png", 
    liveUrl: "https://colab.research.google.com/drive/1inRmyepxeOUgNYBdQJL2f5M8pQDzHUUh?authuser=0#scrollTo=mrTcACS9GCqc"
  },
  {
    id: 4,
    title: "Analisis Penjualan Toko Retail",
    description: "🔧 Tools & Library:Python (Pandas, Matplotlib, Seaborn)Jupyter Notebook Dataset format .csv",
    technologies: ["Phyton"],
    imageUrl: "https://raw.githubusercontent.com/adiwebpro/adi-backend/main/04.png",
    liveUrl: "https://github.com/adiwebpro/retail-sales-analysis"
  },
  {
    id: 5,
    title: "NoMark: Unduh Video TikTok, IG & FB Tanpa Watermark",
    description: "Unduh video TikTok, Instagram, dan Facebook tanpa watermark. Bersih, cepat, gratis.",
    technologies: ["PHP Native"],
    imageUrl: "https://raw.githubusercontent.com/adiwebpro/adi-backend/main/05.jpg",
    liveUrl: "https://nomark.rf.gd/"
  },
];

let messages = [];

// === Route utama dengan tampilan HTML indah ===
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Portofolio API</title>
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
          margin-bottom: 30px;
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
        footer {
          margin-top: 50px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }
      </style>
    </head>
    <body>
      <h1>🚀 API Portofolio</h1>
      <p>Selamat datang di backend API untuk data proyek portofolio Saya.</p>
      <a href="/api/projects">Lihat Semua Proyek</a>

      <footer>
        <p>&copy; ${new Date().getFullYear()} Bagus Adi Suratno</p>
      </footer>
    </body>
    </html>
  `);
});

// Rute API

// Ambil semua proyek
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
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (projectIndex === -1) return res.status(404).json({ message: 'Proyek tidak ditemukan' });
  
  projects = projects.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Proyek berhasil dihapus' });
});

// Tangani form kontak
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
  console.log(`Server berjalan di port ${PORT}`);
});
