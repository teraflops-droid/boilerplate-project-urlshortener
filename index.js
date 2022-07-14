require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongo = process.env.MONGO_URI;

mongoose.connect(mongo, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

let urlSchema = new mongoose.Schema({
  url: String,
  shortUrl: Number
})

let ModelUrl = mongoose.model('ModelUrl', urlSchema);

 
const shortenTheUrl = (url, done) => {
  url = url.toString();
  ModelUrl.create( { 
    url: url , 
    shortUrl : Math.floor(Math.random() * 999)
  }, 
    ( err, data ) => {
    if(err) return console.log(err);
    done(null, data)
    console.log('Saved in database: ' + data)
  })
}
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res, next) {
  res.json({ greeting: 'hello API' });
  next(null, data)
});

app.use(bodyParser.urlencoded({ extended: false}));

app.post('/api/shorturl', (req,res) => {
  console.log(req.body.url)
  shortenTheUrl(req.body.url, (err, data) => {
    if(err) console.log(err)
      res.json(data);
  })

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
