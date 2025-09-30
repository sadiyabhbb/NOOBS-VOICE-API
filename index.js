const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// voices folder
const voicesDir = path.join(__dirname, 'voices');

// ------------------------
// Root page → Simple HTML + CSS
// ------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Voice API</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; text-align: center; padding: 50px; }
        h1 { color: #333; }
        a { display: inline-block; margin: 10px; padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; }
        a:hover { background: #0051a2; }
        .container { background: white; padding: 20px; border-radius: 10px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎙 Voice API</h1>
        <p>Available Endpoints:</p>
        <a href="/list">/list</a>
        <a href="/voice/badol">/voice/badol</a>
      </div>
    </body>
    </html>
  `);
});

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
  const extensions = ['.mp3', '.wav'];

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
