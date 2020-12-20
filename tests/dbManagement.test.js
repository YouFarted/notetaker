const dbManagement = require('../lib/dbManagement')
const fs = require('fs')

jest.mock('fs')

test('verify internalSaveDbFile saves to a file', () => {

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
    dbManagement.internalSaveDbFile({ a: 1, b: 2 }, function () { })

    // Assert
    expect(whatWasSaved).toBe(expectedToSave)
    expect(spyWriteFile).toHaveBeenCalled()
});
