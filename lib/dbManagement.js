const path = require('path')
const fs   = require('fs')

function internalLoadDbFile(cb) {
    var fallbackData = [{"title":"Test Title","text":"Test text"}]
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
                    console.error(`Accessing ${dbDir} is impossible.  Err = ${errMkdir}`)
                    return cb(err,fallbackData)
                })
            }
            console.error(err)
            return cb(err, fallbackData);
        }
        // the directory is there.  Now get the file contents if it's there
        fs.readFile(dbFile, (readDbFileErr, data) => {

            if(readDbFileErr) {
                return cb(null, fallbackData)
            } else {
                const jsonFileData = JSON.parse(data)
                return cb(null, jsonFileData)
            }
        })
    })
}

function internalSaveDbFile(notes, cb) {
    const notesJsonString = JSON.stringify(notes)
    const dbDir = path.join(__dirname,"..", "db")
    const dbFile = path.join(__dirname, "..", "db", "db.json")
    fs.access(dbDir, (err) => {
        if(err) {
            if(err.code === "ENOENT") {
                fs.mkdir(dbDir, (errMkdir) => {
                    if(errMkdir) {
                        // no existing dir and I can't mkdir it.
                        // I've done what I can.  This is the end of the road.
                        // respond with the baseline notes and just eat the problem quietly.
                        // Saving can't happen.
                        console.error(`Accessing ${dbDir} is impossible.  Err = ${errMkdir}`)
                        cb(errMkdir)
                    } else {
                        // mkdir succeeded.  Continue to try to write the file
                        fs.writeFile(dbFile, notesJsonString, (err) => {
                            if(err) {
                                cb(err)
                            } else {
                                cb(null)
                            }
                        })
                    }
                })
            }
            // random unhandled directory access failure.  Fail out.
            console.error(err)
            return cb(err);
        }
        // the directory is there.  Now go for the file
        fs.writeFile(dbFile, notesJsonString,  (writeDbFileErr ) => {//!!!!

            if(writeDbFileErr) {
                console.error("I couldn't write to the db file: " + writeDbFileErr )
                
                return cb(writeDbFileErr)
            }
            cb(null)
        })
    })
}

function internalAppendToDbFile(newNote, cb) {
    internalLoadDbFile((err, data )=>{
        if(err) {
            cb(err)
        } else{
            var existingNotes = data
            
            existingNotes.push(newNote)
            internalSaveDbFile( existingNotes, cb)
        }
    })
}

function loadDatabase(req, res) {
    
    var fallbackData = [{"title":"Test Title","text":"Test text"}]

    internalLoadDbFile((err, data )=>{
        if(err) {
            res.json(fallbackData)
        } else {
            res.json(data)
        }
    })
}

// there exists function internalAppendToDbFile(newNote, cb)
function addToDatabase(req, res) {
    var newDataToSave = req.body
    if(!newDataToSave) {
        console.error("Middleware problem. I'm routing in from a POST and there's no POST data???")
        res.end()
    }
    
    internalAppendToDbFile(newDataToSave, (err) => {
        if(err) {
            res.end()
        } else {
            res.end()
        }
    })
}

module.exports.loadDatabase  = loadDatabase;
module.exports.addToDatabase = addToDatabase;