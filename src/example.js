const ratelimiter = require('./ratelimiter');

ratelimiter.clearDB();

console.log(ratelimiter.canSpawn([{
	maxSpawns: 10,
	seconds: 100
}], 'fooSvc'));

for (let i=0; i<8; i++) {
	ratelimiter.canSpawn([{
		maxSpawns: 10,
		seconds: 100
	}], 'fooSvc');
}

console.log(ratelimiter.canSpawn([{
	maxSpawns: 10,
	seconds: 100
}], 'fooSvc'));

console.log(ratelimiter.canSpawn({}, 'barSvc'));

console.log(ratelimiter.canSpawn([{
	maxSpawns: 10,
	seconds: 100
}], 'fooSvc'));

console.log(ratelimiter.canSpawn([{
	maxSpawns: 1,
	seconds: 6
}], 'barSvc'));
