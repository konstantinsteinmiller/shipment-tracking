import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import generateUniqueTrackingNumber from './tracking'


export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
        res.status(200).json({ version, text: 'some' });
	});

	// perhaps expose some API metadata at the root
	api.get('/tracking', (req, res) => {
		console.log('req.query: ', req.query);
        const details = { 'trackingNumber': req.query.trackingNumber };
        db.collection('shipment').findOne(details, (err, item) => {
            if (err) {
                console.log('err', err)
                res.json({ error: `An error has occurred while searching for ${req.query.trackingNumber} ${err}`});
            } else {
                /* if item exists, send back the item with its states, otherwise send error message */
                let json = (item) ? item : { error: `Could not find tracking information for ${req.query.trackingNumber}` }
                res.status(200).json(json);
            }
        });
	}); 

	// create a new tracking number
	api.post('/tracking', (req, res) => {
		// console.log('req, res', req.body)
        if (!req || !req.body.shipmentType || !req.body.sourceAdress || !req.body.targetAdress) {
        	console.log("something missing")
            res.json({ error: `A shipment has to contain a shipmentType, 
				a sourceAdress and a targetAdress property`});
        	return;
        }

        const data = req.body;
        console.log('generateUniqueTrackingNumber', generateUniqueTrackingNumber(data))
		let shipmentObj = generateUniqueTrackingNumber(data);


        // console.log("db.collection('shipment')", db.collection('shipment'))
        db.collection('shipment').insertOne(shipmentObj, (err, result) => {
            if (err) {
                res.send({ error: `An error has occurred while inserting: ${err}`  });
            } else {
            	console.log('result.ops', result && result.ops)
                result && result.ops && result.ops.length
				&& res.json({ data: result.ops[0], trackingNumber: shipmentObj.trackingNumber });
            }
        })
	});

	/* update existing shipment by tracking number */
	api.put('/tracking', (req, res) => {
		console.log('req.body: ', req.body, req.body.type);
		res.json({ data: req.body });
	});

	return api;
}
