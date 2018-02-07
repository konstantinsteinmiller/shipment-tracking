<template>
  <div>
    <div>
      <img src="../assets/logo.png" class="tracking-number__logo">
    </div>
    <div class="tracking-number">
      <div class="tracking-number__header">
        <h1>{{title}}</h1>
        <h4>{{subTitle}}</h4>
      </div>
      <div class="tracking-number__panel">
        <div class="tracking-number__input">
          <div class="tracking-number__label">Enter tracking number of your shipment</div>
          <input id="tracking-number" type="text" v-model="trackingItem.id" placeholder="XXXXXXX12313XXXXX01">
          <div v-if="validateTrackingNumber" class="tracking-number__validation-message">A tracking number can only contain alphanumerical numbers and letters</div>
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
        <h3>Status for tracking number {this.trackingItem.id}</h3>
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
      trackingItem: { id: 'ASDASDS13123213', states: [] }
    }
  },
  computed: {
    validateTrackingNumber(){
      const n = this.trackingItem.id;
      return n && typeof n === 'string' && n.length > 0 && /[^\dA-Za-z]{1,}/.test(n)
    },
    id(){
      return (this.$route.query && this.$route.query.id) ? this.$route.query.id : '';
    }
  },
  created() {},
  mounted() {
    document.title = 'Shipment tracking'
    this.trackingItem.id = this.id; //initialize from URL query params
//    this.searchForTrackingNumber()
    this.onInit();
  },
  methods: {
    onInit(){
      this.id && this.id !== '' && this.trackingItem.id !== '' && api.getStatus(this.trackingItem.id)
        .then((response) => {
          this.trackingItem = response
          console.log('response: ' + JSON.stringify(response, undefined, 2));
        })
        .catch(handleError);
    },
    searchForTrackingNumber(){
      this.$route.query.id = this.this.trackingItem.id
      this.$router.reload();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  .tracking-number
    &__logo
      margin-top 1em
      width 400px
      text-align left
      display inline-block
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
