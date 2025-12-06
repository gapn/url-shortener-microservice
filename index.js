require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const urlData = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  try {
    let urlObject = new URL(req.body.url);
    const shortUrlId = urlData.length + 1;
    const newShortUrl = {
      original_url: req.body.url,
      short_url: shortUrlId
    };
    urlData.push(newShortUrl);

    res.json(newShortUrl);
  } catch (error) {
    res.json({
      error: 'invalid url'
    });
  };
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
