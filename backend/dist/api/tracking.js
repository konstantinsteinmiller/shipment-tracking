'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isValidTrackingNumber = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _google = require('../config/google');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var GEO_CACHE = {};

var googleMapsApi = function () {
    return _axios2.default.create({
        baseURL: 'https://maps.googleapis.com',
        timeout: 5000
    });
}();

/* It fetches the geolocation of the city name by using google geocode api
 * @params: data (Object) contains a city property, which is to be found by the google api
 * @returns {Object} with city, longitude and longitude properties
*/
var getGeolocationFromGoogleMaps = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
        var location;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        location = data.city;

                        /* no need to refetch data from google apis if we already fetched it for a previous task */

                        if (!(location in GEO_CACHE)) {
                            _context.next = 5;
                            break;
                        }

                        // console.log( 'Cached ' + location + ' -> ' + GEO_CACHE[location].lat +  ' ' + GEO_CACHE[location].long );
                        data.latitude = GEO_CACHE[location].lat;
                        data.longitude = GEO_CACHE[location].long;
                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                            resolve(data);
                        }));

                    case 5:
                        return _context.abrupt('return', googleMapsApi.get('/maps/api/geocode/json?key=' + _google.google.key + '&address=' + encodeURIComponent(location)).then(function (response) {
                            if (response.data.results.length > 0) {
                                var info = {
                                    lat: response.data.results[0].geometry.location.lat,
                                    long: response.data.results[0].geometry.location.lng
                                };
                                GEO_CACHE[location] = info;
                                data.latitude = info.lat;
                                data.longitude = info.long;
                                console.log(location + ' -> ' + info.lat + ' ' + info.long);
                                return data;
                            } else {
                                console.log("Didn't find anything for " + location + ' ::' + JSON.stringify(response.data));
                            }
                        }).catch(function (err) {
                            return console.log('Error on ' + location + ' :' + err);
                        }));

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getGeolocationFromGoogleMaps(_x) {
        return _ref.apply(this, arguments);
    };
}();

/* creates a mocked states array for the purpose of the given scenario
 * @return list of state objects */
var assessStates = function assessStates() {
    /* normally here we would generate states according to the optimal logistic way for the shipment to happen
    * but I will only mock this part for simplicity reasons, since I don't have the necessary data to execute such a calculation.
    * We only get the states for the predifined use case of Oma Paschulke to Enkel Max */
    var date = new Date();
    var date2 = new Date(JSON.parse(JSON.stringify(date))).setHours(date.getHours() + 5);
    var date3 = new Date(new Date(JSON.parse(JSON.stringify(date))).setDate(date.getDate() + 1)).setHours(date.getHours() + 4);
    var date4 = new Date(new Date(JSON.parse(JSON.stringify(date)))).setDate(date.getDate() + 2);
    var date5 = new Date(new Date(JSON.parse(JSON.stringify(date))).setDate(date.getDate() + 2)).setHours(date.getHours() + 6);

    /* Fetch the geolocation data for each city on the whole shipment track, harvest caching when possible.
     * We use a forking of 5 parallel promise requests for each state entries town.
     * Then we join all promises and wait until all return (getting resolved or rejected)
     */
    return _axios2.default.all([getGeolocationFromGoogleMaps({ city: 'Hamburg' }), getGeolocationFromGoogleMaps({ city: 'Hamburg' }), getGeolocationFromGoogleMaps({ city: 'Osnabrück' }), getGeolocationFromGoogleMaps({ city: 'München' }), getGeolocationFromGoogleMaps({ city: 'München' })]).then(_axios2.default.spread(function (location1, location2, location3, location4, location5) {
        // console.log('locations', location1, location2, location3, location4, location5)
        return [{
            /* Packetshop somewhere in Hamburg */
            name: 'Paketshop Hamburg',
            location: {
                street: 'Hauptstraße',
                housenumber: '1',
                postcode: '0234',
                city: location1.city || 'Hamburg',
                country: 'Germany',
                latitude: location1.latitude,
                longitude: location1.longitude
            },
            time: date,
            image: 'small-office.svg',
            notice: 'Paket wurde um ' + date.toLocaleTimeString() + ' an einen Fahrer \xFCbergeben\n                    und befindet sich auf dem Weg in die Niederlassung Hamburg',
            scanned: true
        }, {
            /* Niederlassung Hamburg */
            name: 'Niederlassung Hamburg',
            location: {
                street: 'Hamburgerstraße',
                housenumber: '2',
                postcode: '0234',
                city: location2.city || 'Hamburg',
                country: 'Germany',
                latitude: location2.latitude,
                longitude: location2.longitude
            },
            time: date2,
            image: 'office.svg',
            scanned: false
        }, {
            /* Regionales Verteilzentrum Niedersachsen */
            name: 'Regionales Verteilzentrum Niedersachsen',
            location: {
                street: 'Niedersachsener Straße',
                housenumber: '3',
                postcode: '23331',
                city: location3.city || 'Osnabrück',
                country: 'Germany',
                latitude: location3.latitude,
                longitude: location3.longitude
            },
            time: date3,
            image: 'logistic_center.svg',
            scanned: false
        }, {
            /* Niederlassung München */
            name: 'Niederlassung München',
            location: {
                street: 'Oktoberfeststraße',
                housenumber: '4',
                postcode: '8898',
                city: location4.city || 'München',
                country: 'Germany',
                latitude: location4.latitude,
                longitude: location4.longitude
            },
            time: date4,
            image: 'office.svg',
            scanned: false
        }, {
            /* Zustellung Ziel */
            name: 'Haus Enkel Max',
            location: {
                street: 'Zielstraße',
                housenumber: '5',
                postcode: '8983',
                city: location5.city || 'München',
                country: 'Germany',
                latitude: location5.latitude,
                longitude: location5.longitude
            },
            time: date5,
            image: 'haus.png',
            scanned: false
        }];
    }));
};

