require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,  })
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('MongoDB Connection Error:', err));

const ImageSchema = new mongoose.Schema({ url: String });
const Image = mongoose.model('Image', ImageSchema);

// API Routes
app.post('/upload', upload.single('image'), async (req, res) => {
  const newImage = new Image({ url: req.file.path });
  await newImage.save();
  res.json({ message: 'Image uploaded successfully', url: req.file.path });
});

app.get('/images', async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));
