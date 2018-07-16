'use strict';

const ratelimiter = require('../../src/ratelimiter');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

describe('Rate Limiter -- Unit Tests', function() {

	it('should pass 1 == 1 (canary test)', function() {
		const one = 1;
		one.should.equal(1);
	});

	afterEach(function() {
		ratelimiter.clearDB();
	});

	it('should return true if no limits', () => {
		const limits = [];
		const svcName = 'testSvc';

		ratelimiter.canSpawn(limits, svcName).should.equal(true);

	});

	it('should return false if limits malformed', () => {
		const limits = [
			{
				foo: 'bar',
				baz: 'quux'
			}
		];
		const svcName = 'testSvc';

		ratelimiter.canSpawn(limits, svcName).should.equal(false);
	});

	it('should return false whenever maxSpawns is zero', () => {
		const limits = [
			{
				maxSpawns: 0,
				seconds: 100
			}
		];
		const svcName = 'testSvc';
		ratelimiter.canSpawn(limits, svcName).should.equal(false);
	});

	it('should return true if limits allow', () => {
		const limits = [
			{
				maxSpawns: 1,
				seconds: 1
			}
		];
		const svcName = 'testSvc';
		ratelimiter.canSpawn(limits, svcName).should.equal(true);
	});

	it('should return true until limit has been reached', () => {
		const limits = [
			{
				maxSpawns: 100,
				seconds: 100
			},
			{
				maxSpawns: 2,
				seconds: 20
			}
		];

		const svcName = 'testSvc';
		ratelimiter.canSpawn(limits, svcName).should.equal(true);
		ratelimiter.canSpawn(limits, svcName).should.equal(true);
		ratelimiter.canSpawn(limits, svcName).should.equal(false);
	});

	it('should return true until limit has been reached', (done) => {
		const limits = [
			{
				maxSpawns: 4,
				seconds: 1
			},

		];

		const svcName = 'testSvc';

		for (let i=0; i<4; i++) {
			ratelimiter.canSpawn(limits, svcName).should.equal(true);
		}

		setTimeout(function() {
			for (let i=0; i<4; i++) {
				ratelimiter.canSpawn(limits, svcName).should.equal(true);
			}
			done();
		}, 2000);
	}).timeout(5000);
});
