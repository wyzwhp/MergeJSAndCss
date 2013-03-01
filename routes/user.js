/*
 * GET home page.
 */
var http = require("http"),
	fs = require('fs'),
	url = require("url"),
	crypto = require('crypto');

var minify = function(code) {
		var UglifyJS = require("uglify-js");
		return UglifyJS.minify(code, {
			fromString: true
		})
	}
var setHeader = function(res) {
		if(!res.getHeader('Accept-Ranges')) res.setHeader('Accept-Ranges', 'bytes');
		if(!res.getHeader('ETag')) res.setHeader('ETag', new Date().valueOf());
		if(!res.getHeader('Date')) res.setHeader('Date', new Date().toUTCString());
		if(!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + (60 * 60 * 24 * 365));
		if(!res.getHeader('Last-Modified')) res.setHeader('Last-Modified', new Date().toUTCString());
	};
var getFileName = function(name) {
		var filename = crypto.createHash('md5').update(name).digest('hex');
		var ts = parseInt(filename, 36) % 1000;
		return '/ts/' + ts + '/' + filename;
	}
var getPath = function(filename) {
		filename = filename.replace(/\//g, "\\");
		return __dirname.replace("\\routes", "") + filename.substring(0, filename.lastIndexOf('\\'))
	}
var getFilePath = function(filename) {
		filename = filename.replace(/\//g, "\\");
		return __dirname.replace("\\routes", "") + filename;
	}

var getFile = function(url, callback) {
		var resultdata = '';
		url = url.split('|');
		if(url[0].indexOf('http') == 0) {
			var req = http.get(url[0], function(p_res) {
				var BufferHelper = require('bufferhelper');
				var bufferHelper = new BufferHelper();
				if(p_res.statusCode != 404) {
					p_res.on('data', function(chunk) {
						bufferHelper.concat(chunk);
					});
					p_res.on('end', function() {
						resultdata = bufferHelper.toBuffer();
						var iconv = require('iconv-lite');
						resultdata = iconv.decode(resultdata, (url[1] || 'UTF8').toUpperCase());
						resultdata = iconv.encode(resultdata, 'UTF8');
						callback('/*path --' + url[0] + '*/\r\n' + resultdata, true);
					});
				} else {
					callback('/*Read Error --' + url[0] + '*/\r\n', false);
				}
			});
		} else {
			resultdata = fs.readlink(url[0], function(err, data) {
				console.log(err);
				if(!err) {
					console.log(data);
					var iconv = require('iconv-lite');
					resultdata = iconv.encode(data, 'UTF8');
					callback('/*path --' + url[0] + '*/\r\n' + resultdata, true);
				} else {
					callback('/*Read Error --' + url[0] + '*/\r\n', false);
				}
			});

		}
	}

exports.index = function(req, res) {
	res.render('index', {
		title: 'Js minify And Css minify'
	});
};

exports.js = function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	if(req.query) {
		if(req.query.file && req.query.file != '') {
			var fsArray = req.query.file.split(','),
				filename = getFileName(req.query.file);
			console.log(req.headers['if-none-match']);
			if(!req.headers['if-none-match']) {
				var js = [],
					num = 0;
				for(file in fsArray) {
					if(req.query.host && fsArray[file].indexOf('http') != 0) {
						fsArray[file] = req.query.host + fsArray[file];
					}
					getFile(fsArray[file], function(jsstr) {
						num++;
						js = js.concat([jsstr]);
						if(num == fsArray.length) {
							var jscode = req.query.type == "debug" ? js.join('') : minify(js.join('')).code,
								pathname = getPath(filename);

							if(req.query.type == "release") {
								fs.exists(pathname, function(exists) {
									var writeFile = function() {
											fs.writeFile(getFilePath(filename), jscode, 'utf8', function(err) {
												if(!err) {
													setHeader(res);
												}
												res.send(jscode);
											})
										}
									if(!exists) {
										fs.mkdir(pathname, function() {
											writeFile()
										})
									} else {
										writeFile();
									}

								});

							}
						}
					});
				}
			} else {
				res.redirect(filename);
			}

		}
	}

}



exports.css = function(req, res) {
	res.setHeader("Content-Type", "text/css");
	if(req.query) {
		if(req.query.file && req.query.file != '') {
			var fsArray = req.query.file.split(',');
			var css = [],
				num = 0;
			for(file in fsArray) {
				if(req.query.host && fsArray[file].indexOf('http') != 0) {
					fsArray[file] = req.query.host + fsArray[file];
				}
				getFile(fsArray[file], function(cssstr) {
					num++;
					css = css.concat([cssstr]);
					if(num == fsArray.length) {
						if(req.query.type) {
							res.send(new Buffer(css.join('')));
						} else {
							var cleanCSS = require('clean-css');
							res.send(new Buffer(cleanCSS.process(css.join(''))));
						}
					}
				});
			}

		}
	}

};