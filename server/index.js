import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import multer from 'multer';

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


import {getToken, list, create, read, upload} from './object-storage';

app.post('/upload', uploadr.single('webcam'), function(req, res){
  let tt;
  let cc = 'gamma';
  let r = Math.floor(Math.random() * 1000) + 1;

  getToken('52f3669377494493b17b2d804ff62f24', 'Pw8jV?M?2lSew&Fe', 'cd07aefb3a944d679e97ed0b37e39569')
  .then(function(t){
    tt = t;
    return create(cc, tt);
  })
  .then(function(t){
    return read(cc, tt);
  })
  .then(function(t){
    return upload(cc, `webcam-${r}.jpg`, req.file, tt);
  })
  .then(function(d){
    res.send('ok');
  });
});
