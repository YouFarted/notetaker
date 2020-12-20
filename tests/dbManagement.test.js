const dbManagement = require('../lib/dbManagement')
const fs = require('fs')

jest.mock('fs')

test('verify internalSaveDbFile saves to a file', () => {

    const saveThis = { a: 1, b: 2 };
    const expectedToSave = '{"a":1,"b":2}'
    let whatWasSaved = null

    // Arrange
    const spyAccess = jest.spyOn(fs, "access")
        .mockImplementation((_dbdir, cb) => cb(null));
    const spyWriteFile = jest.spyOn(fs, 'writeFile')
        .mockImplementation((_1, dataToSave, cb) => {
            whatWasSaved = dataToSave
            cb(null)
        });

    // Act
    dbManagement.internalSaveDbFile(saveThis, function () { })

    // Assert
    expect(whatWasSaved).toBe(expectedToSave)
    expect(spyWriteFile).toHaveBeenCalled()
    expect(spyAccess).toHaveBeenCalled()
});

test('verify internalLoadDbFile loads from a file', () => {

    const expectedToLoad = { a: 1, b: 2 };
    const pretendToLoadThisData = '{"a":1,"b":2}'
    let whatWasLoaded = null
    // Arrange

    const spyAccess = jest.spyOn(fs, "access")
        .mockImplementation((_dbdir, cb) => cb(null));
    const spyReadFile = jest.spyOn(fs, 'readFile')
        .mockImplementation((_1, cb) => {
            cb(null, pretendToLoadThisData)
        });

    // Act
    dbManagement.internalLoadDbFile(function (err, data) {
        whatWasLoaded = data
    })

    // Assert
    expect(whatWasLoaded).toEqual(expectedToLoad)
    expect(spyReadFile).toHaveBeenCalled()
    expect(spyAccess).toHaveBeenCalled()
});
