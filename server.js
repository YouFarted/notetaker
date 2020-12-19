const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.port | 8080

app.use(express.static('public'))

app.get('/api/notes', function(req, res) {
    console.log("get from api/notes")

    // try to open the persistent database file in db/db.json
    const dbDir = path.join(__dirname, "db")
    const dbFile = path.join(__dirname, "db", "db.json")
    fs.access(dbDir, (err) => {// todo destroy this dir and ensure i recreate it if it doesn't exist
        if(err) {
            console.error(err)
            return;
        }
        // the directory is there.  Now get the file contents if it's there
        fs.readFile(dbFile, (readErr, data) => {
            if(readErr) {
                console.error(readErr)
                // TODO do this only is it doesn't exist.  Other errors blow up obnoxously
                res.json([{"title":"Test Title","text":"Test text"}])
            }
            const jsonFileData = JSON.parse(data)
            console.log(jsonFileData)
            res.json(jsonFileData)
        })
    })

    //res.json(["a", "b"]);
});
app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
});
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
