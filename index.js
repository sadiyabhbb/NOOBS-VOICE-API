const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// voices folder
const voicesDir = path.join(__dirname, 'voices');

// ------------------------
// GET /list → সব ভয়েস দেখাবে
// ------------------------
app.get('/list', (req, res) => {
  fs.readdir(voicesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error reading voices folder' });

    const voices = files.filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));
    res.json({ voices });
  });
});

// ------------------------
// GET /voice/:name → নির্দিষ্ট ভয়েস প্লে করবে
// ------------------------
app.get('/voice/:name', (req, res) => {
  const name = req.params.name;

  // সম্ভাব্য এক্সটেনশন
  const extensions = ['.mp3', '.wav'];

  // ফাইল খুঁজে বের করা
  let filePath = null;
  for (let ext of extensions) {
    const fullPath = path.join(voicesDir, name + ext);
    if (fs.existsSync(fullPath)) {
      filePath = fullPath;
      break;
    }
  }

  if (filePath) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Voice not found' });
  }
});

// ------------------------
// Server start
// ------------------------
app.listen(PORT, () => {
  console.log(`Voice API running at http://localhost:${PORT}`);
});
