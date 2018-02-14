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
                            item-value="value"
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
      valid: true,
      alert: null,
      editModel: {
        sourceAdress: {
          name: 'Oma Paschulke',
          street: 'Hauptstraße',
          houseNumber: '1',
          postCode: '0234',
          town: 'Hamburg',
          country: 'Deutschland'
        },
        shipmentType: 'parcel',
        targetAdress: {
          name: 'Enkel Max',
          street: 'Zielstraße',
          houseNumber: '5',
          postCode: '8983',
          town: 'München',
          country: 'Deutschland'
        }
      },
      shipmentTypesOptions: [ { text: 'parcel', value: 'parcel' },
                              { text: 'large letter', value: 'large letter' },
                              { text: 'letter', value: 'letter' },
                              { text: 'postcard', value: 'postcard' }
                              /* other shipping methods */
                            ]
    }
  },
  mounted() {
    /* no validation was build in for the administration ui because I got lazy at the end... */
    document.title = 'Shipment tracking administration'
  },
  created() {},
  methods: {
    createTrackingId(){
      let data = null;

      data = {
        shipmentType: this.editModel.shipmentType,
        sourceAdress: this.editModel.sourceAdress,
        targetAdress: this.editModel.targetAdress
      }

      api.postTrackingNumber(data)
        .then((response) => {
          // console.log('response: ', response);
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

</style>
