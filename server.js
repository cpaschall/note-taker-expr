// GIVEN a note-taking application

const express = require('express');
const path = require('path');
const uuid = require('./uuid');
const db = require('./Develop/db/db.json')
const fs = require('fs');
const { readFromFile, writeToFile } = require('../../../upenn-fs-repo/01-Activities/11-Express/01-Activities/28-Stu_Mini-Project/Main/helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();
// Middleware for urlecoded data
// `urlencoded` data represents a URL encoded form. If we had a HTML form with fields: `username` and `password`, our urlencoded data would be "username=JohnAppleseed&password=passw0rd"
// This middleware will parse that string into an object containing key value pairs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

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

// const { title, text } = 

// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notesers\cpasc\OneDrive\UPENN\Homework\week-12\not
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

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
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));