const fs =           require('fs')
const path =         require('path')
const express =      require('express')
const bodyParser =   require('body-parser');
const dbManagement = require('./lib/dbManagement')

const app = express()
const PORT = process.env.PORT | 8080

// middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

app.get('/api/notes', dbManagement.webapiLoadDatabase );
app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
});
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/api/notes', dbManagement.webapiAddToDatabase )

app.delete('/api/notes/:id', dbManagement.webapiDeleteFromDatabase)


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
