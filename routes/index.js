var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var json = {
		username: 'jiaqi',
		alertList: [
			{
				alert_id: 'A123'
			},{
				alert_id: 'A124'
			}
		]
	}
  res.render('index', { 
  	title: 'Express',
  	data: json 
  });
});





module.exports = router;
