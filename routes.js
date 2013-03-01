exports.routings = {
	'/': {
		method: 'get',
		file: '/routes/index.js',
		processFunction: 'index'
	},
	'/js': {
		method: 'get',
		file: '/routes/index.js',
		processFunction: 'js'
	},
	'/css': {
		method: 'get',
		file: '/routes/index.js',
		processFunction: 'css'
	},
	'/html5/:type':{
		file: '/routes/html5.js',
		processFunction: 'index'
	}

};