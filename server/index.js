import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../.pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('[LISTENING] - port:', process.env.PORT, 'ip:', process.env.IP);
});
