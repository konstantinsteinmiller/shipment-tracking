import axios from 'axios'
import { google } from '../config/google'

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let GEO_CACHE = {};

let googleMapsApi = function() {
    return axios.create({
        baseURL: 'https://maps.googleapis.com',
        timeout: 5000
    })
}();


/* It fetches the geolocation of the city name by using google geocode api
 * @params: data (Object) contains a city property, which is to be found by the google api
 * @returns {Object} with city, longitude and longitude properties
*/
const getGeolocationFromGoogleMaps = function ( data ) {
    let location = data.city;

    /* no need to refetch data from google apis if we already fetched it for a previous task */
    if (location in GEO_CACHE) {
        // console.log( 'Cached ' + location + ' -> ' + GEO_CACHE[location].lat +  ' ' + GEO_CACHE[location].long );
        data.latitude = GEO_CACHE[location].lat;
        data.longitude = GEO_CACHE[location].long;
        return new Promise((resolve, reject) => { resolve(data) })
    }

    return googleMapsApi.get('/maps/api/geocode/json?key=' + google.key + '&address=' + encodeURIComponent(location))
        .then((response) => {
            if (response.data.results.length > 0) {
                let info = {
                    lat: response.data.results[0].geometry.location.lat,
                    long: response.data.results[0].geometry.location.lng
                };
                GEO_CACHE[location] = info;
                data.latitude = info.lat;
                data.longitude = info.long;
                console.log(location + ' -> ' + info.lat + ' ' + info.long);
                return data
            } else { console.log( "Didn't find anything for " + location + ' ::' + JSON.stringify(response.data) ); }
        }).catch((err) => console.log('Error on ' + location + ' :' + err) );
};


/* creates a mocked states array for the purpose of the given scenario
 * @return list of state objects */
let assessStates = function(){
    /* normally here we would generate states according to the optimal logistic way for the shipment to happen
    * but I will only mock this part for simplicity reasons, since I don't have the necessary data to execute such a calculation.
    * We only get the states for the predifined use case of Oma Paschulke to Enkel Max */
    const date = new Date();
    const date2 = new Date(JSON.parse(JSON.stringify(date))).setHours(date.getHours()+5);
    const date3 = new Date(new Date(JSON.parse(JSON.stringify(date))).setDate(date.getDate()+1)).setHours(date.getHours()+4);
    const date4 = new Date(new Date(JSON.parse(JSON.stringify(date)))).setDate(date.getDate()+2);
    const date5 = new Date(new Date(JSON.parse(JSON.stringify(date))).setDate(date.getDate()+2)).setHours(date.getHours()+6);


    /* Fetch the geolocation data for each city on the whole shipment track, harvest caching when possible.
     * We use a forking of 5 parallel promise requests for each state entries town.
     * Then we join all promises and wait until all return (getting resolved or rejected)
     */
    return axios.all([
        getGeolocationFromGoogleMaps({ city: 'Hamburg' }),
        getGeolocationFromGoogleMaps({ city: 'Hamburg' }),
        getGeolocationFromGoogleMaps({ city: 'Osnabrück' }),
        getGeolocationFromGoogleMaps({ city: 'München' }),
        getGeolocationFromGoogleMaps({ city: 'München' })
    ])
        .then(axios.spread(function (location1, location2, location3, location4, location5) {
            // console.log('locations', location1, location2, location3, location4, location5)
            return [
                {
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
                    notice: `Paket wurde um ${date.toLocaleTimeString()} an einen Fahrer übergeben
                    und befindet sich auf dem Weg in die Niederlassung Hamburg`,
                    scanned: true
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                }
            ]
        }));

}

/* checks if the given tracking number is a S10 UPU compliant tracking number
 * @params: trackingNumber (String)
 * @returns Boolean
 */
export const isValidTrackingNumber = function (trackingNumber) {
    /* get the 9 digits and validate the checksum */
    let serialDigits = trackingNumber.substring(2,11);
    const s = serialDigits;

    /* checksum calculation by https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    let checkSum = +s[0]*8 + s[1]*6 + s[2]*4 + s[3]*2 + s[4]*3 + s[5]*5 + s[6]*9 + s[7]*7;
    let checkSumDigit = 11 - (checkSum % 11);
    if (checkSumDigit == 10) checkSumDigit = 0;
    if (checkSumDigit == 11) checkSumDigit = 5;

    return checkSumDigit == s[8];
}

/* generate unique tracking number for S10 UPU
 * @params: data (Object)
 * @returns Boolean
 */
export default function (data) {
    /* service indicator code as of S10 UPU Standard https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    let serviceIndicatorCode = '';
    // console.log('req', data)

    switch(data.shipmentType){
        case 'parcel': serviceIndicatorCode = 'C' + letters[Math.floor(Math.random()*100) % 26];
        case 'letter': serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
        case 'large letter': serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
        case 'postcard': serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
        /* ... etc. for all shipment types */
        default: serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
    }

    /* random serial digit derived from timestamp of max length 8 digits */
    let serialDigits = (new Date().getTime() % 100000000).toString(10)
    const s = serialDigits;

    /* checksum calculation by https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    let checkSum = +s[0]*8 + s[1]*6 + s[2]*4 + s[3]*2 + s[4]*3 + s[5]*5 + s[6]*9 + s[7]*7;
    let checkSumDigit = 11 - (checkSum % 11);
    if (checkSumDigit == 10) checkSumDigit = 0;
    if (checkSumDigit == 11) checkSumDigit = 5;

    let countryCode = 'DE';
    switch(data.sourceAdress.country){
        case 'Deutschland': countryCode = 'DE';
        case 'England': countryCode = 'EN';
        /* ... etc. */
        default: countryCode = 'DE';
    }

    let trackingNumber = serviceIndicatorCode + serialDigits + checkSumDigit + countryCode;

    return assessStates()
        .then((states) => {
            return {
                ...data,
                trackingNumber,
                states: states /* data is mocked specifically for the use case */
            };
        })
}
