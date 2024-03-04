
const config = require('dotenv').config()
const cors = require('cors')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

const healthRouter = require("./routes/health")
const notesRouter = require("./routes/notes")
const noteRouter = require("./routes/note")

if (config.error) {
  throw config.error
}

const port = process.env.PORT // || 3001
global.port = port

const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*
  TODO-1: Settup Database connection
*/
const url = "mongodb://localhost:27017/";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database connected!");

  /*
    TODO-2: Upon database connection success, create the relavent table(s) if it does not exist.
  */
  const dbo = db.db("mydb");
  dbo.createCollection("notes", function(err, res) {
    if (err) throw err;
    console.log("Notes collection created!");
    db.close();
  });
});

app.get('/', (req, res) => {
  res.send('CSBC1010 Assignment 3 - My Notes')
})

app.use("/health", healthRouter)
app.use("/notes", notesRouter)
app.use("/note", noteRouter)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})


