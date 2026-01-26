require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
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
    
    const existingEntry = urlData.find(item => item.original_url === req.body.url);
    if (existingEntry) {
      return res.json({
        original_url: existingEntry.original_url,
        short_url: existingEntry.short_url
      });
    };

    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
      return res.json({
        error: 'invalid url'
      })
    };

    const hostname = urlObject.hostname;
    dns.lookup(hostname, (err) => {
      if (err) {
        return res.json({
          error: 'invalid url'
        })
      } else {
        const shortUrlId = urlData.length + 1;
        const newShortUrl = {
          original_url: req.body.url,
          short_url: shortUrlId
        };
        urlData.push(newShortUrl);
        res.json(newShortUrl);
      }
    })
  } catch (error) {
    res.json({
      error: 'invalid url'
    });
  };
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const inputNumber = req.params.short_url
  const foundItem = urlData.find(item => item.short_url === parseInt(inputNumber));

  if (foundItem) {
    res.redirect(foundItem.original_url);
  } else {
    res.json({
      error: 'No short URL found for your input'
    });
  };
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
