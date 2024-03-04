const config = require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');

const healthRouter = require('./routes/health');
const notesRouter = require('./routes/notes');
const noteRouter = require('./routes/note');

if (config.error) {
  throw config.error;
}

const port = process.env.PORT;
global.port = port;

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO-1: Set up database connection.
// Database connection is already set up here.
const url = 'mongodb://localhost:27017/';
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    const db = client.db('mydb');
    console.log('Database connected!');
    app.locals.db = db;
    
    // TODO-2: Upon database connection success, create the relevant table(s) if it does not exist.
    // Creating relevant database collections if they do not exist
    db.createCollection('notes')
      .then(() => {
        console.log('Notes collection created');
      })
      .catch((error) => {
        console.error('Error creating notes collection:', error);
      });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
  res.send('CSBC1010 Assignment 3 - My Notes');
});

app.use('/health', healthRouter);
app.use('/notes', notesRouter);
app.use('/note', noteRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
