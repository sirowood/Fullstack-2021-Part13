const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const errorHandler = require('./middlewares/errorhandler');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
};

start();
