import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import generateUniqueTrackingNumber, { isValidTrackingNumber } from './tracking'


export default ({ config, db }) => {
    let api = Router();

    // mount the facets resource
    api.use('/facets', facets({ config, db }));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.status(200).json({ version, text: 'some' });
    });

    // get a tracking object with states etc. by tracking number
    api.get('/tracking', (req, res) => {
        // console.log('req.query: ', req.query);

        /* opt out if the tracking number is not valid because of checksum */
        if (req.query.trackingNumber && !isValidTrackingNumber(req.query.trackingNumber)){
            res.status(200).json({ error: `The tracking number is invalid`});
            return
        }else if (!req.query.trackingNumber){
            res.status(403).json({ error: `Pls provide a valid tracking number`});
            return
        }

        const details = { 'trackingNumber': req.query.trackingNumber };
        db.collection('shipment').findOne(details)
            .then(item => {
                /* if item exists, send back the item with its states, otherwise send error message */
                let json = (item) ? item : { error: `Could not find tracking information for ${req.query.trackingNumber}` }
                res.status(200).json(json);
            }).catch(err => {
            console.log('err', err)
            res.json({ error: `An error has occurred while searching for ${req.query.trackingNumber} ${err}`});
        });
    });

    // create a new tracking number with mocked states data
    api.post('/tracking', (req, res) => {
        // console.log('req, res', req.body)
        if (!req || !req.body.shipmentType || !req.body.sourceAdress || !req.body.targetAdress) {
            console.log("something missing")
            res.json({ error: `A shipment has to contain a shipmentType, 
				        a sourceAdress and a targetAdress property`});
            return;
        }

        const data = req.body;

        /* Obviously 8 Digits doesn't span up a big enough range to create tracking numbers forever.
         * Since I have no major knowledge of encoding and researching it was quite tedious,
         * I went with the appoach to use a standard called S10 UPU
         * like described on https://en.wikipedia.org/wiki/S10_(UPU_standard)
         * I also added a safety mechanic that would look for collisions in the database
         * and would regenerate a new tracking number.
         *
         * A considerable improvement of security would be to add 3-4 characters to the
         * tracking number and then store these additional bits in the database.
         * This would add a certain degree of security to the tracking number lookup.
         *
         * In order to garantue a really unique tracking number in the database, we search for
         * the generated tracking number within the db and generate a new tracking number
         * until there is no collision anymore. This approach assumes that the
         * database is cleared or archived after a fixed period of time to continually allow to
         * produce really unique tracking numbers and not run out of available slots.
         * tl;dr;
         */
        let shipmentObj, details;
        let findTrackingNumber = () => {
            generateUniqueTrackingNumber(data)
                .then((result) => {
                    shipmentObj = result;
                    console.log('shipmentObj', shipmentObj)

                    details = { trackingNumber: shipmentObj.trackingNumber }
                    return db.collection('shipment').findOne(details)
                })
                .then(item => {
                    /* if an item with this tracking number was found, it is found in item
                     * otherwise its null and we generate a new tracking number recursively
                     */
                    item !== null && findTrackingNumber()
                    console.log('item',
                        item && JSON.stringify(item))
                    return db.collection('shipment').insertOne(shipmentObj)
                })
                .catch(err => console.log({ error: `An error has occurred while inserting: ${err}`  }))
                .then(result => {
                    /* resolve of db.collection('shipment').insertOne(shipmentObj) */
                    // console.log('result.ops', result && result.ops)
                    result && result.ops && result.ops.length
                    && res.json({ data: result.ops[0], trackingNumber: shipmentObj.trackingNumber });
                })
                .catch(err => res.send({ error: `An error has occurred while sending away message: ${err}`  }))

        }
        findTrackingNumber();

    });

    /* update existing shipment by tracking number, notice and state to update */
    api.put('/tracking', (req, res) => {
        const details = { 'trackingNumber': req.body.trackingNumber }; /* db search argument */
        const trackingItem = req.body;

        db.collection('shipment').findOne(details)
            .then(item => {
                /* set scanned to true of according state and set a notice message */
                let updatedStates = item.states.slice();
                let updatedState = Object.assign({}, updatedStates[trackingItem.state]);
                updatedState.scanned = true;
                updatedState.notice = trackingItem.notice;
                updatedState.time = new Date();
                updatedStates[trackingItem.state] = updatedState;
                let updatedItem = Object.assign({}, item, { states: updatedStates });

                /* update in the db*/
                return db.collection('shipment').findOneAndUpdate(details, {$set: {states: updatedItem.states}})
            })
            .then(item => {
                let json = (item) ? item : { error: `Could not find tracking information for ${trackingItem.trackingNumber}` }
                res.status(200).json(json);
            })
            .catch(err => {
                console.log('err', err)
                res.status(404).json({ error: `${trackingItem.trackingNumber} not found. ${err}`});
            });
        /* perfectly chain it to avoid callback hell */

    });

    return api;
}
