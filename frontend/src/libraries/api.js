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


  postTrackingId(data){
    return this.api.post('tracking', data)
      .then(parseJSON)
      // .then((response) => {
      //   return response;
      // })
      .catch(handleError)
  }

  putTrackingId(data){
    return this.api.put('tracking', data)
      .then(parseJSON)
      // .then((response) => {
      //   return response;
      // })
      .catch(handleError)
  }

  getStatus(trackingNumber){
    return this.api.get('tracking?id=' + trackingNumber)
      .then(parseJSON)
      // .then(response => return response)
      .catch(handleError)
  }
}
