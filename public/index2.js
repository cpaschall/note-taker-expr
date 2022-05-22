const { response } = require("express");

const noteEl = document.getElementById("note-list");
const addNoteBtn = document.getElementById("notes-btn");

const getNotes = () => 
    fetch('/api/notes', {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((data) => data);

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err) {
            console(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            fs.writeFile(file, parsedData);
        }
    })
};

// append new object to database
const postNote = (note) => 
    fetch('/api/notes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    })
        .then((response) => response.json())
        .then((data) => {
            data
        })
        .catch((error) => {
            console.error('Error:', error);
        });

const addNoteObj = (event) => {
    event.preventDefault();
    const noteTitle = document.getElementById('note-title').value;
    const noteText = document.getElementById('note-textarea').value;
    const newNote = {
        title: noteTitle,
        text: noteText
    };
    postNote(newNote);
    submitNote();
}
        
// render cards for each  object in the database
const renderNote = (note) => {
    const cardEl = document.createElement('div');
    const cardTitleEl = document.createElement('div');
    const cardBodyEl = document.createElement('div');

    cardEl.classList.add('note-card');
    cardTitleEl.classList.add('card-title');
    cardBodyEl.classList.add('card-body');

    cardTitleEl.innerHTML = note.title;
    cardBodyEl.innerHTML = note.text;

    cardEl.appendChild(cardTitleEl);
    cardEl.appendChild(cardBodyEl)
    noteEl.appendChild(cardEl)
};

const submitNote = () => {
    noteEl.innerHTML = '';
    getNotes().then((response) => response.forEach((item) => renderNote(item)));
};

const notesInit = () => {
    getNotes().then((response) => response.forEach((item) => renderNote(item)));
}

addNoteBtn.addEventListener('click', addNoteObj);

notesInit();