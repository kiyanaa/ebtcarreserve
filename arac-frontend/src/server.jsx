// server.js
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// Build klasörünü servis et
app.use(express.static(path.join(__dirname, 'dist')));

// Tüm diğer URL'leri index.html'e yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
