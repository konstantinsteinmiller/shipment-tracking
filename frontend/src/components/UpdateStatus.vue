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
                  <v-layout row wrap>
                      <v-flex xs12>
                          <div>
                            <v-text-field label="Tracking number"
                                          v-model="editModel.trackingNumber"
                                          :rules="[rules.trackingNumber]"
                                          required/>
                          </div>
                          <div>
                            <v-select label="State"
                                      v-model="editModel.state"
                                      :items="stateOptions"
                            />
                          </div>
                          <div>
                            <v-text-field label="Notification"
                                          v-model="editModel.notice"
                                          :rules="[rules.required, rules.notice]"
                                          required/>
                          </div>
                      </v-flex>

                      <v-btn block @click="createTrackingId"
                             color="primary"
                              :disabled="formIsInvalid">Update</v-btn>
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
const api = new Api()

export default {
  name: 'updatestatus',
  data() {
    return {
      title: 'Update shipment status',
      subTitle: 'Update shimpment by tracking number, state and notification',
      valid: true,
      alert: null,
      trackingNumberMaxLength: 13,
      editModel: {
        trackingNumber: '',
        state:  1,
        notice: ''
      },
      stateOptions: [ { text: 'Arrived at Niederlassung Hamburg', value: 1 },
                      { text: 'Arrived at Regionales Verteilzentrum Niedersachsen', value: 2 },
                      { text: 'Arrived at Niederlassung München', value: 3 },
                      { text: 'Delivered to customer', value: 4 } ],
      rules: {
        required: (value) => !!value || 'Required.',
        trackingNumber: (value) => {
          const n = value;
          const condition = n && typeof n === 'string' && n.length > 0 && (/[A-Za-z]{2}[\d]{9}[A-Za-z]{2}/.test(n) && (n.length === this.trackingNumberMaxLength))
          return !!condition || `A tracking number starts with 2 letters, is then followed by 9 alphanumerical numbers and ends with 2 additional letters. Its always ${ this.trackingNumberMaxLength } characters long`
        },
        notice: (value) => {
          const pattern = /[0-9\S\s]*/
          return (pattern.test(value) && value.length >= 10)  || 'Invalid notification, please enter at least 10 charaters to have a descriptive notification for the customer.'
        }
      }
    }
  },
  mounted() {
    document.title = 'ShipTrack Update Status'
  },
  computed: {
    formIsInvalid(){
      return typeof this.rules.trackingNumber(this.editModel.trackingNumber) === 'string'
             || typeof this.rules.notice(this.editModel.notice) === 'string'
    }
  },
  created() {},
  methods: {
    createTrackingId(){
      let data = null;

      data = {
        trackingNumber: this.editModel.trackingNumber,
        notice: this.editModel.notice,
        state: this.editModel.state
      }

      api.putTrackingNumber(data)
        .then((response) => {
          console.log('putTrackingNumber response: ', response);
          this.alert = { type: 'success', text: `The shipment status was updated successfully` }
        })
        .catch((err) => {
          console.log('err', err)
          this.alert = { type: 'error', text: `An error occured while saving the status update, a network problem might be the reason` }
        });
    }
  }
}
</script>

<style lang="stylus">

</style>
