'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('./config/index');

var _mongodb = require('mongodb');

exports.default = function (callback) {
    // connect to a database if needed, then pass it to `callback`:

    _mongodb.MongoClient.connect(_index.db.uri, function (err, client) {
        err && console.warn('err: ', err);
        var database = client.db("shiptrack");
        // perform actions on the collection object
        console.log('-- db connection established --');
        callback(database);
        // client.close();
    });
};
//# sourceMappingURL=db.js.map