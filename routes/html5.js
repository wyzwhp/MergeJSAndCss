var Html5List = function(type, res) {
		switch(type) {
		case 'Geolocation':
			{
				res.render('html5/' + type, {
					title: 'HTML5 ' + type
				});
			}
		}
	};

exports.index = function(req, res) {
	console.log(req.params);
	Html5List(req.params.type, res)
};