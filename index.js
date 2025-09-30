const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// voices folder
const voicesDir = path.join(__dirname, 'voices');

// সব ভয়েস ফাইল লিস্ট দেখাবে
app.get('/list', (req, res) => {
  fs.readdir(voicesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error reading voices folder' });

    const voices = files.filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));
    res.json({ voices });
  });
});

// নির্দিষ্ট ভয়েস সার্ভ করবে
app.get('/voice/:name', (req, res) => {
  const voiceName = req.params.name;
  const filePath = path.join(voicesDir, voiceName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Voice not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Voice API running at http://localhost:${PORT}`);
});
