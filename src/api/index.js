import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

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
		console.log('req: ', req.query);
        res.status(200).json({ id: req.query.id, states: [] });
	}); 

	// create a new tracking number
	api.post('/tracking', (req, res) => {
		console.log('req.body: ', /*req,*/ req.body, req.body.type);
		res.json({ data: req.body });
	});

	/* update existing shipment by tracking number*/
	api.put('/tracking', (req, res) => {
		console.log('req.body: ', /*req,*/ req.body, req.body.type);
		res.json({ data: req.body });
	});

	return api;
}
