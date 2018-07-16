'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ spawns: [] })
	.write();

module.exports.canSpawn = function(limits, serviceName) {
// limits is an array of objects, each object must have the fields:
// 'maxSpawns' and 'seconds'

	// make sure the required inputs exist, else return false
	if (!limits || !serviceName) return false;

	// if there are no limits on service spawning, return true
	if (limits.length === 0) return true;

	// UTC Timestamp of current time
	const curTime = Date.now();

	let previousSpawns, maxSpawns, seconds;
	for (let i = 0; i < limits.length; i++) {
		maxSpawns = limits[i].maxSpawns;
		seconds = limits[i].seconds;

		// if any limit object is malformed, return false
		if (maxSpawns == null || seconds == null) return false;

		// iterate through limit objects to see if requirements have been met for
		// each

		// get spawns for serviceName from db
		previousSpawns = db.get('spawns')
			.filter({ serviceName: serviceName })
			.value();
			
		// initialize spawn counter (count spawns that have occurred within the
		// given spawn window)
		// timePtr is the time when the spawn interval in question begins. We want
		// to count how many spawns have occurred since the spawn interval began.
		let counter = 0, timePtr = curTime - (seconds*1000);
		previousSpawns.forEach((previousSpawn) => {
			if (previousSpawn.timestamp >= (timePtr)) {
				counter++;
			}
		});

		// if we see more spawns than we allow, then return false
		if (counter >= maxSpawns) return false;
	}

	// spawn available, simulating in db
	db.get('spawns')
		.push({ serviceName: serviceName, timestamp: Date.now() })
		.write();

	// return true, we just spawned a new service
	return true;

};

// clear spawn DB in same context for testing purposes
module.exports.clearDB = function() {
	db.get('spawns')
		.remove()
		.write();
};
