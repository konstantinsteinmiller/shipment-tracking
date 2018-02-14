/**
 * Created by Eternal on 06.02.2018.
 */
import axios from 'axios'

export let handleError = (err) => { console.warn('err: ', err); throw Error; }

let parseJSON = (json) => {
  return (json && json.data) ? json.data : null;
}

export default class Api {
  endpoint = null
  api = null

  constructor(endpoint){
    this.endpoint = endpoint
    this.api = function() {
      return axios.create({
        baseURL: endpoint,
        // baseURL: 'https://lexiq-skill.herokuapp.com/api/',
        timeout: 5000,
        // headers: {
          // 'X-ALEXA-ID': userId,
          // 'X-ALEXA-LANGUAGE': selectedLanguage,
          // 'X-UTTERANCE': utterance
        // }
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