/* checks if the given tracking number is a S10 UPU compliant tracking number
 * @params: trackingNumber (String)
 * @returns Boolean
 */
var isValidTrackingNumber = exports.isValidTrackingNumber = function isValidTrackingNumber(trackingNumber) {
    /* get the 9 digits and validate the checksum */
    var serialDigits = trackingNumber.substring(2, 11);
    var s = serialDigits;

    /* checksum calculation by https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    var checkSum = +s[0] * 8 + s[1] * 6 + s[2] * 4 + s[3] * 2 + s[4] * 3 + s[5] * 5 + s[6] * 9 + s[7] * 7;
    var checkSumDigit = 11 - checkSum % 11;
    if (checkSumDigit == 10) checkSumDigit = 0;
    if (checkSumDigit == 11) checkSumDigit = 5;

    return checkSumDigit == s[8];
};

/* generate unique tracking number for S10 UPU
 * @params: data (Object)
 * @returns Boolean
 */

exports.default = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var serviceIndicatorCode, serialDigits, s, checkSum, checkSumDigit, countryCode, trackingNumber;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        /* service indicator code as of S10 UPU Standard https://en.wikipedia.org/wiki/S10_(UPU_standard) */
                        serviceIndicatorCode = '';
                        // console.log('req', data)

                        switch (data.shipmentType) {
                            case 'parcel':
                                serviceIndicatorCode = 'C' + letters[Math.floor(Math.random() * 100) % 26];
                            case 'letter':
                                serviceIndicatorCode = 'L' + letters[Math.floor(Math.random() * 100) % 26];
                            case 'large letter':
                                serviceIndicatorCode = 'L' + letters[Math.floor(Math.random() * 100) % 26];
                            case 'postcard':
                                serviceIndicatorCode = 'L' + letters[Math.floor(Math.random() * 100) % 26];
                            /* ... etc. for all shipment types */
                            default:
                                serviceIndicatorCode = 'L' + letters[Math.floor(Math.random() * 100) % 26];
                        }

                        /* random serial digit derived from timestamp of max length 8 digits */
                        serialDigits = (new Date().getTime() % 100000000).toString(10);
                        s = serialDigits;

                        /* checksum calculation by https://en.wikipedia.org/wiki/S10_(UPU_standard) */

                        checkSum = +s[0] * 8 + s[1] * 6 + s[2] * 4 + s[3] * 2 + s[4] * 3 + s[5] * 5 + s[6] * 9 + s[7] * 7;
                        checkSumDigit = 11 - checkSum % 11;

                        if (checkSumDigit == 10) checkSumDigit = 0;
                        if (checkSumDigit == 11) checkSumDigit = 5;

                        countryCode = 'DE';

                        switch (data.sourceAdress.country) {
                            case 'Deutschland':
                                countryCode = 'DE';
                            case 'England':
                                countryCode = 'EN';
                            /* ... etc. */
                            default:
                                countryCode = 'DE';
                        }

                        trackingNumber = serviceIndicatorCode + serialDigits + checkSumDigit + countryCode;
                        return _context2.abrupt('return', assessStates().then(function (states) {
                            return _extends({}, data, {
                                trackingNumber: trackingNumber,
                                states: states /* data is mocked specifically for the use case */
                            });
                        }));

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function (_x2) {
        return _ref2.apply(this, arguments);
    };
}();
//# sourceMappingURL=tracking.js.map