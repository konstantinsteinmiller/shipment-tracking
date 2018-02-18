/**
 * Created by Eternal on 06.02.2018.
 */
import axios from 'axios'
import appConfig from '../../config/appConfig'

export let handleError = (err) => { console.warn('err: ', err); throw Error; }

let parseJSON = (json) => {
  return (json && json.data) ? json.data : null;
}

export default class Api {
  api = null

  constructor(){
    this.api = function() {
      return axios.create({
        baseURL: (process.env.NODE_ENV === 'development') ? appConfig.apiEndpointLocal : appConfig.apiEndpointRemote,
        timeout: 5000
      })
    }();
  }


  postTrackingNumber(data){
    return this.api.post('tracking', data)
      .then(parseJSON)
      .catch(handleError)
  }

  putTrackingNumber(data){
    return this.api.put('tracking', data)
      .then(parseJSON)
      .catch(handleError)
  }

  getStatus(trackingNumber){
    return this.api.get('tracking?trackingNumber=' + trackingNumber)
      .then(parseJSON)
      .catch(handleError)
  }
}

/*

{
  "_id"
:
  "5a84743b0ea83402b4ce3e4e", "shipmentType"
:
  "parcel", "sourceAdress"
:
  {
    "name"
  :
    "Oma Paschulke", "street"
  :
    "Hauptstraße", "houseNumber"
  :
    "1", "postCode"
  :
    "0234", "town"
  :
    "Hamburg", "country"
  :
    "Deutschland"
  }
,
  "targetAdress"
:
  {
    "name"
  :
    "Enkel Max", "street"
  :
    "Zielstraße", "houseNumber"
  :
    "5", "postCode"
  :
    "8983", "town"
  :
    "München", "country"
  :
    "Deutschland"
  }
,
  "trackingNumber"
:
  "LL299474375DE", "states"
:
  [{
    "name": "Paketshop Hamburg",
    "location": {
      "street": "Hauptstraße",
      "housenumber": "1",
      "postcode": "0234",
      "city": "Hamburg",
      "country": "Germany"
    },
    "time": "2018-02-14T17:39:07.437Z",
    "image": "small-office.svg",
    "notice": "Paket wurde um 18:39:07 an einen Fahrer übergeben\n                    und befindet sich auf dem Weg in die Niederlassung Hamburg",
    "scanned": true
  }, {
    "name": "Niederlassung Hamburg",
    "location": {
      "street": "Hamburgerstraße",
      "housenumber": "2",
      "postcode": "0234",
      "city": "Hamburg",
      "country": "Germany"
    },
    "time": "2018-02-14T20:43:01.970Z",
    "image": "office.svg",
    "scanned": true,
    "notice": "Hamburg Juhu"
  }, {
    "name": "Regionales Verteilzentrum Niedersachsen",
    "location": {
      "street": "Niedersachsener Straße",
      "housenumber": "3",
      "postcode": "23331",
      "city": "Osnabrück",
      "country": "Germany"
    },
    "time": "2018-02-14T20:39:08.315Z",
    "image": "logistic_center.svg",
    "scanned": true,
    "notice": "regio center daasa!!!!!!!!!!"
  }, {
    "name": "Niederlassung München",
    "location": {
      "street": "Oktoberfeststraße",
      "housenumber": "4",
      "postcode": "8898",
      "city": "München",
      "country": "Germany"
    },
    "time": "2018-02-14T20:42:39.510Z",
    "image": "office.svg",
    "scanned": true,
    "notice": "München & Grüß Gott"
  }, {
    "name": "Haus Enkel Max",
    "location": {
      "street": "Zielstraße",
      "housenumber": "5",
      "postcode": "8983",
      "city": "München",
      "country": "Germany"
    },
    "time": "2018-02-14T20:41:28.298Z",
    "image": "haus.png",
    "scanned": true,
    "notice": "Max hat sich gefreut über das Paket"
  }]
}*/
