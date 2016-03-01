import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import multer from 'multer';
import uuid from 'node-uuid';

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

import ObjectStorage from './object-storage';
const os = new ObjectStorage('52f3669377494493b17b2d804ff62f24', 'Pw8jV?M?2lSew&Fe', 'cd07aefb3a944d679e97ed0b37e39569');

app.post('/upload', uploadr.single('webcam'), function(req, res){

  let cc = 'cloud';

  os.create(cc)
  .then(() => {
    return os.unlock(cc)
  })
  .then(() => {
    return os.upload(cc, `webcam-${uuid.v1()}.jpg`, req.file);
  })
  .finally(() => {
    res.send('ok');
  });

});
