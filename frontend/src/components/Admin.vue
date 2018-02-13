<template>

    <div class="admin">
      <v-layout row>
        <v-flex sm12 sm12>
          <v-card>
            <v-alert v-if="alert" :type="alert.type" dismissible v-model="alert">
              {{ alert.text }}
            </v-alert>
            <v-toolbar color="inspire" dark>
              <v-flex ms12 sm12 column  class="text-lg-left">
                  <v-toolbar-title>{{title}}</v-toolbar-title>
                  <span class="text-lg-right">{{subTitle}}</span>
              </v-flex>
            </v-toolbar>
            <v-list two-line>
              <v-container grid-list-xl >
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-select label="Shipment type"
                            item-value="text"
                            v-model="editModel.shipmentType"
                            :items="shipmentTypesOptions"
                  />
                  <v-layout row wrap>
                      <v-flex xs12 sm6>
                          <div>
                            <v-subheader >Source adress</v-subheader>
                            <v-text-field label="Name"
                                          v-model="editModel.sourceAdress.name"/>
                            <v-text-field label="Street"
                                          v-model="editModel.sourceAdress.street"/>
                            <v-text-field label="House number"
                                          v-model="editModel.sourceAdress.houseNumber"/>
                            <v-text-field label="Postal code"
                                          v-model="editModel.sourceAdress.postCode"/>
                            <v-text-field label="Town"
                                          v-model="editModel.sourceAdress.town"/>
                            <v-text-field label="country"
                                          v-model="editModel.sourceAdress.country"/>
                          </div>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <div>
                          <v-subheader >Target adress</v-subheader>
                          <v-text-field label="Name"
                                        v-model="editModel.targetAdress.name"/>
                          <v-text-field label="Street"
                                        v-model="editModel.targetAdress.street"/>
                          <v-text-field label="House number"
                                        v-model="editModel.targetAdress.houseNumber"/>

                          <v-text-field label="Postal code"
                                        v-model="editModel.targetAdress.postCode"/>

                          <v-text-field label="Town"
                                        v-model="editModel.targetAdress.town"/>
                          <v-text-field label="country"
                                        v-model="editModel.targetAdress.country"/>
                        </div>
                      </v-flex>

                      <v-btn block @click="createTrackingId" color="primary">submit</v-btn>
                  </v-layout>
                </v-form>
              </v-container>

            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
import Api, { handleError } from '../libraries/api'
import appConfig from '../../config/appConfig'
const api = new Api(appConfig.apiEndpoint)

export default {
  name: 'admin',
  data() {
    return {
      title: 'Administration',
      subTitle: 'Create new tracking item and receive a tracking number',
      id: '',
      trackingNumber: 'sadfsd',
      valid: true,
      alert: null,
      editModel: {
        sourceAdress: {
          name: 'Oma Paschulke',
          street: 'Hauptstraße',
          houseNumber: '3',
          postCode: '0234',
          town: 'Hamburg',
          country: 'Deutschland'
        },
        shipmentType: { text: 'parcel', value: 'parcel' },
        targetAdress: {
          name: 'Enkel Max',
          street: 'Zielstraße',
          houseNumber: '25',
          postCode: '8983',
          town: 'München',
          country: 'Deutschland'
        }
      },
      shipmentTypesOptions: [ { text: 'parcel', value: 'parcel' },
                              { text: 'large letter', value: 'large letter' },
                              { text: 'letter', value: 'letter' },
                              { text: 'postcard', value: 'postcard' }]
    }
  },
  mounted() {
    document.title = 'Shipment tracking administration'
    // this.createTrackingId({ type: 'parcel', time: new Date(), startLocation: 'Hamburg', targetLocation: 'München' })
  },
  computed: {
    validateTrackingNumber(){
      const n = 'this.id';
      return n && typeof n === 'string' && n.length > 0 && /[^\dA-Za-z]{1,}/.test(n)
    }
  },
  created() {},
  methods: {
    createTrackingId(){
      let data = null;

      data = {
        shipmentType: this.editModel.shipmentType.value,
        sourceAdress: this.editModel.sourceAdress,
        targetAdress: this.editModel.targetAdress
      }

      api.postTrackingId(data)
        .then((response) => {
          console.log('response: ', response);
          this.alert = { type: 'success', text: `A tracking number was generated for the shipment: ${response.trackingNumber}` }
        })
        .catch((err) => {
          console.log('err', err)
          this.alert = { type: 'error', text: `A tracking number could not be generated. Please enter valid information` }
        });
    }
  }
}
</script>

<style lang="stylus">
  /*.admin*/
    /*&__header*/
      /*text-align left*/

</style>
