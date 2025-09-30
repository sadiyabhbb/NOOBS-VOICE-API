const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// voices folder
const voicesDir = path.join(__dirname, 'voices');

// ------------------------
// Root page → Professional & Responsive UI
// ------------------------
app.get('/', (req, res) => {
  // Get all voices for dynamic listing
  const files = fs.readdirSync(voicesDir).filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));

  const voiceCards = files.map(f => {
    const name = f.replace(/\.(mp3|wav)$/, '');
    return `
      <div class="api-card">
        <h3 class="endpoint-title">${name}</h3>
        <p class="endpoint-description">Play the "${name}" voice file.</p>
        <div class="endpoint-method-info">
          <span class="method-tag get">GET</span>
          <span class="endpoint-path">/voice/${name}</span>
        </div>
        <audio controls style="width: 100%; margin-top: 10px;">
          <source src="/voice/${name}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
  }).join('\n');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Voice API</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f4f6f8;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        h1 { color: #1a1a1a; margin-bottom: 20px; }
        .container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        /* API Card Styles */
        .api-card {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          padding: 20px;
          width: 300px;
          text-align: left;
          border-left: 6px solid #0070f3; /* professional blue border */
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .api-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }
        .endpoint-title { font-size: 1.25rem; font-weight: 600; margin-top: 0; margin-bottom: 5px; color: #111; }
        .endpoint-description { font-size: 0.9rem; color: #555; margin-bottom: 10px; }
        .method-tag { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-right: 10px; }
        .method-tag.get { background-color: #e6f0ff; color: #0050b3; border: 1px solid #91caff; }
        .endpoint-path { font-family: monospace; color: #333; font-size: 0.9rem; }

        audio {
          border-radius: 5px;
        }

        /* Responsive */
        @media (max-width: 650px) {
          .api-card { width: 90%; }
        }
      </style>
    </head>
    <body>
      <h1>🎙 Voice API</h1>
      <div class="container">
        <div class="api-card">
          <h3 class="endpoint-title">Get List of Voices</h3>
          <p class="endpoint-description">Fetch all available voices in JSON format.</p>
          <div class="endpoint-method-info">
            <span class="method-tag get">GET</span>
            <span class="endpoint-path">/list</span>
          </div>
          <a href="/list" target="_blank" style="margin-top:10px; display:inline-block; color:#fff; background:#0070f3; padding:8px 12px; border-radius:5px; text-decoration:none;">View JSON</a>
        </div>
        ${voiceCards}
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
