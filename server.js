const express = require('express');
const path = require('path');
const uuid = require('./Develop/helpers/uuid');
const db = require('./Develop/db/db.json')
const fs = require('fs');
const { readFromFile, writeToFile } = require('../../../upenn-fs-repo/01-Activities/11-Express/01-Activities/28-Stu_Mini-Project/Main/helpers/fsUtils');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for urlecoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Develop/public'));

// route to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

// route to notes database (db.json)
app.get('/api/notes', (req, res) => {
  return res.status(200).json(db)
});

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
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
      if(err) {
        console.error(err);
      } else {
        const parsedNotes =JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile('./Develop/db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => 
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

//  deletes a note from the notes list
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./Develop/db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      deletedNote = json.filter((note) => note.id !== noteId);
      writeToFile('./Develop/db/db.json', deletedNote);
      res.json(`Note ${noteId} has been deleted`)
    });
})

// routes for all other  GET requests go to index.html page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

//  start server on indacted port #
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));