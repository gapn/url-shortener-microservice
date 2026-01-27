require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

const urlData = [];
let idCounter = 1;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  try {
    const urlObject = new URL(originalUrl);
    
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
          return res.json({
            error: 'invalid url'
          })
        };

    const existingEntry = urlData.find(item => item.original_url === originalUrl);
    if (existingEntry) {
      return res.json({
        original_url: existingEntry.original_url,
        short_url: existingEntry.short_url
      });
    };

    const hostname = urlObject.hostname;
    dns.lookup(hostname, (err) => {
      if (err) {
        return res.json({
          error: 'invalid url'
        })
      }

      const newEntry = {
        original_url: originalUrl,
        short_url: idCounter++
      };
      urlData.push(newEntry);
      res.json(newEntry);
    })
  } catch (error) {
    res.json({
      error: 'invalid url'
    });
  };
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const foundItem = urlData.find(item => item.short_url === shortUrl);

  if (foundItem) {
    res
      .status(302)
      .set('Location', foundItem.original_url)
      .end();
  } else {
    res.json({
      error: 'No short URL found for your input'
    });
  };
})

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

module.exports = app;