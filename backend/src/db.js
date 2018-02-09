import { db } from './config/index'
import { MongoClient } from 'mongodb'

export default callback => {
	// connect to a database if needed, then pass it to `callback`:

    MongoClient.connect(db.uri, function(err, client) {
        err && console.warn('err: ', err);
        const table = client.db("shipmenttracking");
		// perform actions on the collection object
        console.log('-- db connection established --');
        callback(table);
        // client.close();
    });
}
