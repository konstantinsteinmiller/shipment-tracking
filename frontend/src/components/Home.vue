<template>
  <div>

    <div class="tracking-number">
      <div class="tracking-number__header">
        <h1>{{title}}</h1>
        <h4>{{subTitle}}</h4>
      </div>
      <div class="tracking-number__panel">
        <div class="tracking-number__input">
          <div class="tracking-number__label">
            Enter tracking number of your shipment
          </div>
          <input id="tracking-number" type="text"
                 v-model="trackingNumber"
                 placeholder="XXXXXXX12313XXXXX01"
                 @keyup.enter="searchForTrackingNumber()">
          <div v-if="validateTrackingNumber"
               class="tracking-number__validation-message">A tracking number can only contain alphanumerical numbers and letters. Its always {{ trackingNumberMaxLength }} characters long
          </div>
        </div>
        <div class="tracking-number__search-button">
          <button type="text"
                  @click="searchForTrackingNumber()"
                  >Find shipment
                  <i class="fa fa-search tracking-number__search-button-icon"></i>
          </button>
        </div>
      </div>
      <div class="tracking-number__history">
        <h3>Status for tracking number {{trackingNumber}}</h3>
        <div v-for="(state, index) in trackingItem.states"
             :key="'item_' + state"
             :class="{'tracking-number__history-item--active': trackingItem.states && trackingItem.states[index] && trackingItem.states[index].done}"
             class="tracking-number__history-item">

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Api, { handleError } from '../libraries/api'
import appConfig from '../../config/appConfig'
const api = new Api(appConfig.apiEndpoint)

export default {
  name: 'home',
  data() {
    return {
      title: 'Shipment tracking',
      subTitle: 'Track the status of your shipment',
      trackingItem: { id: 'ASDASDS13123213', states: [] },
      trackingNumberMaxLength: 16,
      trackingNumber: 'ASDASDS13123213'
    }
  },
  computed: {
    validateTrackingNumber(){
      const n = this.trackingNumber;
      console.log('n.length: ', n && typeof n === 'string' && n.length > 0 && (n.length < 16),  /[^\dA-Za-z]{1,}/.test(n));
      return n && typeof n === 'string' && n.length > 0 && (/[^\dA-Za-z]{1,}/.test(n) || (n.length >= this.trackingNumberMaxLength))
    },
    id(){
      return (this.$route && this.$route.params && this.$route.params.id) ? this.$route.params.id : '';
    }
  },
  created() {},
  mounted() {
    document.title = 'Shipment tracking'
    this.trackingNumber = this.id; //initialize from URL params
//    this.searchForTrackingNumber()
    this.onInit();
  },
  methods: {
    onInit(){
      this.trackingNumber && this.trackingNumber !== '' && api.getStatus(this.trackingNumber)
        .then((response) => {
          this.trackingItem = response
          console.log('response: ' + JSON.stringify(response, undefined, 2))
        })
        .catch(handleError);
    },
    searchForTrackingNumber(){
      this.$route.params.id = this.trackingNumber
      this.$router.replace({ name: 'Home', params: { id: this.trackingNumber} })
    }
  }
}
</script>


<style lang="stylus">
  .tracking-number
    &__header
      background #706c14
      padding .25em 1em
      text-align left
      color white
    &__panel
      margin 2em auto
      background #f8f8f8
      width 20em
      height auto
      box-shadow 0 0 1em 1px lightgrey
    &__input
      width 100%
      min-height 1em
      padding 1em 0
      margin .5em 0
      font-size 16px
      > *
        float left
        clear both
      input
        width calc(100% - 2.5em)
        margin .5em
        padding .5em
        font-size 16px
        &::placeholder
          color lightgrey
    &__search-button
      button
        font-size 16px
        min-width 10em
        width 100%
        padding .75em
        background #706c14
        border none
        color white
        font-weight bold
        cursor pointer
        outline-color #ff5050
      &-icon
        padding-left .5em
    &__label
      margin .5em
    &__validation-message
      color #ff5050
      text-align left
      padding .25em .5em
      font-size 12px
    &__history
      background #d0d0d0
      text-align left
      padding .5em 1em
      width calc(100% - 2em)
      &-item
        background white
</style>
