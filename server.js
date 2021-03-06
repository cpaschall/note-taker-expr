const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const db = require('./db/db.json')
const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for urlecoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

// add note to db.json
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if( title && text) {
    const newNote = {
      title,
      text,
      id : uuid(),
    };
    // get existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if(err) {
        console.error(err);
      } else {
        const parsedNotes =JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => 
          writeErr ? console.error(writeErr) : console.info("Successfully added note to database.")
        );
      }
    });
    const response = {
      status: 'success',
      body: newNote,
    };
    return res.status(201).json(response);
  } else {
    return res.status(500).json("Error in posting")
  }
});

// route to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// route to notes database (db.json)
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      return res.status(200).json(json)
    })
});

//  deletes a note from the notes list
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  // fs.readFile('./db/db.json', 'utf-8', )
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      deletedNote = json.filter((note) => note.id !== noteId);
      writeToFile('./db/db.json', deletedNote);
      res.json(`Note ${noteId} has been deleted`)
    });
});

// routes for all other  GET requests go to index.html page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

//  start server on indacted port #
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));