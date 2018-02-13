const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export default function (data) {
    /*generate unique tracking number*/
    /* service indicator code as of S10 UPU Standard https://en.wikipedia.org/wiki/S10_(UPU_standard) */
    let serviceIndicatorCode = '';
    // console.log('req', data)
    switch(data.shipmentType){
        case 'parcel': serviceIndicatorCode = 'C' + letters[Math.floor(Math.random()*100) % 26];
        case 'letter': serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
        /* ... etc. for all shipment types */
        default: serviceIndicatorCode = 'L' + letters[Math.floor(Math.random()*100) % 26];
    }

    /* random serial digit derived from timestamp of maxlengt 8 digits */
    let serialDigits = (new Date().getTime() % 100000000).toString(10)
    let s = serialDigits;

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
        trackingNumber
    }
    return shipmentObj;
}
