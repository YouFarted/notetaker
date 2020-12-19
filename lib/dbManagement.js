const path = require('path')
const fs   = require('fs')

function loadDatabase(res) {
    console.log("get from api/notes")
    var fallbackData = [{"title":"Test Title","text":"Test text"}]

    // try to open the persistent database file in db/db.json
    const dbDir = path.join(__dirname,"..", "db")
    const dbFile = path.join(__dirname, "..", "db", "db.json")
    fs.access(dbDir, (err) => {
        if(err) {
            if(err.code === "ENOENT") {
                fs.mkdir(dbDir, (errMkdir) => {
                    // no existing dir and I can't mkdir it.
                    // I've done what I can.  This is the end of the road.
                    // respond with the baseline notes and just eat the problem quietly.
                    // Saving can't happen.
                    console.error(`Saving to ${dbDir} impossible.  Err = ${errMkdir}`)
                    res.json(fallbackData)
                })
            }
            console.error(err)
            return;
        }
        // the directory is there.  Now get the file contents if it's there
        fs.readFile(dbFile, (readDbFileErr, data) => {

            if(readDbFileErr) {
                if(readDbFileErr.code === "ENOENT") {
                    // The file's not there.  Create it and init it with boilerplate

                    fs.writeFile(dbFile, JSON.stringify(fallbackData), (err) => {
                        if(err) {
                            console.error("couldn't create db file: " + err)
                        }
                    })
                } else {
                    console.error("unhandled db read error:" + readErr)
                }
                
                return res.json(fallbackData)
            }
            const jsonFileData = JSON.parse(data)
            console.log(jsonFileData)
            res.json(jsonFileData)
        })
    })
}

module.exports.loadDatabase = loadDatabase;