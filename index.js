require('dotenv').config();

const dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const { log } = require('console');
const { doesNotReject } = require('assert');
const { json } = require('body-parser');
const mongo = process.env.MONGO_URI;

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
})

let ModelUrl = mongoose.model('ModelUrl', urlSchema);

// Create url in database and shorten url
const shortenTheUrl = (url, done) => {
  let data;
  let validateUrl = dns.lookup(url, (err, addresses, family) => {
    if (err) return data = json({ error: 'invalid url' })
  })
  if(validateUrl) 
  return ModelUrl.create({
    original_url: url,
    short_url: Math.floor(Math.random() * 999)
  },
    (err, data) => {
      if (err) return console.log(err);
      console.log('Saved in database: ' + data)
      done(null, data)

    })

}

// Find url by short url
const findByShortUrl = (shortUrl, done) => {
  ModelUrl.findOne({ short_url: shortUrl }, (err, data) => {
    if (err) return console.log(err)
    done(null, data)
  })
}


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function (req, res, next) {
  res.json({ greeting: 'hello API' });
  next(null, data)
});


// Api to shorten url
app.post('/api/shorturl', (req, res) => {
  const inputUrl = req.body.url;
  console.log("original_url: " + inputUrl)
  shortenTheUrl(inputUrl, (err,data) => {
    if(err) {
      res.send({err})
      return;
    } else {
      console.log("response: " + data)
      res.send({original_url: data.original_url, shortUrl: data.short_url})
      return;
    }
  })
})

app.get('/api/shorturl/:shorturl', (req,res,next) => {
  let input = req.params.shorturl
  input = parseInt(input)
  findByShortUrl(input, (err,data) => {
    if(err) {
      next(err)
    }
    res.redirect(data.original_url);
  });
})


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
