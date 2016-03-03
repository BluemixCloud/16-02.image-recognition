import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import multer from 'multer';
import uuid from 'node-uuid';
import request from 'request-promise';

const storage = multer.memoryStorage();
const uploadr = multer({storage: storage});

const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../.pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('[LISTENING] - port:', process.env.PORT, 'ip:', process.env.IP);
});

import ObjectStorage from 'bluemix-object-storage';
const os = new ObjectStorage('52f3669377494493b17b2d804ff62f24', 'Pw8jV?M?2lSew&Fe', 'cd07aefb3a944d679e97ed0b37e39569');
let cc = 'morgan';

app.post('/upload', uploadr.single('webcam'), function(req, res){

  let img = `webcam-${uuid.v1()}.jpg`;
  let full = `https://dal.objectstorage.open.softlayer.com/v1/AUTH_cd07aefb3a944d679e97ed0b37e39569/${cc}/${img}`;

  os.create(cc)
  .then(() => {
    return os.unlock(cc)
  })
  .then(() => {
    return os.upload(cc, img, req.file.mimetype, req.file.buffer, req.file.size);
  })
  .then(() => {
    const o = {url: 'http://chyld-nodered.mybluemix.net/analyze', method: 'post', json: true, body: {full}};
    return request(o);
  })
  .then((v) => {
    console.log('response from nodered:', v);
  })
  .finally(() => {
    res.send('ok');
  });

});

// -------------------------------------------------------------------------- //


app.post('/audio', uploadr.single('superfile'), function(req, res){
  let song = `music-${uuid.v1()}.wav`;
  os.upload(cc, song, req.file.mimetype, req.file.buffer, req.file.size).then(function(){
    res.send('ok');
  });
});


// -------------------------------------------------------------------------- //

app.all('/proxy', function(req, res){
    var o = {
      uri: req.query.url,
      method: req.method,
      json: true,
    };

    if(Object.keys(req.body).length){
      o.body = req.body;
    }

    console.log('request to NodeRED:', o);
    request(o, function(e, r, b){
      console.log('response from NodeRED:', b);
      res.send({error: e, status: r.statusCode, request: o, response: b});
    });
});

// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //

// CREATE TABLE IN DB2
// create table images
// (
//   id integer not null generated always as identity (start with 1 increment by 1),
//   primary key (id),
//   score double,
//   label varchar(128),
//   url varchar(500),
//   created_at timestamp
// );

// INSERT SINGLE VALUE
// msg.payload = {CREATED_AT: 'TIMESTAMP',
//               URL: msg.payload.url,
//               LABEL: msg.payload.scores[0].label_name,
//               SCORE: msg.payload.scores[0].label_score};
// return msg;

// INSERT AN ARRAY OF VALUES
// var array = msg.payload.scores.map(function(score){
//     return {
//         CREATED_AT: 'TIMESTAMP',
//         URL: msg.payload.url,
//         LABEL: score.label_name,
//         SCORE: score.label_score
//     };
// });
// msg.payload = array;

// QUERY DB2
// select * from images5 where score > ?;
