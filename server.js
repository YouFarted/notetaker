const express = require('express')
const path = require('path')
const fs = require('fs')
const loadDatabase = require('./lib/dbManagement').loadDatabase

const app = express()
const PORT = process.env.port | 8080

app.use(express.static('public'))

app.get('/api/notes', function(req, res) { loadDatabase(res) });
app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
});
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
