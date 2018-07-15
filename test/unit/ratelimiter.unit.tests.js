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

	describe('ratelimiter.canSpawn', function() {

		it('should return true', () => {
			(ratelimiter.canSpawn()).should.equal(true);
		});
	});
});
