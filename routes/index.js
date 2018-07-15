let express = require('express');
let router = express.Router();

/* GET home page. */
// eslint-disable-next-line
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
