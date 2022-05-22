const express = require('express');
const path = require('path');
const uuid = require('./uuid');
const db = require('./Develop/db/db.json')
const fs = require('fs')
const { readAndAppend } = require('./public/index2.js')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if(req.body) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };
        readAndAppend(newNote, db);
    } else {
        res.error("Error adding a note.")
    };
});

app.get('/api/notes', (req, res) => {
    return res.status(200).json(db)
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index2.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));