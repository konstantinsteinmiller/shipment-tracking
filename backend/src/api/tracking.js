const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let assessStates = function(){
    /* normally here we would generate states according to the optimal logistic way for the shipment to happen
    * but I will only mock this part, since I don't have the necessary data to execute such a calculation.
    * We only get the states for the predifined use case of Oma Paschulke to Enkel Max */
    return [
        {
            /* Paketshop irgendwo Hamburg */
            location: {
                street: 'Hauptstraße',
                housenumber: '1',
                postcome: '0234',
                city: 'Hamburg',
                country: 'Germany'
            },
            time: new Date(2018, 2, 12, 12, 3, 0, 0),
            scanned: false
        },
        {
            /* Niederlassung Hamburg */
            location: {
                street: 'Hamburgerstraße',
                housenumber: '2',
                postcome: '0234',
                city: 'Hamburg',
                country: 'Germany'
            },
            time: new Date(2018, 2, 12, 14, 5, 0, 0),
            scanned: false
        },
        {
            /* Regionales Verteilzentrum Niedersachsen */
            location: {
                street: 'Niedersachsener Straße',
                housenumber: '3',
                postcome: '23331',
                city: 'Osnabrück',
                country: 'Germany'
            },
            time: new Date(2018, 2, 13, 8, 35, 0, 0),
            scanned: false
        },
        {
            /* Niederlassung München */
            location: {
                street: 'Oktoberfeststraße',
                housenumber: '4',
                postcome: '8898',
                city: 'München',
                country: 'Germany'
            },
            time: new Date(2018, 2, 14, 7, 10, 0, 0),
            scanned: false
        },
        {
            /* Zustellung Ziel */
            location: {
                street: 'Zielstraße',
                housenumber: '5',
                postcome: '8983',
                city: 'München',
                country: 'Germany'
            },
            time: new Date(2018, 2, 14, 10, 45, 0, 0),
            scanned: false
        }
    ]
}

export default function (data) {
    /* generate unique tracking number
    *  service indicator code as of S10 UPU Standard https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    let serviceIndicatorCode = '';
    // console.log('req', data)
    switch(data.shipmentType){
        case 'parcel': serviceIndicatorCode = 'C' + letters[Math.floor(Math.random()*100) % 26];
        case 'letter': serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
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
    const shipmentObj = {
        ...data,
        trackingNumber,
        states: assessStates() /* data is mocked specifically for the use case */
    }
    return shipmentObj;
}
