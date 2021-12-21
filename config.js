'use strict';

require('dotenv').config();

var config = {
	prod: false,
    sessionSecret: 'uwotm8',
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
	x_droide: process.env.X_DROIDE,
    y_droide: process.env.Y_DROIDE,
    max_range: process.env.MAX_RANGE
}

module.exports = config;