'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (data) {
    /* generate unique tracking number
    *  service indicator code as of S10 UPU Standard https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    var serviceIndicatorCode = '';
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
    var serialDigits = (new Date().getTime() % 100000000).toString(10);
    var s = serialDigits;

    /* checksum calculation by https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    var checkSum = +s[0] * 8 + s[1] * 6 + s[2] * 4 + s[3] * 2 + s[4] * 3 + s[5] * 5 + s[6] * 9 + s[7] * 7;
    var checkSumDigit = 11 - checkSum % 11;
    if (checkSumDigit == 10) checkSumDigit = 0;
    if (checkSumDigit == 11) checkSumDigit = 5;

    var countryCode = 'DE';
    switch (data.sourceAdress.country) {
        case 'Deutschland':
            countryCode = 'DE';
        case 'England':
            countryCode = 'EN';
        /* ... etc. */
        default:
            countryCode = 'DE';
    }

    var trackingNumber = serviceIndicatorCode + serialDigits + checkSumDigit + countryCode;
    var shipmentObj = _extends({}, data, {
        trackingNumber: trackingNumber,
        states: assessStates() /* data is mocked specifically for the use case */
    });
    return shipmentObj;
};

var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var assessStates = function assessStates() {
    /* normally here we would generate states according to the optimal logistic way for the shipment to happen
    * but I will only mock this part, since I don't have the necessary data to execute such a calculation.
    * We only get the states for the predifined use case of Oma Paschulke to Enkel Max */
    var date = new Date();
    var date2 = new Date(JSON.parse(JSON.stringify(date))).setHours(date.getHours() + 5);
    var date3 = new Date(new Date(JSON.parse(JSON.stringify(date))).setDate(date.getDate() + 1)).setHours(date.getHours() + 4);
    var date4 = new Date(new Date(JSON.parse(JSON.stringify(date)))).setDate(date.getDate() + 2);
    var date5 = new Date(new Date(JSON.parse(JSON.stringify(date))).setDate(date.getDate() + 2)).setHours(date.getHours() + 6);
    return [{
        /* Paketshop irgendwo Hamburg */
        name: 'Paketshop Hamburg',
        location: {
            street: 'Hauptstraße',
            housenumber: '1',
            postcode: '0234',
            city: 'Hamburg',
            country: 'Germany'
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
            city: 'Hamburg',
            country: 'Germany'
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
            city: 'Osnabrück',
            country: 'Germany'
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
            city: 'München',
            country: 'Germany'
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
            city: 'München',
            country: 'Germany'
        },
        time: date5,
        image: 'haus.png',
        scanned: false
    }];
};
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
//# sourceMappingURL=tracking.js.map