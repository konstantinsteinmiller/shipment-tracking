<template>
  <div>
    <div>
      <img src="../assets/logo.png" class="tracking-number__logo">
    </div>
    <div class="tracking-number">
      <h1>{{title}}</h1>
      <div class="tracking-number__panel">
        <div class="tracking-number__input">
          <div class="tracking-number__label">Enter tracking number of your shipment</div>
          <input id="tracking-number" type="text" v-model="trackingNumber" placeholder="e.g. XXXXXXX12313XXXXX01">
          <div v-if="validateTrackingNumber" class="tracking-number__validation-message">A tracking number can only contain alphanumerical numbers and letters</div>
        </div>
        <div class="tracking-number__search-button">
          <button type="text" @click.native="searchForTrackingNumber">Find shipment<i class="fa fa-search tracking-number__search-button-icon"></i></button>
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
  name: 'shipping status',
  data() {
    return {
      title: 'Welcome to the shipment tracking',
      trackingNumber: ''
    }
  },
  mounted() {
    document.title = 'Shipment tracking'
    this.getStatus()
  },
  computed: {
    validateTrackingNumber(){
      const n = this.trackingNumber;
      return n && typeof n === 'string' && n.length > 0 && /[^\dA-Za-z]{1,}/.test(n)
    }
  },
  created() {},
  methods: {
    getStatus(){
      api.getStatus()
        .then((response) => {
          console.log('response: ', response);
        })
        .catch(handleError);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  .tracking-number
    &__logo
      margin-top 2em
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

</style>
