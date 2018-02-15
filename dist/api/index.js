'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require('../../package.json');

var _express = require('express');

var _facets = require('./facets');

var _facets2 = _interopRequireDefault(_facets);

var _tracking = require('./tracking');

var _tracking2 = _interopRequireDefault(_tracking);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // mount the facets resource
    api.use('/facets', (0, _facets2.default)({ config: config, db: db }));

    // perhaps expose some API metadata at the root
    api.get('/', function (req, res) {
        res.status(200).json({ version: _package.version, text: 'some' });
    });

    // get a tracking object with states etc. by tracking number
    api.get('/tracking', function (req, res) {
        // console.log('req.query: ', req.query);

        /* opt out if the tracking number is not valid because of checksum */
        if (!(0, _tracking.isValidTrackingNumber)(req.query.trackingNumber)) {
            res.status(200).json({ error: 'The tracking number is invalid' });
            return;
        }

        var details = { 'trackingNumber': req.query.trackingNumber };
        db.collection('shipment').findOne(details).then(function (item) {
            /* if item exists, send back the item with its states, otherwise send error message */
            var json = item ? item : { error: 'Could not find tracking information for ' + req.query.trackingNumber };
            res.status(200).json(json);
        }).catch(function (err) {
            console.log('err', err);
            res.json({ error: 'An error has occurred while searching for ' + req.query.trackingNumber + ' ' + err });
        });
    });

    // create a new tracking number with mocked states data
    api.post('/tracking', function (req, res) {
        // console.log('req, res', req.body)
        if (!req || !req.body.shipmentType || !req.body.sourceAdress || !req.body.targetAdress) {
            console.log("something missing");
            res.json({ error: 'A shipment has to contain a shipmentType, \n\t\t\t\t        a sourceAdress and a targetAdress property' });
            return;
        }

        var data = req.body;
        /* in order to garantue a really unique tracking number in the database, we search for
         * the generated tracking number within the db and generate a new tracking number
         * until there is no collision anymore. This approach assumes that the
         * database is cleared or archived after a fixed period of time to continually allow
         * produce really unique tracking numbers and not run out of available slots.
         */
        var shipmentObj = void 0,
            details = void 0;
        var findTrackingNumber = function findTrackingNumber() {
            shipmentObj = (0, _tracking2.default)(data);
            details = { trackingNumber: shipmentObj.trackingNumber };
            db.collection('shipment').findOne(details).then(function (item) {
                /* if an item with this tracking number was found, it is found in item
                 * otherwise its null and we generate a new tracking number recursively
                 */
                item !== null && findTrackingNumber();

                return db.collection('shipment').insertOne(shipmentObj);
            }).catch(function (err) {
                return console.log({ error: 'An error has occurred while inserting: ' + err });
            }).then(function (result) {
                /* resolve of db.collection('shipment').insertOne(shipmentObj) */
                console.log('result.ops', result && result.ops);
                result && result.ops && result.ops.length && res.json({ data: result.ops[0], trackingNumber: shipmentObj.trackingNumber });
            }).catch(function (err) {
                return res.send({ error: 'An error has occurred while inserting: ' + err });
            });
        };
        findTrackingNumber();
    });

    /* update existing shipment by tracking number, notice and state to update */
    api.put('/tracking', function (req, res) {
        var details = { 'trackingNumber': req.body.trackingNumber }; /* db search argument */
        var trackingItem = req.body;

        db.collection('shipment').findOne(details).then(function (item) {
            /* set scanned to true of according state and set a notice message */
            var updatedStates = item.states.slice();
            var updatedState = Object.assign({}, updatedStates[trackingItem.state]);
            updatedState.scanned = true;
            updatedState.notice = trackingItem.notice;
            updatedState.time = new Date();
            updatedStates[trackingItem.state] = updatedState;
            var updatedItem = Object.assign({}, item, { states: updatedStates });

            /* update in the db*/
            return db.collection('shipment').findOneAndUpdate(details, { $set: { states: updatedItem.states } });
        }).then(function (item) {
            var json = item ? item : { error: 'Could not find tracking information for ' + trackingItem.trackingNumber };
            res.status(200).json(json);
        }).catch(function (err) {
            console.log('err', err);
            res.status(404).json({ error: trackingItem.trackingNumber + ' not found. ' + err });
        });
        /* perfectly chain it to avoid callback hell */
    });

    return api;
};
//# sourceMappingURL=index.js.map