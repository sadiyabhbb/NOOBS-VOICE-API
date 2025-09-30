const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// voices folder
const voicesDir = path.join(__dirname, 'voices');

// ------------------------
// Root page → Beautiful API Card UI
// ------------------------
app.get('/', (req, res) => {
  // Get all voices for dynamic listing
  const files = fs.readdirSync(voicesDir).filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));

  const voiceCards = files.map(f => {
    const name = f.replace(/\.(mp3|wav)$/, '');
    return `
      <div class="api-card">
        <div class="endpoint-header">
          <h3 class="endpoint-title">${name}</h3>
        </div>
        <p class="endpoint-description">Play the "${name}" voice file.</p>
        <div class="endpoint-method-info">
          <span class="method-tag get">GET</span>
          <span class="endpoint-path">/voice/${name}</span>
        </div>
        <div class="test-section">
          <h4 class="test-title">Test this Endpoint</h4>
          <div class="query-params">
            <span class="param-label">Direct Link</span>
            <input type="text" class="url-input" value="/voice/${name}" readonly>
          </div>
        </div>
      </div>
    `;
  }).join('\n');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Voice API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f0f0;
          text-align: center;
          padding: 50px;
        }
        h1 { color: #333; }
        .container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }

        /* API Card Styles */
        .api-card {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          margin: 10px;
          padding: 20px;
          border-left: 5px solid #663399;
          width: 300px;
          text-align: left;
        }
        .endpoint-title { font-size: 1.2rem; font-weight: 600; margin-top: 0; margin-bottom: 5px; color: #333; }
        .endpoint-description { font-size: 0.9rem; color: #666; margin-bottom: 10px; }
        .method-tag { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-right: 10px; }
        .method-tag.get { background-color: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; }
        .endpoint-path { font-family: monospace; color: #555; font-size: 0.9rem; }

        .test-section { margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; }
        .test-title { font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 8px; }
        .param-label { display: block; font-size: 0.8rem; color: #777; margin-bottom: 5px; }
        .url-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>🎙 Voice API</h1>
      <div class="container">
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
