import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import friendsRouter from './routes/friends';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Task',
      version: '1.0.0',
    },
  },
  apis: ['./routes/friends.ts'],
};

const specs = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/friends', friendsRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(4000, () => {
  console.log('Server is started');
});
