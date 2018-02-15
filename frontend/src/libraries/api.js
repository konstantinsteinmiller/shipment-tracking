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
        baseURL: (process.env.NODE_ENV === '"development"') ? appConfig.apiEndpointLocal : appConfig.apiEndpointRemote,
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
