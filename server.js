// GIVEN a note-taking application

const express = require('express');
const path = require('path');
const uuid = require('./uuid');
const db = require('./Develop/db/db.json')
const fs = require('fs')

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
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  // console.log(req.method);
  return res.status(200).json(db)
  // console.log(res.json(db))

});


app.post('/api/notes', (req, res) => {
  // console.log(req.method);
  return res.status(200).json(db)
  // console.log(res.json(db))

})
// const { title, text } = 

// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notesers\cpasc\OneDrive\UPENN\Homework\week-12\not
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column


// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));