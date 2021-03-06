var sqlite3 = require('sqlite3').verbose();

module.exports = (function () {
    if (process.env.NODE_ENV === 'test') {
        return new sqlite3.Database('./db/test.sqlite');
    }
    console.log('connected');
    return new sqlite3.Database('./db/project.sqlite');
}());
