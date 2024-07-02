const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs for each note
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public')); // Serves static files from 'public' directory

// HTML route that serves notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read notes:", err);
            return res.status(500).json({ message: 'Failed to read notes data.' });
        }
        res.json(JSON.parse(data));
    });
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };  // Assign a unique ID using uuid
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read notes:", err);
            return res.status(500).json({ message: 'Failed to read notes data.' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), err => {
            if (err) {
                console.error("Failed to save note:", err);
                return res.status(500).json({ message: 'Failed to save the note.' });
            }
            res.json(newNote);
        });
    });
});

// Default route that serves index.html (catch-all route)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
